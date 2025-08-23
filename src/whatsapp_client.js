import { makeWASocket, DisconnectReason, useMultiFileAuthState } from "baileys";
import { readFileSync, rmSync, writeFile, existsSync } from "fs";
import NodeCache from "node-cache";
import chalk from "chalk";
import pino from "pino";
import groupLinks from "../data/group.js"; // Import default
import qrcode from "qrcode-terminal";

// Logger
const logger = pino({
  level: "silent",
});

export default class WhatsAppClient {
  /**
   * @param {Object} options
   * @param {boolean} options.enableReply - Aktifkan auto-reply pesan grup
   * @param {string} options.instanceId - Instance ID for logging
   */
  constructor({ enableReply = true, instanceId = "default" } = {}) {
    // Check if iklan.txt file exists
    const iklanPath = "./data/iklan.txt";
    if (!existsSync(iklanPath)) {
      throw new Error(`Advertisement file not found: ${iklanPath}. Please create this file with your message content.`);
    }
    
    try {
      this.text = readFileSync(iklanPath, "utf-8");
    } catch (error) {
      throw new Error(`Failed to read advertisement file: ${error.message}`);
    }
    
    this.msgRetryCounterCache = new NodeCache();
    this.sock = undefined;
    this.groupInviteLinks = groupLinks;
    this.enableReply = enableReply;
    this.instanceId = instanceId;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async handleConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log(`[Instance ${this.instanceId}] Scan QR code below:`);
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log(
        chalk.red(`[Instance ${this.instanceId}] Connection closed due to:`),
        lastDisconnect?.error?.message || "Unknown error",
        `Status: ${statusCode}`,
        `Reconnecting: ${shouldReconnect}`
      );

      if (shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff, max 30s
        console.log(chalk.yellow(`[Instance ${this.instanceId}] Reconnecting in ${delay/1000}s... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`));
        
        setTimeout(async () => {
          try {
            await this.connect();
          } catch (error) {
            console.error(chalk.red(`[Instance ${this.instanceId}] Reconnection failed:`), error.message);
          }
        }, delay);
      } else if (statusCode === DisconnectReason.loggedOut) {
        console.log(chalk.yellow(`[Instance ${this.instanceId}] Logged out, removing auth session...`));
        try {
          rmSync("./auth_info_baileys", { recursive: true });
        } catch (error) {
          console.error("Error removing auth session:", error.message);
        }
        this.reconnectAttempts = 0; // Reset for fresh start
      } else {
        console.log(chalk.red(`[Instance ${this.instanceId}] Max reconnection attempts reached or permanent error`));
      }
    } else if (connection === "open") {
      console.log(chalk.green(`[Instance ${this.instanceId}] Connection opened successfully!`));
      this.reconnectAttempts = 0; // Reset on successful connection
      
      writeFile("./qrdata.txt", "", (err) => {
        if (err) {
          console.error("An error occurred while creating the file:", err);
          return;
        }
        console.log("QR data file created successfully!");
      });
    } else if (connection === "connecting") {
      console.log(chalk.blue(`[Instance ${this.instanceId}] Connecting to WhatsApp...`));
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
      auth: state,
      generateHighQualityLinkPreview: true,
      msgRetryCounterCache: this.msgRetryCounterCache,
      logger: logger,
      markOnlineOnConnect: false,
      syncFullHistory: false,
      browser: ["WhatsApp Bot", "Chrome", "4.0.0"],
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 0, // Disable timeout
      keepAliveIntervalMs: 10000,
      // Remove version specification to use default
    });


    this.sock.ev.process(async (events) => {
      if (events["connection.update"]) {
        await this.handleConnectionUpdate(events["connection.update"]);
        await saveCreds();
      }

      if (this.enableReply && events["messages.upsert"]) {
        await this.handleMessagesUpsert(events["messages.upsert"]);
      }
    });

    return this.sock;
  }

  /**
   * Join ke semua grup dari array link dengan delay antar join.
   */
  async joinGroupsFromLinks() {
    if (!this.sock) {
      throw new Error("Socket not initialized. Call connect() first.");
    }
    for (const link of this.groupInviteLinks) {
      try {
        const match = link.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);
        if (match && match[1]) {
          const inviteCode = match[1];
          await this.sock.groupAcceptInvite(inviteCode);
          console.log(`Joined group with invite code: ${inviteCode}`);
        } else {
          console.warn(`Invalid group link: ${link}`);
        }
      } catch (err) {
        console.error(`Failed to join group from link ${link}:`, err.message);
      }
      // Delay antar join (2 detik)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  getSocket() {
    return this.sock;
  }
}
