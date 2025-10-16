#!/usr/bin/env node

/**
 * Instance Runner - Runs a single WhatsApp bot instance
 * This script is used to run individual instances in separate terminals
 */

import WhatsAppClient from './core/WhatsAppClient.js';
import chalk from 'chalk';

// Get instance ID and total instances from command line arguments
const instanceId = parseInt(process.argv[2]) || 1;
const totalInstances = parseInt(process.argv[3]) || 4;

console.log(chalk.cyan.bold('\n╔════════════════════════════════════════════╗'));
console.log(chalk.cyan.bold(`║   WhatsApp Bot - Instance ${instanceId}/${totalInstances}           ║`));
console.log(chalk.cyan.bold('╚════════════════════════════════════════════╝\n'));

console.log(chalk.yellow(`Starting instance ${instanceId} of ${totalInstances}...\n`));

const client = new WhatsAppClient(instanceId, totalInstances);

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n\nShutting down instance...'));
  await client.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log(chalk.yellow('\n\nShutting down instance...'));
  await client.stop();
  process.exit(0);
});

// Start the bot
client.start().catch((error) => {
  console.error(chalk.red('Failed to start instance:'), error.message);
  process.exit(1);
});

// Keep process alive
process.stdin.resume();
