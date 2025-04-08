import WhatsAppClient from "./src/whatsapp_client.js";
import { mkdir } from "fs/promises";
import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { writeFile, rmSync } from "fs";

// Get instance number from command line arguments
const instanceId = parseInt(process.argv[2]) || 1;
const totalInstances = 4; // Jumlah total instance yang berjalan
const authDir = `./auth_info_baileys_${instanceId}`;

// Kelas custom WhatsApp client dengan unique auth directory
class CustomWhatsAppClient extends WhatsAppClient {
  async connect() {
    try {
      await mkdir(authDir, { recursive: true });
    } catch (err) {
      if (err.code !== "EEXIST") {
        console.error(`Failed to create auth directory: ${err}`);
      }
    }

    const { state, saveCreds } = await useMultiFileAuthState(authDir);

    this.sock = makeWASocket({
      version: [2, 3000, 1015901307],
      printQRInTerminal: true,
      auth: state,
      generateHighQualityLinkPreview: true,
      msgRetryCounterCache: this.msgRetryCounterCache,
      defaultQueryTimeoutMs: undefined,
    });

    this.sock.ev.on("connection.update", (update) => {
      if (update.qr) {
        console.log(`[Instance ${instanceId}] QR Code:`, update.qr);
        writeFile(`./qrdata_${instanceId}.txt`, update.qr, (err) => {
          if (err) {
            console.error(`An error occurred while saving QR: ${err}`);
          }
        });
      }
    });

    this.sock.ev.process(async (events) => {
      if (events["connection.update"]) {
        await this.handleConnectionUpdate(events["connection.update"]);
        await saveCreds();
      }

      if (events["messages.upsert"]) {
        await this.handleMessagesUpsertWithDistribution(
          events["messages.upsert"],
        );
      }
    });

    return this.sock;
  }

  // Fungsi baru untuk mendistribusikan pesan
  async handleMessagesUpsertWithDistribution(upsert) {
    if (upsert.type === "notify") {
      for (const msg of upsert.messages) {
        if (!msg.key.fromMe && msg.key.remoteJid?.endsWith("g.us")) {
          // Ekstrak ID numerik dari group JID untuk membuat distribusi
          const groupId = msg.key.remoteJid.split("@")[0];
          // Konversi ke angka dengan mengambil beberapa digit terakhir untuk mendapatkan distribusi yang baik
          const lastDigits = groupId.slice(-6); // ambil 6 digit terakhir
          const numericId = parseInt(lastDigits, 10);

          // Hitung modulo untuk menentukan instance mana yang akan menangani grup ini
          const targetInstance = (numericId % totalInstances) + 1;

          // Hanya tangani pesan jika ini adalah instance yang tepat
          if (targetInstance === instanceId) {
            console.info(
              `[Instance ${instanceId}] new message from: ${msg.key.remoteJid} (assigned to this instance)`,
            );
            console.info(
              `[Instance ${instanceId}] replying to ${msg.key.remoteJid}`,
            );
            await this.sock.readMessages([msg.key]);
            await this.sock.sendMessage(msg.key.remoteJid, {
              text: `${this.text}`,
            });
          } else {
            console.info(
              `[Instance ${instanceId}] Ignoring message from: ${msg.key.remoteJid} (assigned to instance ${targetInstance})`,
            );
          }
        }
      }
    }
  }

  async handleConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log(`[Instance ${instanceId}] QR Code:`, qr);
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      console.log(
        `[Instance ${instanceId}] connection closed due to `,
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect,
      );

      if (
        shouldReconnect ||
        lastDisconnect?.error?.output?.statusCode === DisconnectReason.timedOut
      ) {
        await this.connect();
      } else if (
        lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut
      ) {
        rmSync(authDir, { recursive: true });
      }
    } else if (connection === "open") {
      console.log(`[Instance ${instanceId}] Connection opened`);
      writeFile(`./qrdata_${instanceId}.txt`, "", (err) => {
        if (err) {
          console.error(`An error occurred while creating the file: ${err}`);
          return;
        }
        console.log(`[Instance ${instanceId}] QR file created successfully!`);
      });
    }
  }
}

// Initialize and run the client
const whatsapp = new CustomWhatsAppClient();

whatsapp
  .connect()
  .then(() => {
    console.log(`[Instance ${instanceId}] Connected`);
  })
  .catch((error) => {
    console.error(`[Instance ${instanceId}] Connection failed:`, error);
  });
