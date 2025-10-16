# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-10-16

### 🎉 Major Rewrite - CLI Edition

#### Added
- ✨ **Interactive CLI Interface** with beautiful menus powered by Inquirer.js
- 📁 **Modular Architecture** with organized folder structure
  - `src/cli/` - CLI interface modules
  - `src/core/` - Core business logic
  - `src/config/` - Configuration management
  - `src/utils/` - Utility functions
- 📝 **Built-in Advertisement Management**
  - Add, edit, delete, and list advertisements through CLI
  - No need to manually edit files
  - Editor integration for easy content creation
- 🔑 **Session Management System**
  - View all active sessions
  - Delete specific or all sessions
  - Clean session handling
- 📊 **Status Monitoring**
  - View bot statistics
  - Check active sessions count
  - Monitor advertisement count
- 🎨 **Colored Logging System**
  - Timestamp on every log
  - Instance identification
  - Color-coded messages (info, success, warning, error)
- 👥 **Group Manager Module**
  - Join groups from invite links
  - Batch group joining support
  - Rate limiting protection
- ⚙️ **Enhanced Configuration**
  - Environment variable support
  - Centralized config file
  - Easy customization
- 📚 **Comprehensive Documentation**
  - New detailed README
  - Setup guide with troubleshooting
  - Project structure documentation
  - Code style guide

#### Changed
- 🔄 **Refactored WhatsApp Client** into modular class
  - Cleaner code organization
  - Better error handling
  - Improved logging
- 🚀 **Improved Instance Management**
  - Better multi-instance support
  - Clear instance identification
  - Enhanced load distribution
- 📦 **Updated Dependencies**
  - Added Inquirer.js for interactive CLI
  - Updated to latest Baileys version
  - Better dependency management

#### Improved
- 🛡️ **Error Handling**
  - Automatic key repair for decryption errors
  - Better connection recovery
  - Graceful error messages
- ⚡ **Performance**
  - Optimized file loading
  - Better memory management
  - Efficient message processing
- 🔐 **Security**
  - Better session file handling
  - Updated .gitignore
  - Secure credential storage

#### Fixed
- 🐛 Fixed decryption errors with automatic repair
- 🐛 Improved rate limiting handling
- 🐛 Better QR code display
- 🐛 Fixed session persistence issues
- 🐛 Resolved connection stability problems

### Migration Guide

#### From 1.0.0 to 2.0.0

**Backup your data first!**

```bash
# Backup session files
cp -r auth_info_baileys_* ~/backup/

# Backup advertisement files
cp -r data/ ~/backup/
```

**Update process**:

```bash
# Pull latest changes
git pull origin master

# Install new dependencies
npm install

# Start new CLI interface
npm start
```

**Breaking Changes**:
- Main entry point changed from `single_client.js` to `src/index.js`
- Run scripts updated in package.json
- Configuration now uses centralized config file
- Shell scripts updated for new structure

**What's Preserved**:
- All session files (`auth_info_baileys_*`)
- All advertisement files in `data/`
- Environment variable names
- Core functionality

## [1.0.0] - 2024-10-15

### Initial Release

#### Features
- Basic WhatsApp bot functionality
- Auto-reply to group messages
- Multi-instance support
- Advertisement rotation
- QR code authentication
- Session persistence
- Rate limiting protection
- Decryption error handling

#### Files
- `single_client.js` - Main bot file
- `join_groups.js` - Group joining utility
- `run_instance.sh` - Instance runner script
- `ecosystem.config.js` - PM2 configuration

---

## Version Naming Convention

- **Major version** (X.0.0): Breaking changes, major rewrites
- **Minor version** (x.X.0): New features, backwards compatible
- **Patch version** (x.x.X): Bug fixes, minor improvements

## Roadmap

### [2.1.0] - Planned
- [ ] Web dashboard for monitoring
- [ ] Message templates system
- [ ] Custom command support
- [ ] Better analytics and reporting
- [ ] Database integration (optional)

### [2.2.0] - Planned
- [ ] Webhook support
- [ ] API endpoints
- [ ] Message scheduling
- [ ] Group filtering rules
- [ ] Multi-language support

### [3.0.0] - Future
- [ ] Complete web interface
- [ ] Cloud deployment templates
- [ ] Advanced automation features
- [ ] Machine learning integration
- [ ] Enterprise features

## Contributing

When adding new features, please:
1. Update this CHANGELOG.md
2. Follow semantic versioning
3. Add tests if applicable
4. Update documentation
5. Create clear commit messages

## Links

- [GitHub Repository](https://github.com/Iqbaladudu/auto-reply-wa-group)
- [Issue Tracker](https://github.com/Iqbaladudu/auto-reply-wa-group/issues)
- [Latest Release](https://github.com/Iqbaladudu/auto-reply-wa-group/releases)
