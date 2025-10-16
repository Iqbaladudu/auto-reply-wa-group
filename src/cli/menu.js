/**
 * Interactive CLI Menu for WhatsApp Auto Reply Bot
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { readdirSync, existsSync, rmSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import config from '../config/config.js';
import WhatsAppClient from '../core/WhatsAppClient.js';
import { spawn } from 'child_process';

class CLIMenu {
  constructor() {
    this.runningInstances = [];
  }

  /**
   * Display welcome banner
   */
  displayBanner() {
    console.clear();
    console.log(chalk.cyan.bold('\n╔════════════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('║   WhatsApp Auto Reply Bot - CLI Manager   ║'));
    console.log(chalk.cyan.bold('╚════════════════════════════════════════════╝\n'));
  }

  /**
   * Main menu
   */
  async showMainMenu() {
    this.displayBanner();
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '🚀 Start Bot (Single Instance)', value: 'start_single' },
          { name: '🚀 Start Bot (Multiple Instances)', value: 'start_multiple' },
          { name: '🪟 Launch Instances in Separate Terminals', value: 'launch_terminals' },
          { name: '📝 Manage Advertisements', value: 'manage_ads' },
          { name: '👥 Join Groups from Links', value: 'join_groups' },
          { name: '🔑 Manage Sessions', value: 'manage_sessions' },
          { name: '⚙️  Settings', value: 'settings' },
          { name: '📊 View Status', value: 'status' },
          { name: '❌ Exit', value: 'exit' },
        ],
      },
    ]);

    return action;
  }

  /**
   * Start single instance
   */
  async startSingleInstance() {
    console.log(chalk.yellow('\n⚙️  Starting single bot instance...\n'));
    
    const { instanceId } = await inquirer.prompt([
      {
        type: 'number',
        name: 'instanceId',
        message: 'Enter instance ID (default: 1):',
        default: 1,
      },
    ]);

    const client = new WhatsAppClient(instanceId, 1);
    await client.start();

    console.log(chalk.green('\n✓ Bot is running. Press Ctrl+C to stop.\n'));
    
    // Keep process alive
    await new Promise(() => {});
  }

  /**
   * Start multiple instances
   */
  async startMultipleInstances() {
    const { totalInstances } = await inquirer.prompt([
      {
        type: 'number',
        name: 'totalInstances',
        message: 'How many instances do you want to run?',
        default: 4,
        validate: (value) => {
          if (value < 1 || value > 10) {
            return 'Please enter a number between 1 and 10';
          }
          return true;
        },
      },
    ]);

    console.log(chalk.yellow(`\n⚙️  Starting ${totalInstances} bot instances...\n`));

    for (let i = 1; i <= totalInstances; i++) {
      const client = new WhatsAppClient(i, totalInstances);
      client.start().catch((err) => {
        console.error(chalk.red(`Failed to start instance ${i}:`, err.message));
      });
      
      // Small delay between starting instances
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log(chalk.green('\n✓ All instances started. Press Ctrl+C to stop.\n'));
    
    // Keep process alive
    await new Promise(() => {});
  }

  /**
   * Launch instances in separate terminals
   */
  async launchInstancesInTerminals() {
    console.log(chalk.cyan('\n🪟 Launch Instances in Separate Terminals\n'));
    console.log(chalk.gray('Each instance will run in its own terminal window.\n'));

    const { mode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: 'What would you like to do?',
        choices: [
          { name: '🚀 Launch Multiple Instances', value: 'multiple' },
          { name: '🎯 Launch Single Instance', value: 'single' },
          { name: '⬅️  Back to Main Menu', value: 'back' },
        ],
      },
    ]);

    if (mode === 'back') {
      return;
    }

    if (mode === 'single') {
      await this.launchSingleInstanceInTerminal();
    } else {
      await this.launchMultipleInstancesInTerminals();
    }
  }

  /**
   * Launch single instance in terminal
   */
  async launchSingleInstanceInTerminal() {
    const { instanceId } = await inquirer.prompt([
      {
        type: 'number',
        name: 'instanceId',
        message: 'Enter instance ID to launch:',
        default: 1,
        validate: (value) => {
          if (value < 1) {
            return 'Instance ID must be at least 1';
          }
          return true;
        },
      },
    ]);

    const { totalInstances } = await inquirer.prompt([
      {
        type: 'number',
        name: 'totalInstances',
        message: 'Total instances in your setup:',
        default: 4,
        validate: (value) => {
          if (value < 1 || value > 10) {
            return 'Please enter a number between 1 and 10';
          }
          if (value < instanceId) {
            return 'Total instances must be >= instance ID';
          }
          return true;
        },
      },
    ]);

    console.log(chalk.yellow('\n⚙️  Launching instance in new terminal...\n'));

    try {
      const { spawn } = await import('child_process');
      const { fileURLToPath } = await import('url');
      const { dirname, join } = await import('path');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const scriptPath = join(__dirname, '..', '..', 'launch-single-instance.sh');

      // Make script executable
      const { chmod } = await import('fs/promises');
      await chmod(scriptPath, '0755');

      // Launch script
      const child = spawn('bash', [scriptPath, instanceId.toString(), totalInstances.toString()], {
        detached: true,
        stdio: 'ignore',
      });
      
      child.unref();

      console.log(chalk.green(`✓ Instance ${instanceId} launched in new terminal!\n`));
      console.log(chalk.gray('  Check the new terminal window for QR code and logs.\n'));
    } catch (error) {
      console.log(chalk.red(`\n✗ Error: ${error.message}\n`));
      console.log(chalk.yellow('Make sure you are running in a graphical environment.\n'));
    }

    await this.pressEnterToContinue();
  }

  /**
   * Launch multiple instances in terminals
   */
  async launchMultipleInstancesInTerminals() {
    const { totalInstances } = await inquirer.prompt([
      {
        type: 'number',
        name: 'totalInstances',
        message: 'How many instances do you want to launch?',
        default: 4,
        validate: (value) => {
          if (value < 1 || value > 10) {
            return 'Please enter a number between 1 and 10';
          }
          return true;
        },
      },
    ]);

    const { startFrom } = await inquirer.prompt([
      {
        type: 'number',
        name: 'startFrom',
        message: 'Start from instance number:',
        default: 1,
        validate: (value) => {
          if (value < 1) {
            return 'Start instance must be at least 1';
          }
          if (value > totalInstances) {
            return 'Start instance cannot be greater than total instances';
          }
          return true;
        },
      },
    ]);

    console.log(chalk.yellow(`\n⚙️  Launching ${totalInstances - startFrom + 1} instances in separate terminals...\n`));

    try {
      const { spawn } = await import('child_process');
      const { fileURLToPath } = await import('url');
      const { dirname, join } = await import('path');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const scriptPath = join(__dirname, '..', '..', 'launch-instances.sh');

      // Make script executable
      const { chmod } = await import('fs/promises');
      await chmod(scriptPath, '0755');

      // Launch script
      const child = spawn('bash', [scriptPath, totalInstances.toString(), startFrom.toString()], {
        detached: true,
        stdio: 'inherit',
      });
      
      child.on('exit', (code) => {
        if (code === 0) {
          console.log(chalk.green('\n✓ All instances launched successfully!\n'));
        } else {
          console.log(chalk.red(`\n✗ Script exited with code ${code}\n`));
        }
      });

      // Wait for script to complete
      await new Promise((resolve) => {
        child.on('exit', resolve);
      });

      console.log(chalk.gray('\nEach instance is running in its own terminal window.'));
      console.log(chalk.gray('Check each terminal for QR codes and logs.\n'));
    } catch (error) {
      console.log(chalk.red(`\n✗ Error: ${error.message}\n`));
      console.log(chalk.yellow('Make sure you are running in a graphical environment.\n'));
    }

    await this.pressEnterToContinue();
  }

  /**
   * Join groups from links
   */
  async joinGroups() {
    console.log(chalk.yellow('\n⚙️  Join Groups Feature\n'));
    console.log(chalk.gray('This feature allows you to automatically join WhatsApp groups from invite links.\n'));
    
    const { method } = await inquirer.prompt([
      {
        type: 'list',
        name: 'method',
        message: 'How would you like to provide group links?',
        choices: [
          { name: '📁 Load from data/group.js file', value: 'file' },
          { name: '✏️  Enter links manually', value: 'manual' },
          { name: '⬅️  Back to Main Menu', value: 'back' },
        ],
      },
    ]);

    if (method === 'back') {
      return;
    }

    let linkArray = [];

    if (method === 'manual') {
      const { links } = await inquirer.prompt([
        {
          type: 'input',
          name: 'links',
          message: 'Enter group links (comma-separated):',
          validate: (value) => {
            if (!value.trim()) {
              return 'Please enter at least one group link';
            }
            return true;
          },
        },
      ]);

      linkArray = links.split(',').map(l => l.trim()).filter(l => l);
    }

    console.log(chalk.cyan('\n📋 Preparing to join groups...\n'));
    
    const { instanceId } = await inquirer.prompt([
      {
        type: 'number',
        name: 'instanceId',
        message: 'Enter instance ID to use for joining (default: 999):',
        default: 999,
      },
    ]);

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Start joining groups? Make sure you have scanned the QR code.',
        default: true,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('\nCancelled.\n'));
      await this.pressEnterToContinue();
      return;
    }

    try {
      console.log(chalk.yellow('\n⚙️  Starting WhatsApp connection for group joining...\n'));
      
      // Import required modules
      const WhatsAppClient = (await import('../core/WhatsAppClient.js')).default;
      const GroupManager = (await import('../core/GroupManager.js')).default;

      // Create client
      const client = new WhatsAppClient(instanceId, 1);
      
      // Start connection
      await client.start();
      
      console.log(chalk.green('\n✓ WhatsApp connected!\n'));
      console.log(chalk.yellow('Waiting 5 seconds for connection to stabilize...\n'));
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Create group manager
      const groupManager = new GroupManager(client);

      // Join groups
      console.log(chalk.cyan('\n🚀 Starting group join process...\n'));
      
      let results;
      if (method === 'manual') {
        results = await groupManager.joinGroupsFromLinks(linkArray);
      } else {
        results = await groupManager.joinGroupsFromLinks();
      }

      // Display results
      console.log(chalk.cyan('\n' + '═'.repeat(50)));
      console.log(chalk.green.bold('\n📊 Join Groups Summary:\n'));
      console.log(chalk.white(`Total Links Processed: ${results.total}`));
      console.log(chalk.green(`✓ Successfully Joined: ${results.success}`));
      console.log(chalk.red(`✗ Failed: ${results.failed}`));
      console.log(chalk.cyan('\n' + '═'.repeat(50) + '\n'));

      if (results.failed > 0) {
        console.log(chalk.yellow('Failed groups:'));
        results.details
          .filter(r => !r.success)
          .forEach((r, i) => {
            console.log(chalk.gray(`  ${i + 1}. ${r.link}`));
            console.log(chalk.red(`     Error: ${r.error}\n`));
          });
      }

      // Stop client
      console.log(chalk.yellow('\nStopping WhatsApp connection...\n'));
      await client.stop();
      console.log(chalk.green('✓ Done!\n'));

    } catch (error) {
      console.log(chalk.red(`\n✗ Error: ${error.message}\n`));
      console.log(chalk.gray('Make sure you have scanned the QR code and the connection is stable.\n'));
    }

    await this.pressEnterToContinue();
  }

  /**
   */
  async manageAdvertisements() {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Advertisement Management:',
        choices: [
          { name: '📋 List Advertisements', value: 'list' },
          { name: '➕ Add New Advertisement', value: 'add' },
          { name: '✏️  Edit Advertisement', value: 'edit' },
          { name: '🗑️  Delete Advertisement', value: 'delete' },
          { name: '⬅️  Back to Main Menu', value: 'back' },
        ],
      },
    ]);

    switch (action) {
      case 'list':
        await this.listAdvertisements();
        break;
      case 'add':
        await this.addAdvertisement();
        break;
      case 'edit':
        await this.editAdvertisement();
        break;
      case 'delete':
        await this.deleteAdvertisement();
        break;
      case 'back':
        return;
    }

    // Show menu again
    await this.manageAdvertisements();
  }

  /**
   * List advertisements
   */
  async listAdvertisements() {
    console.log(chalk.cyan('\n📋 Current Advertisements:\n'));
    
    const dataPath = config.paths.data;
    if (!existsSync(dataPath)) {
      console.log(chalk.yellow('No advertisements found.'));
      await this.pressEnterToContinue();
      return;
    }

    const files = readdirSync(dataPath).filter((f) => f.endsWith('.txt'));
    
    if (files.length === 0) {
      console.log(chalk.yellow('No advertisements found.'));
    } else {
      files.forEach((file, index) => {
        const content = require('fs').readFileSync(`${dataPath}/${file}`, 'utf-8');
        const preview = content.substring(0, 100) + (content.length > 100 ? '...' : '');
        console.log(chalk.white(`${index + 1}. ${file}`));
        console.log(chalk.gray(`   ${preview}\n`));
      });
    }

    await this.pressEnterToContinue();
  }

  /**
   * Add advertisement
   */
  async addAdvertisement() {
    const { filename, content } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filename',
        message: 'Enter filename (without extension):',
        validate: (value) => {
          if (!value) return 'Filename cannot be empty';
          if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
            return 'Filename can only contain letters, numbers, hyphens, and underscores';
          }
          return true;
        },
      },
      {
        type: 'editor',
        name: 'content',
        message: 'Enter advertisement content (editor will open):',
      },
    ]);

    const filepath = `${config.paths.data}/${filename}.txt`;
    await writeFile(filepath, content, 'utf-8');
    console.log(chalk.green(`\n✓ Advertisement saved to ${filename}.txt\n`));
    await this.pressEnterToContinue();
  }

  /**
   * Edit advertisement
   */
  async editAdvertisement() {
    const dataPath = config.paths.data;
    const files = readdirSync(dataPath).filter((f) => f.endsWith('.txt'));

    if (files.length === 0) {
      console.log(chalk.yellow('\nNo advertisements to edit.\n'));
      await this.pressEnterToContinue();
      return;
    }

    const { file } = await inquirer.prompt([
      {
        type: 'list',
        name: 'file',
        message: 'Select advertisement to edit:',
        choices: files,
      },
    ]);

    const filepath = `${dataPath}/${file}`;
    const currentContent = await readFile(filepath, 'utf-8');

    const { newContent } = await inquirer.prompt([
      {
        type: 'editor',
        name: 'newContent',
        message: 'Edit advertisement content:',
        default: currentContent,
      },
    ]);

    await writeFile(filepath, newContent, 'utf-8');
    console.log(chalk.green(`\n✓ Advertisement updated successfully\n`));
    await this.pressEnterToContinue();
  }

  /**
   * Delete advertisement
   */
  async deleteAdvertisement() {
    const dataPath = config.paths.data;
    const files = readdirSync(dataPath).filter((f) => f.endsWith('.txt'));

    if (files.length === 0) {
      console.log(chalk.yellow('\nNo advertisements to delete.\n'));
      await this.pressEnterToContinue();
      return;
    }

    const { file } = await inquirer.prompt([
      {
        type: 'list',
        name: 'file',
        message: 'Select advertisement to delete:',
        choices: files,
      },
    ]);

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete ${file}?`,
        default: false,
      },
    ]);

    if (confirm) {
      rmSync(`${dataPath}/${file}`);
      console.log(chalk.green(`\n✓ Advertisement deleted successfully\n`));
    } else {
      console.log(chalk.yellow('\nDeletion cancelled.\n'));
    }

    await this.pressEnterToContinue();
  }

  /**
   * Manage sessions
   */
  async manageSessions() {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Session Management:',
        choices: [
          { name: '📋 List Sessions', value: 'list' },
          { name: '🗑️  Delete Session', value: 'delete' },
          { name: '🗑️  Delete All Sessions', value: 'delete_all' },
          { name: '⬅️  Back to Main Menu', value: 'back' },
        ],
      },
    ]);

    switch (action) {
      case 'list':
        await this.listSessions();
        break;
      case 'delete':
        await this.deleteSession();
        break;
      case 'delete_all':
        await this.deleteAllSessions();
        break;
      case 'back':
        return;
    }

    await this.manageSessions();
  }

  /**
   * List sessions
   */
  async listSessions() {
    console.log(chalk.cyan('\n📋 Active Sessions:\n'));
    
    const rootDir = config.paths.root;
    const dirs = readdirSync(rootDir).filter((d) => d.startsWith('auth_info_baileys_'));

    if (dirs.length === 0) {
      console.log(chalk.yellow('No active sessions found.'));
    } else {
      dirs.forEach((dir, index) => {
        const instanceId = dir.replace('auth_info_baileys_', '');
        console.log(chalk.white(`${index + 1}. Instance ${instanceId}`));
      });
    }

    await this.pressEnterToContinue();
  }

  /**
   * Delete session
   */
  async deleteSession() {
    const rootDir = config.paths.root;
    const dirs = readdirSync(rootDir).filter((d) => d.startsWith('auth_info_baileys_'));

    if (dirs.length === 0) {
      console.log(chalk.yellow('\nNo sessions to delete.\n'));
      await this.pressEnterToContinue();
      return;
    }

    const { dir } = await inquirer.prompt([
      {
        type: 'list',
        name: 'dir',
        message: 'Select session to delete:',
        choices: dirs.map((d) => ({
          name: `Instance ${d.replace('auth_info_baileys_', '')}`,
          value: d,
        })),
      },
    ]);

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure? This will logout the bot from WhatsApp.',
        default: false,
      },
    ]);

    if (confirm) {
      rmSync(`${rootDir}/${dir}`, { recursive: true });
      console.log(chalk.green('\n✓ Session deleted successfully\n'));
    } else {
      console.log(chalk.yellow('\nDeletion cancelled.\n'));
    }

    await this.pressEnterToContinue();
  }

  /**
   * Delete all sessions
   */
  async deleteAllSessions() {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to delete ALL sessions? This cannot be undone.',
        default: false,
      },
    ]);

    if (confirm) {
      const rootDir = config.paths.root;
      const dirs = readdirSync(rootDir).filter((d) => d.startsWith('auth_info_baileys_'));
      
      dirs.forEach((dir) => {
        rmSync(`${rootDir}/${dir}`, { recursive: true });
      });

      console.log(chalk.green('\n✓ All sessions deleted successfully\n'));
    } else {
      console.log(chalk.yellow('\nDeletion cancelled.\n'));
    }

    await this.pressEnterToContinue();
  }

  /**
   * Settings menu
   */
  async showSettings() {
    while (true) {
      console.log(chalk.cyan('\n⚙️  Settings\n'));
      
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Settings Menu:',
          choices: [
            { name: '📊 View Current Settings', value: 'view' },
            { name: '⏱️  Configure Message Interval', value: 'interval' },
            { name: '⬅️  Back to Main Menu', value: 'back' },
          ],
        },
      ]);

      if (action === 'back') {
        return;
      }

      if (action === 'view') {
        await this.viewSettings();
      } else if (action === 'interval') {
        await this.configureMessageInterval();
      }
    }
  }

  /**
   * View current settings
   */
  async viewSettings() {
    console.log(chalk.cyan('\n📊 Current Settings:\n'));
    console.log(chalk.white('Bot Configuration:'));
    console.log(chalk.gray(`  Total Instances: ${config.bot.totalInstances}`));
    console.log(chalk.gray(`  Min Delay Before Read: ${config.bot.minDelayBeforeRead}ms`));
    console.log(chalk.gray(`  Max Delay Before Read: ${config.bot.maxDelayBeforeRead}ms`));
    console.log(chalk.gray(`  Min Delay Before Send: ${config.bot.minDelayBeforeSend}ms`));
    console.log(chalk.gray(`  Max Delay Before Send: ${config.bot.maxDelayBeforeSend}ms`));
    console.log(chalk.gray(`  Rate Limit Wait Time: ${config.bot.rateLimitWaitTime}ms`));
    
    console.log(chalk.white('\nMessage Interval Settings:'));
    console.log(chalk.gray(`  Message Interval: ${config.bot.messageInterval}ms (${config.bot.messageInterval / 60000} minutes)`));
    console.log(chalk.gray(`  Interval Enabled: ${config.bot.enableMessageInterval ? 'Yes' : 'No'}`));
    
    console.log(chalk.yellow('\n💡 Tip: Settings are configured via .env file or environment variables.\n'));
    
    await this.pressEnterToContinue();
  }

  /**
   * Configure message interval
   */
  async configureMessageInterval() {
    console.log(chalk.cyan('\n⏱️  Configure Message Interval\n'));
    console.log(chalk.gray('Set minimum time between messages to the same group.\n'));
    console.log(chalk.yellow('Current interval: ' + 
      `${config.bot.messageInterval / 60000} minute(s) ` +
      `(${config.bot.messageInterval}ms)\n`));

    const { intervalMinutes } = await inquirer.prompt([
      {
        type: 'list',
        name: 'intervalMinutes',
        message: 'Select message interval:',
        choices: [
          { name: '⚡ No interval (0 minutes) - Reply to every message', value: 0 },
          { name: '🕐 1 minute', value: 1 },
          { name: '🕐 2 minutes', value: 2 },
          { name: '🕐 3 minutes', value: 3 },
          { name: '🕐 5 minutes (Recommended)', value: 5 },
          { name: '🕐 10 minutes', value: 10 },
          { name: '🕐 15 minutes', value: 15 },
          { name: '🕐 30 minutes', value: 30 },
          { name: '🕐 1 hour (60 minutes)', value: 60 },
          { name: '🕐 2 hours (120 minutes)', value: 120 },
          { name: '✏️  Custom (enter manually)', value: 'custom' },
        ],
      },
    ]);

    let finalInterval;
    if (intervalMinutes === 'custom') {
      const { customMinutes } = await inquirer.prompt([
        {
          type: 'number',
          name: 'customMinutes',
          message: 'Enter custom interval in minutes:',
          validate: (value) => {
            if (value < 0) return 'Interval must be 0 or positive';
            if (isNaN(value)) return 'Please enter a valid number';
            return true;
          },
        },
      ]);
      finalInterval = customMinutes;
    } else {
      finalInterval = intervalMinutes;
    }

    const intervalMs = finalInterval * 60000;

    // Update .env file
    const { writeFile, readFile } = await import('fs/promises');
    const envPath = join(config.paths.root, '.env');
    
    try {
      let envContent = '';
      try {
        envContent = await readFile(envPath, 'utf-8');
      } catch {
        // .env doesn't exist, create new
        console.log(chalk.yellow('\n.env file not found, creating new one...\n'));
      }

      // Update or add MESSAGE_INTERVAL
      const lines = envContent.split('\n');
      let intervalUpdated = false;
      let enableUpdated = false;

      const newLines = lines.map(line => {
        if (line.startsWith('MESSAGE_INTERVAL=')) {
          intervalUpdated = true;
          return `MESSAGE_INTERVAL=${intervalMs}`;
        }
        if (line.startsWith('ENABLE_MESSAGE_INTERVAL=')) {
          enableUpdated = true;
          return `ENABLE_MESSAGE_INTERVAL=${finalInterval > 0 ? 'true' : 'false'}`;
        }
        return line;
      });

      // Add if not exists
      if (!intervalUpdated) {
        newLines.push(`MESSAGE_INTERVAL=${intervalMs}`);
      }
      if (!enableUpdated) {
        newLines.push(`ENABLE_MESSAGE_INTERVAL=${finalInterval > 0 ? 'true' : 'false'}`);
      }

      await writeFile(envPath, newLines.join('\n'), 'utf-8');

      console.log(chalk.green('\n✓ Message interval updated successfully!\n'));
      console.log(chalk.white('New Settings:'));
      console.log(chalk.gray(`  Interval: ${finalInterval} minute(s) (${intervalMs}ms)`));
      console.log(chalk.gray(`  Enabled: ${finalInterval > 0 ? 'Yes' : 'No'}`));
      
      console.log(chalk.yellow('\n⚠️  Important: You need to restart the bot for changes to take effect.\n'));
      
      if (finalInterval === 0) {
        console.log(chalk.red('⚠️  Warning: No interval means bot will reply to EVERY message!'));
        console.log(chalk.red('   This may lead to spam and potential WhatsApp ban.\n'));
      } else if (finalInterval < 5) {
        console.log(chalk.yellow('💡 Tip: Short intervals may trigger WhatsApp rate limiting.'));
        console.log(chalk.yellow('   Consider using 5+ minutes for safety.\n'));
      }

    } catch (error) {
      console.log(chalk.red(`\n✗ Error updating .env file: ${error.message}\n`));
    }

    await this.pressEnterToContinue();
  }

  /**
   * View status
   */
  async viewStatus() {
    console.log(chalk.cyan('\n📊 Bot Status\n'));
    
    const rootDir = config.paths.root;
    const activeSessions = readdirSync(rootDir).filter((d) => d.startsWith('auth_info_baileys_')).length;
    const dataPath = config.paths.data;
    const adCount = existsSync(dataPath) 
      ? readdirSync(dataPath).filter((f) => f.endsWith('.txt')).length 
      : 0;

    console.log(chalk.white(`Active Sessions: ${activeSessions}`));
    console.log(chalk.white(`Total Advertisements: ${adCount}`));
    console.log(chalk.white(`Config Total Instances: ${config.bot.totalInstances}\n`));

    await this.pressEnterToContinue();
  }

  /**
   * Helper to wait for Enter key
   */
  async pressEnterToContinue() {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press Enter to continue...',
      },
    ]);
  }

  /**
   * Start CLI
   */
  async start() {
    try {
      while (true) {
        const action = await this.showMainMenu();

        switch (action) {
          case 'start_single':
            await this.startSingleInstance();
            break;
          case 'start_multiple':
            await this.startMultipleInstances();
            break;
          case 'launch_terminals':
            await this.launchInstancesInTerminals();
            break;
          case 'manage_ads':
            await this.manageAdvertisements();
            break;
          case 'join_groups':
            await this.joinGroups();
            break;
          case 'manage_sessions':
            await this.manageSessions();
            break;
          case 'settings':
            await this.showSettings();
            break;
          case 'status':
            await this.viewStatus();
            break;
          case 'exit':
            console.log(chalk.green('\n👋 Goodbye!\n'));
            process.exit(0);
            break;
        }
      }
    } catch (error) {
      if (error.isTtyError) {
        console.error(chalk.red('Prompt couldn\'t be rendered in this environment'));
      } else {
        console.error(chalk.red('Error:'), error.message);
      }
      process.exit(1);
    }
  }
}

export default CLIMenu;
