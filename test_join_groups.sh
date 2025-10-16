#!/bin/bash

# Test script untuk Join Groups Feature
# Pastikan Anda sudah setup sebelum menjalankan test ini

echo "╔════════════════════════════════════════════╗"
echo "║   WhatsApp Bot - Join Groups Test         ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if data/group.js exists
if [ ! -f "data/group.js" ]; then
    echo "❌ File data/group.js tidak ditemukan!"
    echo "   Pastikan file ini ada sebelum test."
    exit 1
fi

echo "✓ File data/group.js ditemukan"

# Count lines in group.js (approximate number of links)
LINE_COUNT=$(wc -l < data/group.js)
echo "✓ File berisi ~$LINE_COUNT baris"
echo ""

echo "📋 Test Instructions:"
echo ""
echo "1. Jalankan: npm start"
echo "2. Pilih: '👥 Join Groups from Links'"
echo "3. Pilih: '📁 Load from data/group.js file'"
echo "4. Masukkan Instance ID: 999 (atau ID lain)"
echo "5. Confirm: Yes"
echo "6. Scan QR code jika diminta"
echo "7. Tunggu proses selesai"
echo ""
echo "📊 Expected Results:"
echo "- Bot akan connect ke WhatsApp"
echo "- Progress ditampilkan real-time"
echo "- Summary ditampilkan di akhir"
echo "- Report success/failed groups"
echo ""
echo "⚠️  Important Notes:"
echo "- Gunakan instance ID berbeda dari bot utama"
echo "- WhatsApp mungkin limit join grup per hari"
echo "- Delay 3 detik antar join untuk keamanan"
echo "- 'Already in group' dihitung sebagai failed (normal)"
echo ""
echo "🚀 Ready to test? Press Enter to start..."
read

npm start
