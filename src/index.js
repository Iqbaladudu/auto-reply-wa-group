#!/usr/bin/env node

/**
 * Main entry point for WhatsApp Auto Reply Bot CLI
 */

import CLIMenu from './cli/menu.js';

const menu = new CLIMenu();
menu.start();
