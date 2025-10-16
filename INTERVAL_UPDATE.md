# 🎉 Update: Message Interval Configuration Feature

## ✅ Fitur Baru yang Ditambahkan

### ⏱️ **Message Interval Control**

Sekarang Anda bisa mengatur **interval minimum** antara pengiriman pesan ke grup yang sama!

---

## 🚀 Fitur Utama

### 1. **Interval Configuration via CLI**
```bash
npm start
→ Settings
→ Configure Message Interval
→ Pilih interval (1-120 menit atau custom)
```

### 2. **Multiple Presets**
- ⚡ No interval (0 min) - Reply every message
- 🕐 1 minute - Very fast
- 🕐 2 minutes - Fast
- 🕐 3 minutes - Quick
- 🕐 **5 minutes** ⭐ **RECOMMENDED**
- 🕐 10 minutes - Conservative
- 🕐 15 minutes - Very conservative
- 🕐 30 minutes - Ultra safe
- 🕐 1 hour (60 min)
- 🕐 2 hours (120 min)
- ✏️ Custom - Input manual

### 3. **Smart Tracking**
- Per-group timer (setiap grup punya timer sendiri)
- Auto-skip jika belum waktunya
- Log informatif

### 4. **Easy Management**
- Configure via CLI menu
- View current settings
- Auto-update .env file
- Restart reminder

---

## 📝 Files Updated

### 1. `src/config/config.js`
**Added:**
```javascript
bot: {
  // ... existing config
  messageInterval: 60000,           // Default: 1 minute
  enableMessageInterval: true,      // Enable by default
}
```

### 2. `src/core/WhatsAppClient.js`
**Added:**
```javascript
// In constructor
this.lastMessageTime = new Map();  // Track per-group

// In handleMessagesUpsert
// Check interval before sending
if (config.bot.enableMessageInterval) {
  const timeSinceLastMessage = now - lastTime;
  if (timeSinceLastMessage < intervalRequired) {
    // Skip this message
    continue;
  }
}

// After sending
this.lastMessageTime.set(groupId, Date.now());
```

### 3. `src/cli/menu.js`
**Added:**
- `configureMessageInterval()` - Interactive interval setup
- `viewSettings()` - Show all settings including interval
- Updated `showSettings()` - Menu with submenu

### 4. `.env.example`
**Added:**
```bash
MESSAGE_INTERVAL=60000           # 1 minute default
ENABLE_MESSAGE_INTERVAL=true     # Enable by default
```

### 5. `MESSAGE_INTERVAL_GUIDE.md`
**Created:** Complete documentation for the feature

---

## 🎯 How to Use

### Quick Start

```bash
# 1. Start CLI
npm start

# 2. Go to Settings
→ Select "⚙️ Settings"

# 3. Configure Interval
→ Select "⏱️ Configure Message Interval"

# 4. Choose your interval
→ Select "🕐 5 minutes (Recommended)"

# 5. Restart bot
→ Stop (Ctrl+C) and start again
```

### Manual Configuration

```bash
# Edit .env
nano .env

# Add these lines
MESSAGE_INTERVAL=300000  # 5 minutes
ENABLE_MESSAGE_INTERVAL=true

# Save and restart bot
```

---

## 📊 How It Works

### Example: 5-Minute Interval

```
14:00:00 - Message 1 from Group A → ✓ Reply sent
14:02:00 - Message 2 from Group A → ⚠️ Skipped (only 2 min)
14:05:00 - Message 3 from Group A → ✓ Reply sent (5 min passed)
14:05:30 - Message 1 from Group B → ✓ Reply sent (first time)
14:06:00 - Message 2 from Group B → ⚠️ Skipped (only 30 sec)
14:10:00 - Message 3 from Group B → ✓ Reply sent (4.5 min ~5 min)
```

**Key Points:**
- ✅ Each group has independent timer
- ✅ First message always gets reply
- ✅ Subsequent messages checked against interval
- ✅ Clear logs show skip reason

---

## 🔍 Log Examples

### When Message is Skipped:
```
[14:30:25] [Instance 1] ℹ Processing message from: 6281234567890@g.us
[14:30:25] [Instance 1] ⚠ Skipping reply to 6281234567890@g.us - 
           Last message sent 120s ago. Wait 3 more minute(s).
```

### When Message is Sent:
```
[14:30:25] [Instance 1] ℹ Processing message from: 6281234567890@g.us
[14:30:26] [Instance 1] ℹ Reading message...
[14:30:27] [Instance 1] ✓ Successfully replied to: 6281234567890@g.us
```

---

## ⚙️ Configuration Options

### Via CLI (Recommended):

```bash
npm start → Settings → Configure Message Interval

Options:
┌─────────────────────────────────────────────┐
│ ⚡ No interval (0 minutes)                  │
│ 🕐 1 minute                                 │
│ 🕐 2 minutes                                │
│ 🕐 3 minutes                                │
│ 🕐 5 minutes (Recommended)       ⭐         │
│ 🕐 10 minutes                               │
│ 🕐 15 minutes                               │
│ 🕐 30 minutes                               │
│ 🕐 1 hour (60 minutes)                      │
│ 🕐 2 hours (120 minutes)                    │
│ ✏️ Custom (enter manually)                  │
└─────────────────────────────────────────────┘
```

### Via .env File:

```bash
# Interval in milliseconds
MESSAGE_INTERVAL=300000  # 5 minutes

# Enable/disable
ENABLE_MESSAGE_INTERVAL=true

# Conversion guide:
# 1 minute   = 60000
# 5 minutes  = 300000
# 10 minutes = 600000
# 30 minutes = 1800000
# 1 hour     = 3600000
```

---

## 💡 Recommendations

### For Different Use Cases:

**1. Very Active Groups (100+ messages/hour)**
```bash
MESSAGE_INTERVAL=1800000  # 30 minutes
```

**2. Active Groups (50-100 messages/hour)**
```bash
MESSAGE_INTERVAL=600000   # 10 minutes
```

**3. Normal Groups (10-50 messages/hour)**
```bash
MESSAGE_INTERVAL=300000   # 5 minutes ⭐ RECOMMENDED
```

**4. Slow Groups (<10 messages/hour)**
```bash
MESSAGE_INTERVAL=60000    # 1 minute
```

**5. Testing/Development**
```bash
MESSAGE_INTERVAL=10000    # 10 seconds
ENABLE_MESSAGE_INTERVAL=false  # or disable
```

---

## ⚠️ Important Notes

### 1. **Restart Required**
After changing interval settings, you **MUST restart** the bot:
```bash
# Stop bot (Ctrl+C)
# Start again
npm start
```

### 2. **Per-Group Tracking**
- Each group has its own timer
- Timer resets when bot restarts
- Timers stored in memory (not persistent)

### 3. **Safety Warnings**

**⚠️ No Interval (0 minutes):**
- Will reply to EVERY message
- High risk of spam detection
- May lead to WhatsApp ban
- **NOT RECOMMENDED**

**⚠️ Short Intervals (<5 minutes):**
- May trigger rate limiting
- Increased ban risk
- Use with caution

**✅ Recommended (5+ minutes):**
- Safe for most use cases
- Balanced responsiveness
- Low ban risk

---

## 🧪 Testing

### Test the Feature:

```bash
# 1. Set short interval for testing
npm start
→ Settings
→ Configure Message Interval
→ Select "1 minute"

# 2. Start bot
→ Back to Main Menu
→ Start Bot (Single Instance)

# 3. Send test messages:
   Message 1: Should get reply immediately
   Message 2 (10 sec later): Should be skipped
   Message 3 (1 min later): Should get reply

# 4. Check logs:
   Should see "Skipping reply" message
   Should see "Wait X more minute(s)"
```

---

## 🐛 Troubleshooting

### Problem: Settings not updating

**Solution:**
```bash
# 1. Check .env file was updated
cat .env | grep MESSAGE_INTERVAL

# 2. Restart bot (REQUIRED!)
npm start

# 3. Verify in settings
→ Settings → View Current Settings
```

### Problem: Bot not skipping messages

**Solution:**
```bash
# 1. Check if enabled
cat .env | grep ENABLE_MESSAGE_INTERVAL
# Should be: true

# 2. Check interval value
cat .env | grep MESSAGE_INTERVAL
# Should be > 0

# 3. Restart bot
```

### Problem: Bot not replying at all

**Solution:**
```bash
# Check if interval is too long
cat .env

# Set to reasonable value
MESSAGE_INTERVAL=300000  # 5 minutes

# Restart bot
```

---

## 📈 Benefits

### 1. **Prevent Spam**
- Limit message frequency
- Reduce spam reports
- Lower ban risk

### 2. **Rate Limit Protection**
- Respect WhatsApp limits
- Avoid 429 errors
- Smooth operation

### 3. **Professional Behavior**
- Not too aggressive
- Natural messaging pattern
- Better user experience

### 4. **Flexibility**
- Easy to configure
- Multiple presets
- Custom values
- Enable/disable on demand

---

## 📚 Documentation

Complete guide available at:
- `MESSAGE_INTERVAL_GUIDE.md` - Full documentation
- `.env.example` - Configuration examples
- `SETUP_GUIDE.md` - General setup guide

---

## 🎊 Summary

### What's New:

✅ **Message Interval Feature**
- Configure min time between messages per group
- Via CLI menu or .env file
- Multiple presets + custom
- Per-group tracking
- Smart skip logic
- Informative logs

✅ **Enhanced Settings Menu**
- View current settings
- Configure interval
- Interactive interface
- Auto-update .env

✅ **Safety Features**
- Warnings for risky settings
- Recommended defaults
- Clear documentation
- Easy testing

---

## 🚀 Get Started

```bash
# Quick setup
npm start
→ Settings
→ Configure Message Interval
→ Select "5 minutes (Recommended)"
→ Restart bot

# Start using
npm start
→ Start Bot
→ Watch logs for interval in action!
```

---

**Selamat! Sekarang bot Anda lebih aman dengan interval control! 🎉**

**Recommended Setting:** 5 minutes interval ⭐
