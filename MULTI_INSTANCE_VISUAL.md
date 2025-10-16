# Visual Usage Examples

## 🖼️ Panduan Visual Multi-Instance Terminal Launch

---

## Scenario 1: Memulai dari Awal

### Step 1: Buka Terminal dan Jalankan CLI
```bash
$ cd auto-reply-wa-group
$ npm start
```

### Step 2: Pilih Menu Terminal Launch
```
╔════════════════════════════════════════════╗
║   WhatsApp Auto Reply Bot - CLI Manager   ║
╚════════════════════════════════════════════╝

What would you like to do?
  🚀 Start Bot (Single Instance)
  🚀 Start Bot (Multiple Instances)
❯ 🪟 Launch Instances in Separate Terminals  ← Pilih ini
  📝 Manage Advertisements
  👥 Join Groups from Links
  🔑 Manage Sessions
  ⚙️  Settings
  📊 View Status
  ❌ Exit
```

### Step 3: Pilih Mode Launch
```
What would you like to do?
❯ 🚀 Launch Multiple Instances  ← Pilih untuk multiple
  🎯 Launch Single Instance
  ⬅️  Back to Main Menu
```

### Step 4: Konfigurasi Instances
```
? How many instances do you want to launch? (4)
  → Ketik: 4

? Start from instance number: (1)
  → Ketik: 1
```

### Step 5: Hasil
```
⚙️  Launching 4 instances in separate terminals...

╔════════════════════════════════════════════╗
║   WhatsApp Bot Multi-Instance Launcher    ║
╚════════════════════════════════════════════╝

Configuration:
  Total Instances: 4
  Starting from Instance: 1

✓ Using terminal: gnome-terminal

Launching instances...

Starting Instance 1/4...
Starting Instance 2/4...
Starting Instance 3/4...
Starting Instance 4/4...

✓ All instances launched successfully!
```

### Step 6: 4 Terminal Window Terbuka
```
┌─────────────────────────┐  ┌─────────────────────────┐
│ WhatsApp Bot - Inst. 1 │  │ WhatsApp Bot - Inst. 2 │
├─────────────────────────┤  ├─────────────────────────┤
│ ╔═══════════════════╗   │  │ ╔═══════════════════╗   │
│ ║ Instance 1/4      ║   │  │ ║ Instance 2/4      ║   │
│ ╚═══════════════════╝   │  │ ╚═══════════════════╝   │
│                         │  │                         │
│ Starting instance 1...  │  │ Starting instance 2...  │
│ Loaded 2 ads            │  │ Loaded 2 ads            │
│ Bot initialized         │  │ Bot initialized         │
│ Scan QR code below:     │  │ Scan QR code below:     │
│ ████████████████        │  │ ████████████████        │
│ ██ ▄▄▄▄▄ ██▀▄██        │  │ ██ ▄▄▄▄▄ ██▀▄██        │
│ ...                     │  │ ...                     │
└─────────────────────────┘  └─────────────────────────┘

┌─────────────────────────┐  ┌─────────────────────────┐
│ WhatsApp Bot - Inst. 3 │  │ WhatsApp Bot - Inst. 4 │
├─────────────────────────┤  ├─────────────────────────┤
│ ╔═══════════════════╗   │  │ ╔═══════════════════╗   │
│ ║ Instance 3/4      ║   │  │ ║ Instance 4/4      ║   │
│ ╚═══════════════════╝   │  │ ╚═══════════════════╝   │
│                         │  │                         │
│ Starting instance 3...  │  │ Starting instance 4...  │
│ Loaded 2 ads            │  │ Loaded 2 ads            │
│ Bot initialized         │  │ Bot initialized         │
│ Scan QR code below:     │  │ Scan QR code below:     │
│ ████████████████        │  │ ████████████████        │
│ ██ ▄▄▄▄▄ ██▀▄██        │  │ ██ ▄▄▄▄▄ ██▀▄██        │
│ ...                     │  │ ...                     │
└─────────────────────────┘  └─────────────────────────┘
```

---

## Scenario 2: Launch Single Instance untuk Testing

### Via CLI
```bash
$ npm start
→ 🪟 Launch Instances in Separate Terminals
→ 🎯 Launch Single Instance

? Enter instance ID to launch: 1
? Total instances in your setup: 4

⚙️  Launching instance in new terminal...
✓ Instance 1 launched in new terminal!
```

### Via Script Langsung
```bash
$ bash launch-single-instance.sh 1 4

╔════════════════════════════════════════════╗
║   WhatsApp Bot Single Instance Launcher   ║
╚════════════════════════════════════════════╝

Configuration:
  Instance ID: 1
  Total Instances: 4

✓ Using terminal: gnome-terminal

Launching Instance 1...

✓ Instance launched successfully!
```

---

## Scenario 3: Monitoring dengan Manager

### Check Status
```bash
$ ./manage-instances.sh status

╔════════════════════════════════════════════╗
║     WhatsApp Bot Instance Manager         ║
╚════════════════════════════════════════════╝

═══════════════════════════════════════════
Running Instances:

  ✓ Instance 1/4 (PID: 12345)
  ✓ Instance 2/4 (PID: 12346)
  ✓ Instance 3/4 (PID: 12347)
  ✓ Instance 4/4 (PID: 12348)

═══════════════════════════════════════════
```

### Check Sessions
```bash
$ ./manage-instances.sh sessions

╔════════════════════════════════════════════╗
║     WhatsApp Bot Instance Manager         ║
╚════════════════════════════════════════════╝

═══════════════════════════════════════════
Authentication Sessions:

  ✓ Instance 1 (Size: 156K)
  ✓ Instance 2 (Size: 142K)
  ✓ Instance 3 (Size: 198K)
  ✓ Instance 4 (Size: 175K)

═══════════════════════════════════════════
```

---

## Scenario 4: Restart Instance Bermasalah

### Step 1: Identifikasi Instance Bermasalah
```bash
$ ./manage-instances.sh status

Running Instances:
  ✓ Instance 1/4 (PID: 12345)
  ✓ Instance 2/4 (PID: 12346)
  ✗ Instance 3/4 (Not running)  ← Bermasalah
  ✓ Instance 4/4 (PID: 12348)
```

### Step 2: Stop Instance (jika masih running)
```bash
$ ./manage-instances.sh stop 3

Stopping instance 3...
✓ Instance 3 stopped
```

### Step 3: Restart Instance
```bash
$ ./manage-instances.sh launch-single 3 4

Launching Instance 3...
✓ Instance launched successfully!
```

### Step 4: Verify
```bash
$ ./manage-instances.sh status

Running Instances:
  ✓ Instance 1/4 (PID: 12345)
  ✓ Instance 2/4 (PID: 12346)
  ✓ Instance 3/4 (PID: 12999)  ← Running lagi!
  ✓ Instance 4/4 (PID: 12348)
```

---

## Scenario 5: Scaling - Menambah Instance

### Situasi: Sudah running 4, mau tambah jadi 6

### Step 1: Check Current
```bash
$ ./manage-instances.sh status

Running Instances:
  ✓ Instance 1/4 (PID: 12345)
  ✓ Instance 2/4 (PID: 12346)
  ✓ Instance 3/4 (PID: 12347)
  ✓ Instance 4/4 (PID: 12348)
```

### Step 2: Launch Instance 5 & 6
```bash
$ ./manage-instances.sh launch 6 5

╔════════════════════════════════════════════╗
║     WhatsApp Bot Instance Manager         ║
╚════════════════════════════════════════════╝

Launching 2 instances starting from 5...

╔════════════════════════════════════════════╗
║   WhatsApp Bot Multi-Instance Launcher    ║
╚════════════════════════════════════════════╝

Configuration:
  Total Instances: 6
  Starting from Instance: 5

Starting Instance 5/6...
Starting Instance 6/6...

✓ All instances launched successfully!
```

### Step 3: Verify
```bash
$ ./manage-instances.sh status

Running Instances:
  ✓ Instance 1/6 (PID: 12345)  ← Note: Now shows /6
  ✓ Instance 2/6 (PID: 12346)
  ✓ Instance 3/6 (PID: 12347)
  ✓ Instance 4/6 (PID: 12348)
  ✓ Instance 5/6 (PID: 13001)  ← New!
  ✓ Instance 6/6 (PID: 13002)  ← New!
```

---

## Scenario 6: Log Monitoring Real-time

### Terminal Window Instance 1
```
╔════════════════════════════════════════════╗
║   WhatsApp Bot - Instance 1/4           ║
╚════════════════════════════════════════════╝

Starting instance 1 of 4...

[7:52:35 PM] [Instance 1] Loaded 2 advertisement file(s)
[7:52:35 PM] [Instance 1] Bot initialized
[7:52:36 PM] [Instance 1] Connection established! Bot is running.

[7:53:12 PM] [Instance 1] Processing message from: 120363123456789@g.us
[7:53:15 PM] [Instance 1] Successfully replied to: 120363123456789@g.us

[7:54:28 PM] [Instance 1] Processing message from: 120363987654321@g.us
[7:54:31 PM] [Instance 1] Successfully replied to: 120363987654321@g.us

[7:55:45 PM] [Instance 1] Skipping reply to 120363123456789@g.us - 
Last message sent 33s ago. Wait 1 more minute(s).
```

### Terminal Window Instance 2
```
╔════════════════════════════════════════════╗
║   WhatsApp Bot - Instance 2/4           ║
╚════════════════════════════════════════════╝

Starting instance 2 of 4...

[7:52:37 PM] [Instance 2] Loaded 2 advertisement file(s)
[7:52:37 PM] [Instance 2] Bot initialized
[7:52:38 PM] [Instance 2] Connection established! Bot is running.

[7:53:42 PM] [Instance 2] Processing message from: 120363111222333@g.us
[7:53:45 PM] [Instance 2] Successfully replied to: 120363111222333@g.us

[7:56:12 PM] [Instance 2] Processing message from: 120363444555666@g.us
[7:56:15 PM] [Instance 2] Successfully replied to: 120363444555666@g.us
```

---

## Scenario 7: Emergency Stop All

### Situasi: Perlu stop semua instances dengan cepat

### Option 1: Via Manager
```bash
$ ./manage-instances.sh stop

Stopping all instances...
✓ All instances stopped
```

### Option 2: Manual Kill
```bash
$ pkill -f instance-runner.js
# Or force kill
$ pkill -9 -f instance-runner.js
```

### Verify
```bash
$ ./manage-instances.sh status

Running Instances:
  No instances running
```

---

## Scenario 8: Clean Sessions & Fresh Start

### Step 1: Stop All
```bash
$ ./manage-instances.sh stop
Stopping all instances...
✓ All instances stopped
```

### Step 2: Clean Sessions
```bash
$ ./manage-instances.sh clean-session

This will remove ALL sessions and logout from WhatsApp.
Are you sure? (y/N): y

Removing all sessions...
✓ All sessions removed
```

### Step 3: Verify Clean
```bash
$ ./manage-instances.sh sessions

Authentication Sessions:
  No sessions found
```

### Step 4: Start Fresh
```bash
$ ./manage-instances.sh launch 4

Launching 4 instances starting from 1...
✓ All instances launched successfully!

# Now scan QR codes in each terminal window
```

---

## Command Quick Reference Visual

```
┌────────────────────────────────────────────────────────┐
│                  COMMAND OVERVIEW                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  VIA CLI MENU                                          │
│  ├─ npm start                                          │
│  └─ Select: 🪟 Launch Instances in Separate Terminals │
│                                                        │
│  VIA MANAGER (Recommended)                             │
│  ├─ ./manage-instances.sh launch 4                    │
│  ├─ ./manage-instances.sh launch-single 1 4           │
│  ├─ ./manage-instances.sh status                      │
│  ├─ ./manage-instances.sh stop [id]                   │
│  └─ ./manage-instances.sh sessions                    │
│                                                        │
│  VIA SCRIPTS                                           │
│  ├─ bash launch-instances.sh 4 1                      │
│  └─ bash launch-single-instance.sh 1 4                │
│                                                        │
│  VIA NPM                                               │
│  ├─ npm run launch 4                                  │
│  ├─ npm run launch-single 1 4                         │
│  └─ npm run instance 1 4                              │
│                                                        │
│  DIRECT NODE                                           │
│  └─ node src/instance-runner.js 1 4                   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Terminal Window Layout Examples

### Layout 1: Quad Split (4 Instances)
```
┌──────────────────┬──────────────────┐
│                  │                  │
│   Instance 1/4   │   Instance 2/4   │
│                  │                  │
├──────────────────┼──────────────────┤
│                  │                  │
│   Instance 3/4   │   Instance 4/4   │
│                  │                  │
└──────────────────┴──────────────────┘
```

### Layout 2: Horizontal Split (6 Instances)
```
┌──────┬──────┬──────┬──────┬──────┬──────┐
│ I1/6 │ I2/6 │ I3/6 │ I4/6 │ I5/6 │ I6/6 │
└──────┴──────┴──────┴──────┴──────┴──────┘
```

### Layout 3: Grid 2x3 (6 Instances)
```
┌──────────┬──────────┬──────────┐
│  I1/6    │  I2/6    │  I3/6    │
├──────────┼──────────┼──────────┤
│  I4/6    │  I5/6    │  I6/6    │
└──────────┴──────────┴──────────┘
```

---

## Tips untuk Monitoring

### Tip 1: Use Screen Multiplexer
```bash
# Install tmux
sudo apt install tmux

# Create session with 4 panes
tmux new -s whatsapp-bot
# Ctrl+B then " untuk split horizontal
# Ctrl+B then % untuk split vertical

# Run different instance in each pane
```

### Tip 2: Color-code Terminals
Configure terminal colors berbeda untuk setiap instance:
- Instance 1: Blue theme
- Instance 2: Green theme
- Instance 3: Yellow theme
- Instance 4: Red theme

### Tip 3: Use Multiple Monitors
Ideal setup:
- Monitor 1: Main CLI + development
- Monitor 2: Instance 1 & 2
- Monitor 3: Instance 3 & 4

---

**Untuk dokumentasi lengkap, lihat:**
- [MULTI_INSTANCE_GUIDE.md](MULTI_INSTANCE_GUIDE.md)
- [MULTI_INSTANCE_QUICKREF.md](MULTI_INSTANCE_QUICKREF.md)
