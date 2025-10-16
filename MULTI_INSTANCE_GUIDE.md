# Multi-Instance Terminal Launch Guide

## Overview

Fitur **Launch Instances in Separate Terminals** memungkinkan Anda menjalankan multiple WhatsApp bot instances, di mana setiap instance berjalan di terminal window yang terpisah. Ini memberikan beberapa keuntungan:

✅ **Isolasi Process**: Setiap instance berjalan sebagai process terpisah
✅ **Monitoring Mudah**: Setiap instance memiliki log terpisah yang mudah dipantau
✅ **Kontrol Independen**: Dapat stop/restart instance tanpa mempengaruhi yang lain
✅ **QR Code Terpisah**: Setiap instance menampilkan QR code di terminal sendiri
✅ **Debugging Lebih Mudah**: Error pada satu instance tidak mempengaruhi yang lain

## Cara Menggunakan

### Melalui CLI Menu

1. Jalankan bot:
   ```bash
   npm start
   ```

2. Pilih menu: **🪟 Launch Instances in Separate Terminals**

3. Pilih mode:
   - **🚀 Launch Multiple Instances**: Meluncurkan beberapa instance sekaligus
   - **🎯 Launch Single Instance**: Meluncurkan satu instance spesifik

#### Launch Multiple Instances

1. Masukkan jumlah total instance yang ingin dijalankan (1-10)
2. Masukkan nomor instance awal (default: 1)
3. Script akan membuka terminal baru untuk setiap instance

**Contoh:**
- Total instances: 4
- Start from: 1
- Akan membuka 4 terminal window untuk instance 1, 2, 3, dan 4

#### Launch Single Instance

1. Masukkan instance ID yang ingin dijalankan
2. Masukkan total instances dalam setup Anda
3. Script akan membuka 1 terminal baru untuk instance tersebut

**Contoh:**
- Instance ID: 3
- Total instances: 4
- Akan membuka 1 terminal window untuk instance 3 saja

### Melalui Script Langsung

#### Launch Multiple Instances

```bash
# Launch 4 instances (instance 1-4)
bash launch-instances.sh 4

# Launch 4 instances starting from instance 2 (instance 2-4)
bash launch-instances.sh 4 2

# Launch 6 instances starting from instance 1
bash launch-instances.sh 6 1
```

**Syntax:**
```bash
bash launch-instances.sh [TOTAL_INSTANCES] [START_FROM]
```

#### Launch Single Instance

```bash
# Launch instance 1 (dari total 4 instances)
bash launch-single-instance.sh 1 4

# Launch instance 3 (dari total 6 instances)
bash launch-single-instance.sh 3 6
```

**Syntax:**
```bash
bash launch-single-instance.sh [INSTANCE_ID] [TOTAL_INSTANCES]
```

### Melalui Node.js Langsung

```bash
# Jalankan instance 1 dari total 4 instances
node src/instance-runner.js 1 4

# Jalankan instance 2 dari total 4 instances
node src/instance-runner.js 2 4
```

## Persyaratan Sistem

### Linux (Ubuntu/Debian)

Script ini memerlukan graphical environment dan salah satu terminal emulator berikut:

1. **gnome-terminal** (direkomendasikan untuk Ubuntu)
   ```bash
   sudo apt install gnome-terminal
   ```

2. **xterm** (universal)
   ```bash
   sudo apt install xterm
   ```

3. **konsole** (untuk KDE)
   ```bash
   sudo apt install konsole
   ```

4. **xfce4-terminal** (untuk XFCE)
   ```bash
   sudo apt install xfce4-terminal
   ```

### Untuk SSH Connection

Jika Anda menggunakan SSH, pastikan X11 forwarding aktif:

```bash
# Connect dengan X11 forwarding
ssh -X user@server

# Atau edit ~/.ssh/config
Host myserver
    ForwardX11 yes
    ForwardX11Trusted yes
```

## Arsitektur Distribusi

Setiap instance akan memproses group yang berbeda berdasarkan distribusi:

```
Group ID ending with:
- ...000001 → Instance 1
- ...000002 → Instance 2
- ...000003 → Instance 3
- ...000004 → Instance 4
(dan seterusnya dengan modulo)
```

**Contoh dengan 4 instances:**
- Group `120363219876543210@g.us` → last 6 digits = 543210 → 543210 % 4 = 2 → **Instance 2**
- Group `120363219876543211@g.us` → last 6 digits = 543211 → 543211 % 4 = 3 → **Instance 3**
- Group `120363219876543212@g.us` → last 6 digits = 543212 → 543212 % 4 = 0 → **Instance 4**
- Group `120363219876543213@g.us` → last 6 digits = 543213 → 543213 % 4 = 1 → **Instance 1**

## Manajemen Sessions

Setiap instance memiliki auth session terpisah:

```
auth_info_baileys_1/  → Instance 1
auth_info_baileys_2/  → Instance 2
auth_info_baileys_3/  → Instance 3
auth_info_baileys_4/  → Instance 4
```

**Penting:**
- Setiap instance perlu scan QR code dengan nomor WhatsApp berbeda
- Atau gunakan 1 nomor dengan WhatsApp Business API (multi-device)

## Tips & Best Practices

### 1. Monitoring

Setiap terminal window menampilkan:
- QR code untuk login (jika belum login)
- Log aktivitas real-time
- Error messages
- Status koneksi

### 2. Resource Management

- Setiap instance menggunakan ~50-100MB RAM
- CPU usage minimal saat idle
- Network bandwidth terbagi per instance

**Rekomendasi:**
- Untuk 1000-2000 groups: 2-4 instances
- Untuk 3000-5000 groups: 4-6 instances
- Untuk 5000+ groups: 6-10 instances

### 3. Starting & Stopping

**Stop Single Instance:**
- Tekan `Ctrl+C` di terminal window instance tersebut

**Stop All Instances:**
- Tekan `Ctrl+C` di setiap terminal window
- Atau gunakan:
  ```bash
  # Kill all node processes running instance-runner
  pkill -f "instance-runner.js"
  ```

**Restart Single Instance:**
```bash
# Launch ulang instance yang sama
bash launch-single-instance.sh 3 4  # Instance 3 dari 4
```

### 4. Error Handling

Jika ada error pada satu instance:
1. Instance lain tetap berjalan normal
2. Check log di terminal window instance bermasalah
3. Restart hanya instance tersebut
4. Group yang di-handle instance tersebut akan tertunda sampai restart

### 5. Scaling

**Menambah Instance:**
```bash
# Jika awalnya running 4 instances, tambah 2 lagi:
bash launch-instances.sh 6 5  # Launch instance 5 dan 6
```

**Mengurangi Instance:**
- Cukup stop terminal window instance yang tidak dibutuhkan

## Troubleshooting

### Error: "No display found"

**Solusi:**
- Pastikan running di graphical environment
- Jika SSH: gunakan `ssh -X` untuk X11 forwarding
- Atau gunakan mode non-terminal (start_multiple di CLI)

### Error: "No compatible terminal emulator found"

**Solusi:**
```bash
# Install salah satu terminal emulator
sudo apt install gnome-terminal  # Ubuntu/GNOME
sudo apt install xterm           # Universal
sudo apt install konsole         # KDE
sudo apt install xfce4-terminal  # XFCE
```

### Instance tidak menerima messages

**Check:**
1. Pastikan instance sudah login (scan QR)
2. Check apakah group ID match dengan instance number
3. Verify di log terminal instance tersebut
4. Test dengan send message di group yang seharusnya di-handle instance tersebut

### Port/Resource Conflicts

Baileys tidak menggunakan fixed port, jadi tidak ada conflict antar instances.

### Memory Issues

Jika system kehabisan memory:
1. Reduce jumlah instances
2. Monitor dengan: `top` atau `htop`
3. Set ulimit jika perlu:
   ```bash
   ulimit -n 4096  # Increase max open files
   ```

## Perbandingan Mode

### Single Terminal (start_multiple)

**Kelebihan:**
- Lebih simple
- Satu window untuk semua
- Lebih hemat resource

**Kekurangan:**
- Log tercampur
- Stop semua jika crash
- Sulit monitor per instance

### Separate Terminals (launch_terminals)

**Kelebihan:**
- Log terpisah & jelas
- Independen per instance
- Mudah debug
- QR code tidak overlap

**Kekurangan:**
- Perlu graphical environment
- Banyak window terbuka
- Sedikit lebih banyak resource

## Kapan Menggunakan Apa?

### Gunakan Single Terminal jika:
- Development/testing
- Server tanpa GUI
- Jumlah instance sedikit (1-2)
- Prefer simplicity

### Gunakan Separate Terminals jika:
- Production environment
- Desktop/laptop dengan GUI
- Multiple instances (3+)
- Perlu monitoring detail
- Butuh isolasi yang baik

## Command Reference

```bash
# CLI Menu
npm start

# Launch multiple instances (via script)
bash launch-instances.sh [total] [start_from]

# Launch single instance (via script)
bash launch-single-instance.sh [instance_id] [total]

# Direct node execution
node src/instance-runner.js [instance_id] [total]

# Check running instances
ps aux | grep instance-runner

# Kill all instances
pkill -f instance-runner.js

# Kill specific instance
pkill -f "instance-runner.js 3"  # Kill instance 3
```

## FAQ

**Q: Berapa maksimal instance yang bisa dijalankan?**
A: Script membatasi 1-10 instances, tapi bisa lebih tergantung resource system.

**Q: Apakah setiap instance perlu nomor WhatsApp berbeda?**
A: Ya, setiap instance memerlukan auth session terpisah dengan nomor berbeda.

**Q: Bagaimana cara distribute groups secara manual?**
A: Groups otomatis terdistribusi berdasarkan group ID modulo total instances.

**Q: Bisa jalankan di headless server?**
A: Untuk headless server, gunakan mode `start_multiple` di CLI (bukan `launch_terminals`).

**Q: Data iklan sama untuk semua instance?**
A: Ya, semua instance membaca dari folder `data/` yang sama.

**Q: Bagaimana jika instance crash?**
A: Instance lain tetap berjalan. Restart instance yang crash dengan launch ulang.

---

Untuk pertanyaan lebih lanjut, check:
- [README.md](README.md) - Main documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup instructions
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
