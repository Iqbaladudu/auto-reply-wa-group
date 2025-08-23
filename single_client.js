import { readFileSync, rmSync, readdirSync } from "fs";
import { mkdir } from "fs/promises";
import { makeWASocket, DisconnectReason, useMultiFileAuthState } from "baileys";
import NodeCache from "node-cache";
import qrcode from "qrcode-terminal";
import path from "path";
import pino from "pino";

// Get instance number from command line arguments
const instanceId = parseInt(process.argv[2]) || 1;
const totalInstances = parseInt(process.argv[3]) || 4;
const authDir = `./auth_info_baileys_${instanceId}`;

// Set untuk melacak grup bermasalah
const problematicGroups = new Set();

// Create a proper logger
const logger = pino({
  level: "error",
});

async function startWhatsAppBot() {
  try {
    await mkdir(authDir, { recursive: true });
    // await mkdir("./qrcodes", { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") {
      console.error(`Failed to create directory: ${err}`);
    }
  }

  let iklanList = [];
  try {
    const iklanFiles = readdirSync("./data")
      .filter((f) => f.endsWith(".txt"))
      .sort(); // urutkan jika ingin urutan konsisten
    iklanList = iklanFiles.map((file) => readFileSync(`./data/${file}`, "utf-8"));
    if (iklanList.length === 0) {
      console.warn("Tidak ada file iklan ditemukan di folder ./data");
    }
  } catch (e) {
    console.error("Gagal membaca file iklan:", e);
  }

  let iklanIndex = 0;

  const msgRetryCounterCache = new NodeCache();
  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  const sock = makeWASocket({
    auth: state,
    generateHighQualityLinkPreview: false, // Disable link preview
    linkPreviewImageThumbnailWidth: 0,
    msgRetryCounterCache: msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
    logger: logger,
  });

  // Handler untuk connection update
  async function handleConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log(`[Instance ${instanceId}] Scan QR code below:`);
      qrcode.generate(qr, { small: true });
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
      problematicGroups.clear(); // Reset daftar grup bermasalah saat koneksi baru
    }
  }

  // Fungsi untuk mencoba memperbaiki kunci grup
  async function attemptKeyRepair(jid) {
    if (problematicGroups.has(jid)) {
      return; // Sudah dalam proses perbaikan
    }

    problematicGroups.add(jid);
    console.log(
      `[Instance ${instanceId}] Attempting to repair keys for ${jid}`,
    );

    try {
      // Coba dapatkan metadata grup untuk memicu sinkronisasi kunci
      await sock.groupMetadata(jid);

      // Tunggu beberapa saat
      await new Promise((resolve) => setTimeout(resolve, 5000));

      console.log(`[Instance ${instanceId}] Key repair attempted for ${jid}`);
    } catch (err) {
      console.error(`[Instance ${instanceId}] Key repair failed:`, err);
    } finally {
      // Hapus dari daftar setelah 30 detik
      setTimeout(() => {
        problematicGroups.delete(jid);
      }, 30000);
    }
  }

  // Handler untuk pesan masuk
  async function handleMessagesUpsert(upsert) {
    try {
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
              try {
                console.log(
                  `[Instance ${instanceId}] Processing message from: ${msg.key.remoteJid}`,
                );

                // Tambahkan delay untuk mengurangi rate limiting
                await new Promise((resolve) =>
                  setTimeout(resolve, 500 + Math.random() * 1000),
                );

                // Baca pesan
                await sock.readMessages([msg.key]);

                // Tambahkan delay lagi sebelum mengirim balasan
                await new Promise((resolve) =>
                  setTimeout(resolve, 700 + Math.random() * 1500),
                );
                
                const iklanToSend = iklanList.length > 0
                  ? iklanList[iklanIndex]
                  : "Iklan belum tersedia.";
                iklanIndex = (iklanIndex + 1) % (iklanList.length || 1);

                // Kirim pesan balasan
                await sock.sendMessage(msg.key.remoteJid, { text: iklanToSend });

                console.log(
                  `[Instance ${instanceId}] Successfully replied to: ${msg.key.remoteJid}`,
                );
              } catch (err) {
                console.error(
                  `[Instance ${instanceId}] Error with message:`,
                  err.message,
                );

                // Tangani error dekripsi
                if (
                  err.message.includes("SenderKeyRecord") ||
                  err.message.includes("decrypt") ||
                  err.message.includes("No session")
                ) {
                  console.log(
                    `[Instance ${instanceId}] Decryption error for ${msg.key.remoteJid}, attempting repair`,
                  );
                  await attemptKeyRepair(msg.key.remoteJid);
                } else if (err.data === 429) {
                  // Rate limiting - tunggu lebih lama
                  console.log(
                    `[Instance ${instanceId}] Rate limited, waiting 30 seconds`,
                  );
                  await new Promise((resolve) => setTimeout(resolve, 30000));
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(
        `[Instance ${instanceId}] Error in message handler:`,
        error,
      );
    }
  }

  // Register event handlers
  sock.ev.on("connection.update", handleConnectionUpdate);
  sock.ev.on("messages.upsert", handleMessagesUpsert);
  sock.ev.on("creds.update", saveCreds);

  return sock;
}

// Start bot
console.log(
  `\n=== Starting WhatsApp Bot (Instance ${instanceId} of ${totalInstances}) ===\n`,
);
console.log(
  `This instance will handle approximately 1/${totalInstances} of all groups`,
);
console.log(`Enhanced error handling for decryption issues is enabled\n`);

startWhatsAppBot()
  .then(() => console.log(`[Instance ${instanceId}] Bot initialized`))
  .catch((err) => console.error(`[Instance ${instanceId}] Error:`, err));
