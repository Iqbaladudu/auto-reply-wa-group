# 🆕 Feature: Message Interval Configuration

## 📋 Overview

Fitur baru yang memungkinkan Anda mengatur **interval minimum antara pengiriman pesan** ke grup yang sama. Ini membantu mencegah spam dan menghindari rate limiting dari WhatsApp.

---

## ✨ Fitur Utama

### 1. ⏱️ Interval Control
- Set minimum waktu antara pesan ke grup yang sama
- Otomatis skip pesan jika belum waktunya
- Tracking per-grup (setiap grup punya timer sendiri)

### 2. 🎛️ Flexible Configuration
- Atur via CLI menu (user-friendly)
- Atau edit .env file langsung
- Support berbagai preset interval
- Custom interval (input manual)

### 3. 🛡️ Smart Features
- Auto-skip dengan log informatif
- Warning untuk interval pendek
- Per-group tracking (tidak global)
- Enable/disable on demand

---

## 🚀 Cara Menggunakan

### Method 1: Via CLI Menu (Recommended)

```bash
npm start

# Pilih: "⚙️ Settings"
# Pilih: "⏱️ Configure Message Interval"
# Pilih interval yang diinginkan:
#   - 0 minutes: Reply every message (no interval)
#   - 1 minute: Fast response
#   - 5 minutes: Recommended
#   - 10-30 minutes: Conservative
#   - 1-2 hours: Very conservative
#   - Custom: Input manual
```

### Method 2: Edit .env File

```bash
# Edit .env file
nano .env

# Set interval (in milliseconds)
MESSAGE_INTERVAL=300000  # 5 minutes

# Enable/disable
ENABLE_MESSAGE_INTERVAL=true

# Save and restart bot
```

---

## ⚙️ Configuration Options

### Preset Intervals

| Preset | Minutes | Milliseconds | Use Case |
|--------|---------|--------------|----------|
| **No interval** | 0 | 0 | Reply to every message (⚠️ risky) |
| **1 minute** | 1 | 60000 | Very fast response |
| **2 minutes** | 2 | 120000 | Fast response |
| **3 minutes** | 3 | 180000 | Quick response |
| **5 minutes** ⭐ | 5 | 300000 | **Recommended** - Balanced |
| **10 minutes** | 10 | 600000 | Conservative |
| **15 minutes** | 15 | 900000 | Very conservative |
| **30 minutes** | 30 | 1800000 | Ultra conservative |
| **1 hour** | 60 | 3600000 | Minimal activity |
| **2 hours** | 120 | 7200000 | Very minimal activity |

⭐ **Recommended**: 5 minutes - Good balance between responsiveness and safety

### Environment Variables

```bash
# .env file

# Interval in milliseconds
MESSAGE_INTERVAL=300000

# Enable/disable interval checking
ENABLE_MESSAGE_INTERVAL=true
```

---

## 🔍 How It Works

### 1. Message Received
```
[14:30:00] [Instance 1] ℹ Processing message from: 6281234567890@g.us
```

### 2. Check Last Message Time
```javascript
// Bot checks when last message was sent to this group
lastMessageTime = groupMessageTimes.get(groupId)
timeSinceLastMessage = now - lastMessageTime
```

### 3. Decision Logic

**If interval NOT reached:**
```
[14:30:01] [Instance 1] ⚠ Skipping reply to 6281234567890@g.us
           Last message sent 120s ago. Wait 3 more minute(s).
```

**If interval reached:**
```
[14:30:01] [Instance 1] ℹ Processing message...
[14:30:02] [Instance 1] ✓ Successfully replied to: 6281234567890@g.us
```

### 4. Update Timer
```javascript
// Record current time for this group
groupMessageTimes.set(groupId, Date.now())
```

---

## 📊 Examples

### Example 1: 5-Minute Interval

```
Timeline:
14:00:00 - Message 1 arrives → Reply sent ✓
14:02:00 - Message 2 arrives → Skipped (only 2 min passed)
14:04:00 - Message 3 arrives → Skipped (only 4 min passed)
14:05:00 - Message 4 arrives → Reply sent ✓ (5+ min passed)
14:06:00 - Message 5 arrives → Skipped (only 1 min passed)
14:10:00 - Message 6 arrives → Reply sent ✓ (5+ min passed)
```

### Example 2: No Interval (0 minutes)

```
Timeline:
14:00:00 - Message 1 → Reply ✓
14:00:10 - Message 2 → Reply ✓
14:00:20 - Message 3 → Reply ✓
14:00:30 - Message 4 → Reply ✓

⚠️ Warning: High risk of spam detection!
```

### Example 3: 30-Minute Interval

```
Timeline:
14:00:00 - Message 1 → Reply ✓
14:10:00 - Message 2 → Skipped
14:20:00 - Message 3 → Skipped
14:30:00 - Message 4 → Reply ✓ (30 min passed)
15:00:00 - Message 5 → Reply ✓ (30 min passed)

✓ Very safe, but less responsive
```

---

## 💡 Best Practices

### 1. Choose Right Interval

**Active Groups (many messages):**
```bash
MESSAGE_INTERVAL=300000  # 5 minutes
# or
MESSAGE_INTERVAL=600000  # 10 minutes
```

**Slow Groups (few messages):**
```bash
MESSAGE_INTERVAL=60000   # 1 minute
# or
MESSAGE_INTERVAL=180000  # 3 minutes
```

**Very Active Groups:**
```bash
MESSAGE_INTERVAL=1800000 # 30 minutes
```

### 2. Monitor Bot Behavior

```bash
# Watch logs to see skip messages
npm start

# You'll see:
[14:30:01] ⚠ Skipping reply - Wait X more minute(s)
```

### 3. Adjust Based on Results

- **Too many skips?** → Decrease interval
- **Getting rate limited?** → Increase interval
- **Works well?** → Keep current setting

### 4. Safety Tips

✅ **DO:**
- Start with 5-minute interval
- Monitor logs regularly
- Adjust based on group activity
- Use longer intervals for very active groups

❌ **DON'T:**
- Use 0 interval (no limit)
- Use very short intervals (<1 min)
- Set same interval for all group types
- Ignore rate limit warnings

---

## 🔧 Troubleshooting

### Problem: Bot not replying at all

**Check:**
```bash
# 1. Check if interval is enabled
cat .env | grep ENABLE_MESSAGE_INTERVAL
# Should be: true

# 2. Check interval value
cat .env | grep MESSAGE_INTERVAL
# Make sure it's reasonable

# 3. View current settings
npm start → Settings → View Current Settings
```

**Solution:**
- Set interval to 1-5 minutes
- Make sure `ENABLE_MESSAGE_INTERVAL=true`
- Restart bot

### Problem: Bot still replying too frequently

**Check:**
```bash
# Verify interval is being read
npm start → Settings → View Current Settings
```

**Solution:**
```bash
# Increase interval
nano .env
MESSAGE_INTERVAL=600000  # 10 minutes

# Restart bot
```

### Problem: Want to disable interval

**Solution 1: Via CLI**
```bash
npm start
→ Settings
→ Configure Message Interval
→ Select "No interval (0 minutes)"
```

**Solution 2: Via .env**
```bash
nano .env
ENABLE_MESSAGE_INTERVAL=false
# or
MESSAGE_INTERVAL=0
```

### Problem: Changes not taking effect

**Solution:**
```bash
# MUST restart bot after changing settings!
# Stop bot (Ctrl+C)
# Start again
npm start
```

---

## 📈 Performance Impact

### Memory Usage
- **Minimal**: Only stores timestamp per group
- **Efficient**: Uses Map data structure
- **Auto-cleanup**: Can be cleared if needed

### Processing Impact
- **Negligible**: Simple timestamp comparison
- **Fast**: O(1) lookup time
- **No blocking**: Async operations

### Storage
- **None**: Stored in memory only
- **Resets**: On bot restart (by design)

---

## 🧪 Testing

### Test Interval Feature

```bash
# 1. Set short interval for testing
nano .env
MESSAGE_INTERVAL=60000  # 1 minute

# 2. Start bot
npm start → Start Bot

# 3. Send messages to test group:
#    - Message 1: Should get reply
#    - Message 2 (immediate): Should be skipped
#    - Message 3 (after 1 min): Should get reply

# 4. Check logs for skip messages
```

### Expected Logs

```
[14:30:00] ℹ Processing message from: 6281234567890@g.us
[14:30:02] ✓ Successfully replied to: 6281234567890@g.us

[14:30:30] ℹ Processing message from: 6281234567890@g.us
[14:30:30] ⚠ Skipping reply - Last message sent 28s ago. Wait 1 more minute(s).

[14:31:05] ℹ Processing message from: 6281234567890@g.us
[14:31:07] ✓ Successfully replied to: 6281234567890@g.us
```

---

## 🎓 Advanced Usage

### Dynamic Interval Based on Group Activity

You can create rules in future updates:

```javascript
// Pseudocode for future enhancement
if (messageCountLastHour > 100) {
  interval = 30 * 60000; // 30 minutes for very active
} else if (messageCountLastHour > 50) {
  interval = 10 * 60000; // 10 minutes for active
} else {
  interval = 5 * 60000; // 5 minutes for normal
}
```

### Per-Group Custom Intervals

Future enhancement idea:

```javascript
// Custom intervals per group
const groupIntervals = {
  '6281234567890@g.us': 30 * 60000, // 30 min
  '6289876543210@g.us': 5 * 60000,  // 5 min
  'default': 10 * 60000              // 10 min
};
```

---

## 📝 Summary

### ✅ What This Feature Does:

1. **Prevents Spam**
   - Limits message frequency per group
   - Reduces risk of ban

2. **Smart Tracking**
   - Per-group timer
   - Automatic skip logic

3. **Easy Configuration**
   - CLI menu for easy setup
   - Multiple presets available
   - Custom intervals supported

4. **User-Friendly**
   - Clear log messages
   - Warnings for risky settings
   - Help text included

### 🎯 Recommended Settings:

```bash
# .env
MESSAGE_INTERVAL=300000  # 5 minutes (recommended)
ENABLE_MESSAGE_INTERVAL=true
```

### 🚀 Quick Start:

```bash
npm start
→ Settings
→ Configure Message Interval
→ Select "5 minutes (Recommended)"
→ Restart bot
```

---

**Happy botting with safe intervals! 🎉**
