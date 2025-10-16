# Multi-Instance Terminal Launch Feature

## Update Date: October 16, 2025

### 🎉 New Feature: Launch Instances in Separate Terminals

Kami telah menambahkan fitur baru yang memungkinkan Anda menjalankan multiple WhatsApp bot instances dengan setiap instance berjalan di terminal window yang terpisah!

---

## 🆕 What's New

### 1. **Instance Runner** (`src/instance-runner.js`)
- Script baru untuk menjalankan single instance
- Dapat dipanggil langsung atau melalui launcher scripts
- Mendukung graceful shutdown dengan Ctrl+C
- Display banner yang jelas untuk setiap instance

### 2. **Multi-Instance Launcher** (`launch-instances.sh`)
- Launch multiple instances sekaligus
- Setiap instance di terminal window terpisah
- Support berbagai terminal emulator (gnome-terminal, xterm, konsole, xfce4-terminal)
- Konfigurasi fleksibel (total instances, starting point)

### 3. **Single Instance Launcher** (`launch-single-instance.sh`)
- Launch satu instance spesifik
- Berguna untuk restart instance bermasalah
- Testing individual instance

### 4. **Instance Manager** (`manage-instances.sh`)
- Helper script untuk manajemen instances
- Commands: launch, status, stop, sessions, clean-session
- User-friendly interface dengan colors

### 5. **Updated CLI Menu**
- Menu baru: 🪟 Launch Instances in Separate Terminals
- Submenu untuk multiple atau single instance
- Integrated dengan existing CLI structure

### 6. **Comprehensive Documentation**
- `MULTI_INSTANCE_GUIDE.md` - Complete guide
- `MULTI_INSTANCE_QUICKREF.md` - Quick reference
- Updated `README.md` with new features

---

## 📋 Files Added/Modified

### New Files:
```
src/instance-runner.js           # Instance runner script
launch-instances.sh              # Multi-instance launcher
launch-single-instance.sh        # Single instance launcher
manage-instances.sh              # Instance management helper
MULTI_INSTANCE_GUIDE.md          # Detailed documentation
MULTI_INSTANCE_QUICKREF.md       # Quick reference
MULTI_INSTANCE_FEATURE.md        # This file
```

### Modified Files:
```
src/cli/menu.js                  # Added terminal launch menu
package.json                     # Added new npm scripts
README.md                        # Updated with new features
```

---

## 🚀 Quick Start Examples

### Via CLI (Recommended)
```bash
npm start
# Select: 🪟 Launch Instances in Separate Terminals
```

### Via Scripts
```bash
# Launch 4 instances
bash launch-instances.sh 4

# Launch single instance
bash launch-single-instance.sh 1 4

# Use manager
./manage-instances.sh launch 4
./manage-instances.sh status
./manage-instances.sh stop
```

### Via NPM
```bash
# Launch multiple
npm run launch 4

# Launch single
npm run launch-single 1 4

# Run instance directly
npm run instance 1 4
```

---

## 💡 Use Cases

### Scenario 1: Production Environment
```bash
# Launch 6 instances for handling many groups
./manage-instances.sh launch 6
```

### Scenario 2: Development/Testing
```bash
# Test single instance
bash launch-single-instance.sh 1 1
```

### Scenario 3: Scaling Up
```bash
# Already running 4, add 2 more
./manage-instances.sh launch 6 5
```

### Scenario 4: Instance Troubleshooting
```bash
# Check status
./manage-instances.sh status

# Stop problematic instance
./manage-instances.sh stop 3

# Restart it
./manage-instances.sh launch-single 3 6
```

---

## ✨ Benefits

### 1. **Better Isolation**
- Each instance runs as separate process
- Crash on one instance doesn't affect others
- Independent resource allocation

### 2. **Easier Monitoring**
- Separate logs per instance
- Clear QR codes without overlap
- Real-time status per instance

### 3. **Flexible Control**
- Start/stop individual instances
- Restart only problematic ones
- Scale up/down easily

### 4. **Debugging Made Easy**
- Error messages clearly attributed
- Can focus on specific instance
- Test changes on single instance first

### 5. **Professional Setup**
- Multiple terminal windows for production
- Clear visual separation
- Easy to showcase or monitor

---

## 🔧 Technical Details

### Terminal Emulator Support
- **gnome-terminal** (Ubuntu/GNOME)
- **xterm** (Universal)
- **konsole** (KDE)
- **xfce4-terminal** (XFCE)

Auto-detects available terminal and uses appropriate one.

### Process Management
- Each instance runs with unique process ID
- Graceful shutdown handling
- Can be stopped individually or all at once

### Session Management
- Separate auth session per instance
- Located in: `auth_info_baileys_[id]/`
- Can clean individual or all sessions

### Distribution Algorithm
Still uses same group distribution:
```javascript
const lastDigits = groupId.slice(-6);
const numericId = parseInt(lastDigits, 10);
const targetInstance = (numericId % totalInstances) + 1;
```

---

## ⚠️ Important Notes

### System Requirements
- Linux with graphical environment (X11)
- One of the supported terminal emulators
- For SSH: X11 forwarding enabled (`ssh -X`)

### Authentication
- Each instance needs separate WhatsApp number
- Or use WhatsApp Business API with multi-device
- Scan QR in each terminal window

### Resource Usage
- ~50-100MB RAM per instance
- Minimal CPU when idle
- Network bandwidth distributed

### Limitations
- Requires graphical environment (not for pure headless)
- For headless servers, use `start_multiple` mode instead
- Maximum 10 instances recommended (configurable)

---

## 🐛 Troubleshooting

### "No display found"
- Ensure running on desktop/laptop
- Or use `ssh -X` for X11 forwarding
- Or use `start_multiple` for headless

### "No compatible terminal"
```bash
sudo apt install gnome-terminal
```

### Instance not receiving messages
- Check group ID distribution
- Verify instance is logged in
- Check logs in terminal window

### Can't stop instance
```bash
# Force kill
pkill -9 -f "instance-runner.js"

# Or specific instance
pkill -9 -f "instance-runner.js 3"
```

---

## 🎯 Best Practices

1. **Start Small**: Begin with 2-3 instances, scale as needed
2. **Monitor**: Keep terminal windows visible for monitoring
3. **Separate Numbers**: Use different WhatsApp numbers per instance
4. **Regular Restarts**: Restart instances periodically for stability
5. **Backup Sessions**: Backup `auth_info_baileys_*` folders regularly
6. **Resource Check**: Monitor system resources with `htop`
7. **Log Management**: Consider redirecting logs to files for long-term storage

---

## 📚 Related Documentation

- [MULTI_INSTANCE_GUIDE.md](MULTI_INSTANCE_GUIDE.md) - Complete guide
- [MULTI_INSTANCE_QUICKREF.md](MULTI_INSTANCE_QUICKREF.md) - Quick commands
- [README.md](README.md) - Main documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup instructions

---

## 🔮 Future Enhancements

Planned improvements:
- [ ] Web dashboard for monitoring all instances
- [ ] Automatic restart on crash
- [ ] Centralized logging system
- [ ] Instance health checks
- [ ] Load balancing optimization
- [ ] PM2 integration option
- [ ] Docker support

---

## 🙏 Feedback

Have questions or suggestions? Feel free to:
- Open an issue on GitHub
- Submit a pull request
- Contact the maintainer

---

**Enjoy the new multi-instance terminal launch feature!** 🎉
