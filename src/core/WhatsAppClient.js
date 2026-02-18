/**
 * WhatsApp Client Module
 * Handles connection and message processing for WhatsApp bot
 */

import { rmSync, readdirSync, readFileSync } from 'fs';
import { mkdir } from 'fs/promises';
import { makeWASocket, DisconnectReason, useMultiFileAuthState, isPnUser } from 'baileys';
import NodeCache from 'node-cache';
import qrcode from 'qrcode-terminal';
import config from '../config/config.js';
import Logger from '../utils/logger.js';

class WhatsAppClient {
  constructor(instanceId = 1, totalInstances = 4) {
    this.instanceId = instanceId;
    this.totalInstances = totalInstances;
    this.authDir = config.paths.auth(instanceId);
    this.logger = new Logger(instanceId);
    this.problematicGroups = new Set();
    this.iklanList = [];
    this.iklanIndex = 0;
    this.sock = null;
    this.msgRetryCounterCache = new NodeCache();
    
    // Track last message time per group (for interval control)
    this.lastMessageTime = new Map();
  }

  /**
   * Load advertisement files
   */
  loadIklanFiles() {
    try {
      const iklanFiles = readdirSync(config.paths.data)
        .filter((f) => f.endsWith('.txt'))
        .sort();
      
      this.iklanList = iklanFiles.map((file) => 
        readFileSync(`${config.paths.data}/${file}`, 'utf-8')
      );
      
      if (this.iklanList.length === 0) {
        this.logger.warn('No advertisement files found in data folder');
      } else {
        this.logger.success(`Loaded ${this.iklanList.length} advertisement file(s)`);
      }
    } catch (error) {
      this.logger.error('Failed to load advertisement files:', error.message);
    }
  }

  /**
   * Initialize directories
   */
  async initDirectories() {
    try {
      await mkdir(this.authDir, { recursive: true });
      await mkdir(config.paths.qrcodes, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        this.logger.error(`Failed to create directory: ${err.message}`);
        throw err;
      }
    }
  }

  /**
   * Attempt to repair group keys
   */
  async attemptKeyRepair(jid) {
    if (this.problematicGroups.has(jid)) {
      return; // Already being repaired
    }

    this.problematicGroups.add(jid);
    this.logger.info(`Attempting to repair keys for ${jid}`);

    try {
      // Try to get group metadata to trigger key synchronization
      await this.sock.groupMetadata(jid);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      this.logger.success(`Key repair attempted for ${jid}`);
    } catch (err) {
      this.logger.error(`Key repair failed: ${err.message}`);
    } finally {
      // Remove from list after 30 seconds
      setTimeout(() => {
        this.problematicGroups.delete(jid);
      }, 30000);
    }
  }

  /**
   * Handle connection updates
   */
  async handleConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      this.logger.info('Scan QR code below:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      this.logger.warn(
        'Connection closed:',
        lastDisconnect?.error?.message || 'Unknown reason',
        '| Reconnecting:',
        shouldReconnect
      );

      if (shouldReconnect) {
        setTimeout(() => this.start(), 3000);
      } else if (
        lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut
      ) {
        rmSync(this.authDir, { recursive: true });
        this.logger.warn('Logged out, credentials removed');
      }
    } else if (connection === 'open') {
      this.logger.success('Connection established! Bot is running.');
      this.problematicGroups.clear();
    }
  }

  /**
   * Handle incoming messages
   */
  async handleMessagesUpsert(upsert) {
    try {
      if (upsert.type === 'notify') {
        for (const msg of upsert.messages) {
          if (!msg.key.fromMe && msg.key.remoteJid?.endsWith('g.us')) {
            // Extract group ID for distribution
            let jidForRouting = msg.key.remoteJid;

            // If remoteJid is an LID and remoteJidAlt exists (implies remoteJidAlt is a PN), use remoteJidAlt for routing
            if (!isPnUser(msg.key.remoteJid) && msg.key.remoteJidAlt) {
              jidForRouting = msg.key.remoteJidAlt;
            }
            
            const groupId = jidForRouting.split('@')[0];
            const lastDigits = groupId.slice(-6);
            const numericId = parseInt(lastDigits, 10);

            // Calculate distribution
            const targetInstance = (numericId % this.totalInstances) + 1;

            // Handle only if for this instance
            if (targetInstance === this.instanceId) {
              try {
                this.logger.info(`Processing message from: ${msg.key.remoteJid}`);

                // Check message interval (if enabled)
                if (config.bot.enableMessageInterval) {
                  const lastTime = this.lastMessageTime.get(msg.key.remoteJid);
                  const now = Date.now();
                  
                  if (lastTime) {
                    const timeSinceLastMessage = now - lastTime;
                    const intervalRequired = config.bot.messageInterval;
                    
                    if (timeSinceLastMessage < intervalRequired) {
                      const waitTime = intervalRequired - timeSinceLastMessage;
                      const waitMinutes = Math.ceil(waitTime / 60000);
                      this.logger.warn(
                        `Skipping reply to ${msg.key.remoteJid} - ` +
                        `Last message sent ${Math.floor(timeSinceLastMessage / 1000)}s ago. ` +
                        `Wait ${waitMinutes} more minute(s).`
                      );
                      continue; // Skip this message
                    }
                  }
                }

                // Add delay before reading
                const minDelay = config.bot.minDelayBeforeRead;
                const maxDelay = config.bot.maxDelayBeforeRead;
                await new Promise((resolve) =>
                  setTimeout(resolve, minDelay + Math.random() * (maxDelay - minDelay))
                );

                // Read message
                await this.sock.readMessages([msg.key]);

                // Add delay before sending reply
                const minSendDelay = config.bot.minDelayBeforeSend;
                const maxSendDelay = config.bot.maxDelayBeforeSend;
                await new Promise((resolve) =>
                  setTimeout(resolve, minSendDelay + Math.random() * (maxSendDelay - minSendDelay))
                );

                const iklanToSend =
                  this.iklanList.length > 0
                    ? this.iklanList[this.iklanIndex]
                    : 'Advertisement not available yet.';
                this.iklanIndex = (this.iklanIndex + 1) % (this.iklanList.length || 1);

                // Send reply
                await this.sock.sendMessage(msg.key.remoteJid, { text: iklanToSend });

                // Update last message time for this group
                this.lastMessageTime.set(msg.key.remoteJid, Date.now());

                this.logger.success(`Successfully replied to: ${msg.key.remoteJid}`);
              } catch (err) {
                this.logger.error(`Error with message: ${err.message}`);

                // Handle decryption errors
                if (
                  err.message.includes('SenderKeyRecord') ||
                  err.message.includes('decrypt') ||
                  err.message.includes('No session')
                ) {
                  this.logger.warn(`Decryption error for ${msg.key.remoteJid}, attempting repair`);
                  await this.attemptKeyRepair(msg.key.remoteJid);
                } else if (err.data === 429) {
                  // Rate limiting
                  this.logger.warn('Rate limited, waiting...');
                  await new Promise((resolve) => 
                    setTimeout(resolve, config.bot.rateLimitWaitTime)
                  );
                }
              }
            }
          }
        }
      }
    } catch (error) {
      this.logger.error('Error in message handler:', error.message);
    }
  }

  /**
   * Start WhatsApp bot
   */
  async start() {
    try {
      await this.initDirectories();
      this.loadIklanFiles();

      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

      this.sock = makeWASocket({
        auth: state,
        generateHighQualityLinkPreview: false,
        linkPreviewImageThumbnailWidth: 0,
        msgRetryCounterCache: this.msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
        logger: this.logger.getPinoLogger(),
      });

      // Register event handlers
      this.sock.ev.on('connection.update', this.handleConnectionUpdate.bind(this));
      this.sock.ev.on('messages.upsert', this.handleMessagesUpsert.bind(this));
      this.sock.ev.on('creds.update', saveCreds);

      this.logger.success('Bot initialized');
    } catch (error) {
      this.logger.error('Failed to start bot:', error.message);
      throw error;
    }
  }

  /**
   * Stop WhatsApp bot
   */
  async stop() {
    if (this.sock) {
      await this.sock.logout();
      this.logger.info('Bot stopped');
    }
  }
}

export default WhatsAppClient;
