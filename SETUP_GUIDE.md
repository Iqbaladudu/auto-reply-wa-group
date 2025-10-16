# Setup Guide - WhatsApp Auto Reply Bot CLI

## 📦 Quick Start Guide

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/iqbaladudu/auto-reply-wa-group.git
cd auto-reply-wa-group

# Install dependencies
npm install
```

### 2. Initial Setup

#### Create your advertisement files:

```bash
# Create data directory if it doesn't exist
mkdir -p data

# Create your first advertisement
echo "Your advertisement message here" > data/iklan.txt
```

Or use the CLI menu option "Manage Advertisements" after starting the bot.

#### (Optional) Configure environment variables:

```bash
# Copy example config
cp .env.example .env

# Edit .env file with your preferred settings
nano .env
```

### 3. Running the Bot

#### Option 1: Using npm (Recommended)

```bash
npm start
```

#### Option 2: Using the shell script

```bash
./start.sh
```

#### Option 3: Direct node execution

```bash
node src/index.js
```

### 4. First Run - Connecting WhatsApp

1. Select "🚀 Start Bot (Single Instance)" from the main menu
2. A QR code will appear in your terminal
3. Open WhatsApp on your phone
4. Go to Settings → Linked Devices → Link a Device
5. Scan the QR code
6. Wait for connection to establish

**Note**: The bot will save your session, so you only need to scan the QR code once.

## 🎯 Common Tasks

### Managing Advertisements

1. From main menu, select "📝 Manage Advertisements"
2. Choose your action:
   - **List**: View all advertisements
   - **Add**: Create new advertisement
   - **Edit**: Modify existing advertisement
   - **Delete**: Remove advertisement

### Running Multiple Instances

For handling more groups efficiently:

1. Select "🚀 Start Bot (Multiple Instances)"
2. Enter the number of instances (recommended: 2-4)
3. Each instance will show a QR code
4. Scan each QR code with a different WhatsApp account
5. Groups will be automatically distributed

**Important**: You need a different WhatsApp number for each instance!

### Managing Sessions

If you need to logout or reset:

1. Select "🔑 Manage Sessions"
2. Choose:
   - **List Sessions**: View all logged-in sessions
   - **Delete Session**: Logout specific instance
   - **Delete All Sessions**: Logout all instances

## ⚙️ Configuration

### Environment Variables

Edit the `.env` file to customize behavior:

```bash
# Number of instances to run
TOTAL_INSTANCES=4

# Delay before reading messages (milliseconds)
MIN_DELAY_BEFORE_READ=500
MAX_DELAY_BEFORE_READ=1000

# Delay before sending reply (milliseconds)
MIN_DELAY_BEFORE_SEND=700
MAX_DELAY_BEFORE_SEND=1500

# Wait time when rate limited (milliseconds)
RATE_LIMIT_WAIT_TIME=30000

# Log level (error, warn, info, debug)
LOG_LEVEL=error
```

### Advertisement Rotation

The bot automatically rotates through all `.txt` files in the `data/` directory:

```
data/
├── iklan.txt     ← First ad
├── iklan2.txt    ← Second ad
└── promo.txt     ← Third ad
```

Each group will receive ads in sequence, cycling back to the first after the last.

## 🔧 Troubleshooting

### QR Code Not Showing

**Problem**: QR code doesn't appear or is garbled.

**Solutions**:
- Ensure your terminal supports UTF-8 encoding
- Try a different terminal (e.g., GNOME Terminal, Konsole, iTerm2)
- Make your terminal window larger
- Use SSH with `-Y` flag if connecting remotely

### "Cannot find module" Error

**Problem**: Module not found errors when starting.

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Connection Keeps Closing

**Problem**: Bot disconnects frequently.

**Solutions**:
- Check your internet connection
- Ensure WhatsApp is not open on other devices
- Try increasing delay values in `.env`
- Check if WhatsApp banned your number (temporary bans are common)

### Decryption Errors

**Problem**: "Failed to decrypt" or "SenderKeyRecord" errors.

**Solutions**:
- The bot will automatically attempt to repair keys
- Wait 30 seconds for automatic repair
- If persists, delete the session and reconnect
- Reduce the number of groups or instances

### Rate Limiting

**Problem**: "429" errors or rate limiting messages.

**Solutions**:
- Increase delay values in configuration
- Reduce number of active instances
- Avoid sending too many messages too quickly
- WhatsApp may temporarily restrict accounts

### Bot Not Replying

**Problem**: Bot connects but doesn't reply to messages.

**Checklist**:
- Check if advertisement files exist in `data/` folder
- Verify the bot is running (not stopped)
- Check if the group is assigned to the correct instance
- Look for errors in the console output
- Ensure the bot account is a member of the group

## 🚀 Advanced Usage

### Running as a Service (Linux/systemd)

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/wa-bot.service
```

Add:

```ini
[Unit]
Description=WhatsApp Auto Reply Bot
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/auto-reply-wa-group
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable wa-bot
sudo systemctl start wa-bot
sudo systemctl status wa-bot
```

### Running with PM2

```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start src/index.js --name wa-bot

# View logs
pm2 logs wa-bot

# Restart
pm2 restart wa-bot

# Stop
pm2 stop wa-bot
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "src/index.js"]
```

Build and run:

```bash
docker build -t wa-bot .
docker run -it --name wa-bot wa-bot
```

## 📊 Monitoring

### View Real-time Logs

The bot outputs colored logs to the console:
- 🔵 **Blue**: Information messages
- 🟢 **Green**: Success messages
- 🟡 **Yellow**: Warning messages
- 🔴 **Red**: Error messages

### Check Bot Status

Use the CLI menu option "📊 View Status" to see:
- Number of active sessions
- Total advertisements loaded
- Configuration summary

## 🔐 Security Tips

1. **Never share your session files** (`auth_info_baileys_*` folders)
2. **Don't commit session files** to git (already in `.gitignore`)
3. **Use different numbers** for multiple instances
4. **Respect WhatsApp's Terms of Service**
5. **Don't spam** - use appropriate delays
6. **Regular backups** of your session files

## 📝 Best Practices

1. **Start with one instance** to test
2. **Keep advertisements professional** and relevant
3. **Monitor the logs** regularly for errors
4. **Update dependencies** periodically (`npm update`)
5. **Test on small groups** first
6. **Have backup accounts** in case of bans
7. **Respect group rules** and admin requests

## 🆘 Getting Help

If you encounter issues:

1. Check this guide first
2. Read the main README.md
3. Check existing GitHub issues
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version)
   - Relevant log output

## 📚 Additional Resources

- [Baileys Documentation](https://github.com/WhiskeySockets/Baileys)
- [Node.js Documentation](https://nodejs.org/docs)
- [Inquirer.js Guide](https://github.com/SBoudrias/Inquirer.js)

---

**Remember**: This tool is for educational purposes. Always comply with WhatsApp's Terms of Service and respect user privacy.
