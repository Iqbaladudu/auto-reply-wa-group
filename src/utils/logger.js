/**
 * Logger utility for the WhatsApp Auto Reply Bot
 */

import pino from 'pino';
import chalk from 'chalk';

class Logger {
  constructor(instanceId = 'main', level = 'info') {
    this.instanceId = instanceId;
    this.pinoLogger = pino({ level: 'error' }); // For baileys internal logging
  }

  _formatMessage(level, ...args) {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] [Instance ${this.instanceId}]`;
    
    let colorFn;
    switch(level) {
      case 'error':
        colorFn = chalk.red;
        break;
      case 'warn':
        colorFn = chalk.yellow;
        break;
      case 'success':
        colorFn = chalk.green;
        break;
      case 'info':
      default:
        colorFn = chalk.blue;
    }
    
    console.log(colorFn(prefix), ...args);
  }

  info(...args) {
    this._formatMessage('info', ...args);
  }

  success(...args) {
    this._formatMessage('success', ...args);
  }

  warn(...args) {
    this._formatMessage('warn', ...args);
  }

  error(...args) {
    this._formatMessage('error', ...args);
  }

  getPinoLogger() {
    return this.pinoLogger;
  }
}

export default Logger;
