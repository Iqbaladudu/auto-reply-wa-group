# WhatsApp Auto Reply Bot - CLI Edition 🤖

An interactive, modular, and easy-to-use CLI-based WhatsApp automation tool that automatically replies to messages in WhatsApp groups.

## ✨ Features

- 🎨 **Interactive CLI Interface** - Beautiful, user-friendly command-line interface
- 🔧 **Modular Architecture** - Clean, maintainable code structure
- 🚀 **Multi-Instance Support** - Run multiple bot instances for load distribution
- 🪟 **Separate Terminal Launch** - Launch each instance in its own terminal window (NEW!)
- 📝 **Easy Advertisement Management** - Add, edit, delete, and list advertisements through CLI
- 🔑 **Session Management** - Manage WhatsApp authentication sessions
- ⚙️ **Configurable Settings** - Customize delays, rate limits, and more
- 📊 **Status Monitoring** - View bot status and statistics
- 🎯 **Smart Load Distribution** - Automatically distribute groups across instances

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A terminal or command-line interface

## 🚀 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/iqbaladudu/auto-reply-wa-group.git
   ```

2. Navigate to the project directory:
   ```bash
   cd auto-reply-wa-group
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. (Optional) Copy the example environment file and configure:
   ```bash
   cp .env.example .env
   ```

## 🎮 Usage

### Start the Interactive CLI

Simply run:
```bash
npm start
```

Or if installed globally:
```bash
wa-bot
```

### CLI Menu Options

The interactive menu provides the following options:

1. **🚀 Start Bot (Single Instance)** - Start a single bot instance
2. **🚀 Start Bot (Multiple Instances)** - Start multiple instances for load distribution
3. **🪟 Launch Instances in Separate Terminals** - Launch each instance in its own terminal window (NEW!)
4. **📝 Manage Advertisements** - Add, edit, delete, or view advertisements
5. **👥 Join Groups from Links** - Automatically join WhatsApp groups from links
6. **🔑 Manage Sessions** - View and delete WhatsApp authentication sessions
7. **⚙️ Settings** - View and configure bot settings
8. **📊 View Status** - Check bot status and statistics
9. **❌ Exit** - Exit the application

### Multi-Instance Terminal Launch (NEW!)

You can now run multiple bot instances with each instance in its own terminal window. This provides:

- ✅ Better isolation and monitoring
- ✅ Independent control per instance
- ✅ Separate QR codes and logs
- ✅ Easy debugging

**Quick Start:**
```bash
# Via CLI menu
npm start
# Then select: 🪟 Launch Instances in Separate Terminals

# Or directly via script
bash launch-instances.sh 4        # Launch 4 instances
bash launch-single-instance.sh 1 4  # Launch instance 1 of 4
```

**📚 For detailed guide, see:** [MULTI_INSTANCE_GUIDE.md](MULTI_INSTANCE_GUIDE.md)
**📋 For quick reference, see:** [MULTI_INSTANCE_QUICKREF.md](MULTI_INSTANCE_QUICKREF.md)

### Advertisement Management

The bot will send advertisements from text files in the `data/` folder. You can manage them through the CLI:

- **List**: View all available advertisements
- **Add**: Create a new advertisement (opens your default editor)
- **Edit**: Modify existing advertisements
- **Delete**: Remove advertisements

Advertisements are rotated automatically when sending replies.

### Session Management

Each bot instance maintains its own WhatsApp session. You can:

- **List Sessions**: View all active sessions
- **Delete Session**: Remove a specific session (logs out that instance)
- **Delete All Sessions**: Remove all sessions at once

## 📁 Project Structure

```
auto-reply-wa-group/
├── src/
│   ├── cli/
│   │   └── menu.js              # Interactive CLI menu
│   ├── config/
│   │   └── config.js            # Configuration management
│   ├── core/
│   │   ├── WhatsAppClient.js    # WhatsApp client logic
│   │   └── GroupManager.js      # Group management
│   ├── utils/
│   │   └── logger.js            # Logging utility
│   ├── index.js                 # Main entry point
│   └── instance-runner.js       # Instance runner for separate terminals (NEW!)
├── data/
│   ├── iklan.txt                # Advertisement files
│   ├── iklan2.txt
│   └── group.js                 # Group links (optional)
├── auth_info_baileys_*/         # Session data (auto-generated)
├── launch-instances.sh          # Multi-instance launcher (NEW!)
├── launch-single-instance.sh    # Single instance launcher (NEW!)
├── .env.example                 # Environment configuration example
├── package.json
├── README.md
├── MULTI_INSTANCE_GUIDE.md      # Detailed multi-instance guide (NEW!)
└── MULTI_INSTANCE_QUICKREF.md   # Quick reference (NEW!)
```

## ⚙️ Configuration

You can configure the bot through environment variables or by editing the `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| `TOTAL_INSTANCES` | Number of bot instances | 4 |
| `MIN_DELAY_BEFORE_READ` | Minimum delay before reading messages (ms) | 500 |
| `MAX_DELAY_BEFORE_READ` | Maximum delay before reading messages (ms) | 1000 |
| `MIN_DELAY_BEFORE_SEND` | Minimum delay before sending reply (ms) | 700 |
| `MAX_DELAY_BEFORE_SEND` | Maximum delay before sending reply (ms) | 1500 |
| `RATE_LIMIT_WAIT_TIME` | Wait time when rate limited (ms) | 30000 |
| `LOG_LEVEL` | Logging level | error |

## 🔧 Advanced Usage

### Running Multiple Instances

For high-volume group management, you can run multiple instances. Each instance will handle a subset of groups based on their group IDs:

1. Select "Start Bot (Multiple Instances)" from the menu
2. Enter the number of instances you want to run
3. Each instance will scan its own QR code
4. Groups will be automatically distributed across instances

### Load Distribution Algorithm

Groups are distributed using a modulo operation on the last 6 digits of the group ID:
```javascript
targetInstance = (numericGroupId % totalInstances) + 1
```

This ensures even distribution across all running instances.

## 🐛 Troubleshooting

### QR Code Not Displaying

- Make sure your terminal supports QR code display
- Try using a different terminal emulator
- Check that `qrcode-terminal` is properly installed

### Decryption Errors

The bot includes automatic key repair functionality. If you see decryption errors:
- The bot will automatically attempt to repair the keys
- Wait for the repair process to complete
- If errors persist, delete the session and reconnect

### Rate Limiting

If you encounter rate limiting:
- The bot will automatically wait before retrying
- Consider increasing the delays in configuration
- Reduce the number of active instances

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Muhammad Iqbal**
- GitHub: [@Iqbaladudu](https://github.com/iqbaladudu)

## 🙏 Acknowledgments

- Built with [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- CLI powered by [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- Beautiful terminal output with [Chalk](https://github.com/chalk/chalk)

## ⚠️ Disclaimer

This bot is for educational purposes only. Use at your own risk. Make sure to comply with WhatsApp's Terms of Service. The authors are not responsible for any misuse of this software.

## 📝 Changelog

### Version 2.0.0
- ✨ Complete rewrite with modular architecture
- 🎨 Interactive CLI interface
- 📝 Built-in advertisement management
- 🔑 Session management tools
- 📊 Status monitoring
- ⚙️ Better configuration management
- 🐛 Improved error handling

### Version 1.0.0
- Initial release with basic functionality
