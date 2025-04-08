import { makeWASocket, DisconnectReason, useMultiFileAuthState } from "baileys";
import { readFileSync, rmSync, writeFile } from "fs";
import NodeCache from "node-cache";
import chalk from "chalk";
import pino from "pino";

// Create a proper logger
const logger = pino({
  level: "silent", // Gunakan 'silent' untuk menghilangkan semua log
});

export default class WhatsAppClient {
  constructor() {
    this.text = readFileSync("./data/iklan.txt", "utf-8");
    this.msgRetryCounterCache = new NodeCache();
    this.sock = undefined;
  }

  async handleConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("QR Code:", qr);
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      console.log(
        "connection closed due to ",
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
        rmSync("./auth_info_baileys", { recursive: true });
      }
    } else if (connection === "open") {
      console.log("Connection opened");
      writeFile("./qrdata.txt", "", (err) => {
        if (err) {
          console.error("An error occurred while creating the file:", err);
          return;
        }
        console.log("File created successfully!");
      });
    }
  }

  async handleMessagesUpsert(upsert) {
    if (upsert.type === "notify") {
      for (const msg of upsert.messages) {
        if (!msg.key.fromMe && msg.key.remoteJid?.endsWith("g.us")) {
          console.info(chalk.bgYellow("new message from: ", msg.key.remoteJid));
          console.info(chalk.bgGreen("replying to", msg.key.remoteJid));
          await this.sock.readMessages([msg.key]);
          await this.sock.sendMessage(msg.key.remoteJid, {
            text: `${this.text}`,
          });
        }
      }
    }
  }

  async connect() {
    const { state, saveCreds } =
      await useMultiFileAuthState("auth_info_baileys");

    this.sock = makeWASocket({
      version: [2, 3000, 1015901307],
      printQRInTerminal: true,
      auth: state,
      generateHighQualityLinkPreview: true,
      msgRetryCounterCache: this.msgRetryCounterCache,
      defaultQueryTimeoutMs: undefined,
      logger: logger,
    });

    // Add QR code listener
    this.sock.ev.on("connection.update", (update) => {
      if (update.qr) {
        console.log("QR Code:", update.qr);
      }
    });

    this.sock.ev.process(async (events) => {
      if (events["connection.update"]) {
        await this.handleConnectionUpdate(events["connection.update"]);
        await saveCreds();
      }

      if (events["messages.upsert"]) {
        await this.handleMessagesUpsert(events["messages.upsert"]);
      }
    });

    return this.sock;
  }

  getSocket() {
    return this.sock;
  }
}
