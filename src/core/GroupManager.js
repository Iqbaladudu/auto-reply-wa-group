/**
 * Group Manager Module
 * Handles joining WhatsApp groups from links
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import config from '../config/config.js';
import Logger from '../utils/logger.js';

class GroupManager {
  constructor(client) {
    this.client = client;
    this.logger = new Logger('group-manager');
  }

  /**
   * Load group links from file
   */
  async loadGroupLinks() {
    const groupFilePath = join(config.paths.data, 'group.js');
    
    if (!existsSync(groupFilePath)) {
      this.logger.warn('Group links file not found at data/group.js');
      return [];
    }

    try {
      // Import the ES module
      const module = await import(`file://${groupFilePath}`);
      const links = module.default || module.groupLinks || [];
      
      if (!Array.isArray(links)) {
        this.logger.error('Group links file must export an array');
        return [];
      }
      
      this.logger.success(`Loaded ${links.length} group link(s) from file`);
      return links;
    } catch (error) {
      this.logger.error('Failed to load group links:', error.message);
      return [];
    }
  }

  /**
   * Join a single group from invite code
   */
  async joinGroup(inviteCode) {
    try {
      const result = await this.client.sock.groupAcceptInvite(inviteCode);
      this.logger.success(`Successfully joined group: ${result}`);
      return { success: true, groupId: result };
    } catch (error) {
      this.logger.error(`Failed to join group: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Join multiple groups from links
   */
  async joinGroupsFromLinks(links = null) {
    const groupLinks = links || await this.loadGroupLinks();
    
    if (groupLinks.length === 0) {
      this.logger.warn('No group links to process');
      return { total: 0, success: 0, failed: 0, details: [] };
    }

    this.logger.info(`Processing ${groupLinks.length} group link(s)...`);
    
    const results = {
      total: groupLinks.length,
      success: 0,
      failed: 0,
      details: []
    };

    for (let i = 0; i < groupLinks.length; i++) {
      const link = groupLinks[i];
      this.logger.info(`[${i + 1}/${groupLinks.length}] Processing: ${link}`);
      
      // Extract invite code from link
      const inviteCode = this.extractInviteCode(link);
      
      if (!inviteCode) {
        this.logger.warn(`Invalid group link: ${link}`);
        results.failed++;
        results.details.push({ link, success: false, error: 'Invalid link format' });
        continue;
      }

      // Join the group
      const result = await this.joinGroup(inviteCode);
      
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
      }
      
      results.details.push({ link, ...result });

      // Add delay between joins to avoid rate limiting
      this.logger.info(`Waiting 3 seconds before next join...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    this.logger.success(`✓ Finished: ${results.success} success, ${results.failed} failed out of ${results.total}`);
    return results;
  }

  /**
   * Extract invite code from WhatsApp group link
   */
  extractInviteCode(link) {
    const patterns = [
      /chat\.whatsapp\.com\/([a-zA-Z0-9_-]+)/,
      /wa\.me\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = link.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Get list of joined groups
   */
  async getJoinedGroups() {
    try {
      const groups = await this.client.sock.groupFetchAllParticipating();
      return Object.values(groups);
    } catch (error) {
      this.logger.error('Failed to fetch groups:', error.message);
      return [];
    }
  }
}

export default GroupManager;
