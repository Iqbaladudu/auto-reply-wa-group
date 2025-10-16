# Multi-Instance Quick Reference

## 🚀 Quick Start

### Via CLI Menu (Recommended)
```bash
npm start
# Pilih: 🪟 Launch Instances in Separate Terminals
```

### Via NPM Scripts
```bash
# Launch 4 instances in separate terminals
npm run launch 4

# Launch single instance
npm run launch-single 1 4  # Instance 1 dari 4
```

### Via Bash Scripts
```bash
# Launch multiple
bash launch-instances.sh 4 1      # 4 instances, start from 1
bash launch-instances.sh 6 3      # 6 instances, start from 3

# Launch single
bash launch-single-instance.sh 2 4  # Instance 2 dari 4
```

### Via Node Direct
```bash
# Run specific instance
node src/instance-runner.js 1 4   # Instance 1 dari 4 total
```

---

## 📊 Commands Cheatsheet

| Task | Command |
|------|---------|
| Launch via CLI | `npm start` → pilih menu terminal |
| Launch 4 instances | `bash launch-instances.sh 4` |
| Launch instance 3 | `bash launch-single-instance.sh 3 4` |
| Stop instance | Press `Ctrl+C` di terminal instance |
| Stop all | `pkill -f instance-runner.js` |
| Check running | `ps aux \| grep instance-runner` |
| View logs | Lihat di terminal window masing-masing |

---

## 🎯 Use Cases

### Scenario 1: Starting Fresh (4 Instances)
```bash
npm start
# → 🪟 Launch Instances in Separate Terminals
# → 🚀 Launch Multiple Instances
# → Total: 4
# → Start from: 1
```

### Scenario 2: Add More Instances
```bash
# Already running 4, add 2 more (total 6)
bash launch-instances.sh 6 5
```

### Scenario 3: Restart One Instance
```bash
# Stop instance 3 (Ctrl+C in its terminal)
# Restart it
bash launch-single-instance.sh 3 6
```

### Scenario 4: Testing Single Instance
```bash
# Test instance 1 only
node src/instance-runner.js 1 1
```

---

## 🔍 Monitoring

### Each Terminal Shows:
- 🔐 QR Code (if not logged in)
- 📝 Real-time logs
- 📨 Message processing
- ⚠️ Errors & warnings
- 📊 Connection status

### Check Instance Distribution:
Group `...543210@g.us` → Last 6 digits: 543210
- 543210 % 4 = 2 → **Instance 2**

---

## ⚙️ Configuration

### Setup Total Instances in Config
Edit `src/config/config.js`:
```javascript
export default {
  bot: {
    totalInstances: 4,  // Your total instances
    // ...
  }
}
```

### Sessions Location
```
auth_info_baileys_1/  → Instance 1
auth_info_baileys_2/  → Instance 2
auth_info_baileys_3/  → Instance 3
auth_info_baileys_4/  → Instance 4
```

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| No display error | Use `ssh -X` or run on desktop |
| No terminal found | `sudo apt install gnome-terminal` |
| Instance not receiving | Check group ID distribution |
| Memory issues | Reduce total instances |
| Process not stopping | `pkill -9 -f instance-runner` |

---

## 💡 Tips

✅ **DO:**
- Use separate terminals for 3+ instances
- Monitor each terminal regularly
- Restart only problematic instances
- Use different WhatsApp numbers per instance

❌ **DON'T:**
- Run on headless server without SSH X11
- Use same WhatsApp number for multiple instances
- Close terminal windows (instances will stop)
- Exceed system resources

---

## 📚 Full Documentation

- [MULTI_INSTANCE_GUIDE.md](MULTI_INSTANCE_GUIDE.md) - Complete guide
- [README.md](README.md) - Main documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup instructions

---

## 🆘 Emergency Commands

```bash
# Force kill all instances
pkill -9 -f instance-runner.js

# Remove all sessions (logout all)
rm -rf auth_info_baileys_*

# Check system resources
htop
# or
top

# Check disk usage
df -h

# Check memory
free -h
```

---

**Questions?** Check [MULTI_INSTANCE_GUIDE.md](MULTI_INSTANCE_GUIDE.md) for detailed explanations.
