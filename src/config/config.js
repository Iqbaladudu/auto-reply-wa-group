/**
 * Configuration file for WhatsApp Auto Reply Bot
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

export default {
  // Bot configuration
  bot: {
    totalInstances: parseInt(process.env.TOTAL_INSTANCES) || 4,
    minDelayBeforeRead: parseInt(process.env.MIN_DELAY_BEFORE_READ) || 500,
    maxDelayBeforeRead: parseInt(process.env.MAX_DELAY_BEFORE_READ) || 1000,
    minDelayBeforeSend: parseInt(process.env.MIN_DELAY_BEFORE_SEND) || 700,
    maxDelayBeforeSend: parseInt(process.env.MAX_DELAY_BEFORE_SEND) || 1500,
    rateLimitWaitTime: parseInt(process.env.RATE_LIMIT_WAIT_TIME) || 30000,
    
    // Message interval settings (in milliseconds)
    // Minimum time between messages to the same group
    messageInterval: parseInt(process.env.MESSAGE_INTERVAL) || 60000, // Default: 1 minute
    
    // Enable/disable interval checking
    enableMessageInterval: process.env.ENABLE_MESSAGE_INTERVAL !== 'false', // Default: true
  },

  // Directory paths
  paths: {
    root: rootDir,
    auth: (instanceId) => join(rootDir, `auth_info_baileys_${instanceId}`),
    data: join(rootDir, 'data'),
    qrcodes: join(rootDir, 'qrcodes'),
    logs: join(rootDir, 'logs'),
  },

  // Logger configuration
  logger: {
    level: process.env.LOG_LEVEL || 'error',
  },

  // Load iklan files
  loadIklanFiles() {
    const iklanFiles = [];
    const dataPath = this.paths.data;
    
    if (!existsSync(dataPath)) {
      return iklanFiles;
    }

    try {
      const files = readdirSync(dataPath)
        .filter((f) => f.endsWith('.txt'))
        .sort();
      
      return files.map((file) => 
        readFileSync(join(dataPath, file), 'utf-8')
      );
    } catch (error) {
      console.error('Failed to load iklan files:', error.message);
      return iklanFiles;
    }
  },
};
