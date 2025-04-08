import { readFileSync, rmSync, writeFile } from "fs";
import { mkdir } from "fs/promises";
import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import NodeCache from "node-cache";
import qrcode from "qrcode";
import path from "path";
import pino from "pino";

// Get instance number from command line arguments
const instanceId = parseInt(process.argv[2]) || 1;
const totalInstances = parseInt(process.argv[3]) || 4; // Total instances dari argument
const authDir = `./auth_info_baileys_${instanceId}`;

// Create a proper logger
const logger = pino({
  level: process.env.LOG_LEVEL || "warn",
});

async function startWhatsAppBot() {
  try {
    await mkdir(authDir, { recursive: true });
    await mkdir("./qrcodes", { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") {
      console.error(`Failed to create directory: ${err}`);
    }
  }

  const text = readFileSync("./data/iklan.txt", "utf-8");
  const msgRetryCounterCache = new NodeCache();
  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  const sock = makeWASocket({
    version: [2, 3000, 1015901307],
    printQRInTerminal: true, // Tampilkan QR di terminal
    auth: state,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache: msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
    logger: logger,
  });

  // Handler untuk connection update
  async function handleConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log(`[Instance ${instanceId}] Scan QR code below:`);

      // Opsional: Simpan QR code sebagai file
      const qrFilePath = path.join(
        "./qrcodes",
        `qrcode_instance_${instanceId}.png`,
      );
      await qrcode.toFile(qrFilePath, qr, {
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        scale: 8,
      });

      console.log(
        `[Instance ${instanceId}] QR Code also saved to: ${qrFilePath}`,
      );
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      console.log(
        `[Instance ${instanceId}] Connection closed due to`,
        lastDisconnect?.error,
        ", reconnecting:",
        shouldReconnect,
      );

      if (shouldReconnect) {
        setTimeout(() => startWhatsAppBot(), 3000);
      } else if (
        lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut
      ) {
        rmSync(authDir, { recursive: true });
        console.log(`[Instance ${instanceId}] Logged out, removed credentials`);
      }
    } else if (connection === "open") {
      console.log(
        `\n[Instance ${instanceId}] Connection established! Bot is running.\n`,
      );
    }
  }

  // Handler untuk pesan masuk dengan distribusi
  async function handleMessagesUpsert(upsert) {
    if (upsert.type === "notify") {
      for (const msg of upsert.messages) {
        if (!msg.key.fromMe && msg.key.remoteJid?.endsWith("g.us")) {
          // Ekstrak ID grup untuk distribusi
          const groupId = msg.key.remoteJid.split("@")[0];
          const lastDigits = groupId.slice(-6);
          const numericId = parseInt(lastDigits, 10);

          // Hitung distribusi
          const targetInstance = (numericId % totalInstances) + 1;

          // Tangani hanya jika untuk instance ini
          if (targetInstance === instanceId) {
            console.log(
              `[Instance ${instanceId}] Replying to message from: ${msg.key.remoteJid}`,
            );
            await sock.readMessages([msg.key]);
            await sock.sendMessage(msg.key.remoteJid, { text });
          }
        }
      }
    }
  }

  // Register event handlers
  sock.ev.on("connection.update", handleConnectionUpdate);
  sock.ev.on("messages.upsert", handleMessagesUpsert);
  sock.ev.on("creds.update", saveCreds);

  return sock;
}

// Mulai bot
console.log(
  `\n=== Starting WhatsApp Bot (Instance ${instanceId} of ${totalInstances}) ===\n`,
);
console.log(
  `This instance will handle approximately 1/${totalInstances} of all groups`,
);
console.log(`A QR code will appear below when ready to scan\n`);

startWhatsAppBot()
  .then(() => console.log(`[Instance ${instanceId}] Bot initialized`))
  .catch((err) => console.error(`[Instance ${instanceId}] Error:`, err));
