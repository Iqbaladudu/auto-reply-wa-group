# Quick Start - WhatsApp Auto Reply Bot CLI

## 🚀 3-Step Quick Start

### 1️⃣ Install
```bash
cd /home/iqbaladudu/Documents/Project/auto-reply-wa-group
npm install
```

### 2️⃣ Prepare Advertisements
```bash
# Create your first ad (or use existing ones)
echo "Your advertisement message" > data/iklan.txt
```

### 3️⃣ Start
```bash
npm start
# OR
./start.sh
```

---

## 📋 What's New in v2.0.0?

### ✨ Interactive CLI Menu
```
╔════════════════════════════════════════════╗
║   WhatsApp Auto Reply Bot - CLI Manager   ║
╚════════════════════════════════════════════╝

? What would you like to do? 
  🚀 Start Bot (Single Instance)
  🚀 Start Bot (Multiple Instances)
  📝 Manage Advertisements
  👥 Join Groups from Links
  🔑 Manage Sessions
  ⚙️  Settings
  📊 View Status
❯ ❌ Exit
```

### 🎯 Key Features

1. **No More Manual File Editing**
   - Add/edit/delete ads through CLI
   - Built-in text editor integration
   
2. **Easy Session Management**
   - View all sessions
   - Delete sessions with one click
   - No need to manually delete folders

3. **Better Organization**
   - Clean modular code structure
   - Separated concerns
   - Easy to maintain and extend

4. **Beautiful Logs**
   - Color-coded messages
   - Timestamps
   - Instance identification

---

## 📖 Common Commands

### Start Single Bot
```bash
npm start
# Select: "Start Bot (Single Instance)"
```

### Start Multiple Bots
```bash
npm start
# Select: "Start Bot (Multiple Instances)"
# Enter number of instances (e.g., 4)
```

### Manage Ads from CLI
```bash
npm start
# Select: "Manage Advertisements"
# Choose: Add/Edit/Delete/List
```

### Clean Sessions
```bash
npm start
# Select: "Manage Sessions"
# Choose: "Delete All Sessions"
```

---

## 🗂️ New Project Structure

```
auto-reply-wa-group/
├── src/
│   ├── cli/menu.js              ← Interactive menu
│   ├── core/WhatsAppClient.js   ← Bot logic
│   ├── core/GroupManager.js     ← Group utilities
│   ├── config/config.js         ← Configuration
│   ├── utils/logger.js          ← Logging
│   └── index.js                 ← Entry point
├── data/
│   └── *.txt                    ← Your ads here
├── SETUP_GUIDE.md              ← Detailed guide
├── STRUCTURE.md                ← Code documentation
└── CHANGELOG.md                ← Version history
```

---

## ⚙️ Configuration (Optional)

Create `.env` file for custom settings:

```bash
cp .env.example .env
nano .env
```

Edit values:
```bash
TOTAL_INSTANCES=4
MIN_DELAY_BEFORE_READ=500
MAX_DELAY_BEFORE_READ=1000
MIN_DELAY_BEFORE_SEND=700
MAX_DELAY_BEFORE_SEND=1500
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| QR not showing | Use different terminal, enlarge window |
| Module not found | `npm install` |
| Bot not replying | Check if ads exist in `data/` folder |
| Connection drops | Check internet, increase delays |
| Decryption error | Wait 30s for auto-repair |

---

## 📚 Documentation

- **Quick Start**: This file (QUICKSTART.md)
- **Detailed Setup**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Project Structure**: [STRUCTURE.md](./STRUCTURE.md)
- **Version History**: [CHANGELOG.md](./CHANGELOG.md)
- **Main README**: [README_NEW.md](./README_NEW.md)

---

## 💡 Tips

1. **First Time Users**
   - Start with single instance
   - Test on small groups first
   - Monitor logs for errors

2. **Multiple Instances**
   - Need different WhatsApp numbers
   - Each scans their own QR
   - Groups auto-distributed

3. **Advertisements**
   - Create multiple `.txt` files
   - They auto-rotate
   - Edit anytime through CLI

---

## 🎓 Video Tutorial (Coming Soon)

Watch the video tutorial for step-by-step guide:
- Installation
- First connection
- Managing advertisements
- Running multiple instances

---

## 🤝 Need Help?

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Read [FAQ section](#) (coming soon)
3. Open [GitHub Issue](https://github.com/Iqbaladudu/auto-reply-wa-group/issues)

---

## 📝 License

ISC License - Muhammad Iqbal

---

**Version**: 2.0.0  
**Last Updated**: October 16, 2024  
**Status**: ✅ Production Ready
