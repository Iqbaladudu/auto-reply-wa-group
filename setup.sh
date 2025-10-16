#!/bin/bash

# WhatsApp Auto Reply Bot - Installation & Setup Script
# This script helps you set up the bot quickly

echo "╔════════════════════════════════════════════╗"
echo "║   WhatsApp Auto Reply Bot - Setup Wizard  ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✓ Node.js detected: $NODE_VERSION"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✓ npm detected: v$NPM_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed successfully"
echo ""

# Create data directory if not exists
if [ ! -d "data" ]; then
    echo "📁 Creating data directory..."
    mkdir -p data
    echo "✓ Data directory created"
else
    echo "✓ Data directory already exists"
fi

# Check if advertisement files exist
AD_COUNT=$(find data -name "*.txt" 2>/dev/null | wc -l)
if [ $AD_COUNT -eq 0 ]; then
    echo ""
    echo "⚠️  No advertisement files found!"
    echo "Would you like to create a sample advertisement? (y/n)"
    read -r CREATE_SAMPLE
    
    if [ "$CREATE_SAMPLE" = "y" ] || [ "$CREATE_SAMPLE" = "Y" ]; then
        echo "Creating sample advertisement..."
        cat > data/iklan.txt << 'EOF'
🎉 Welcome to our WhatsApp Bot!

This is a sample advertisement message.
You can edit this through the CLI menu or by editing data/iklan.txt

Features:
✓ Auto-reply to all group messages
✓ Multiple advertisement rotation
✓ Multi-instance support
✓ Easy management through CLI

Replace this text with your actual advertisement!
EOF
        echo "✓ Sample advertisement created: data/iklan.txt"
    fi
else
    echo "✓ Found $AD_COUNT advertisement file(s)"
fi

echo ""

# Create .env file if not exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env configuration file..."
    cp .env.example .env
    echo "✓ Configuration file created (.env)"
    echo "  You can edit it to customize bot behavior"
else
    echo "✓ Configuration file already exists"
fi

echo ""
echo "═══════════════════════════════════════════"
echo "✅ Setup Complete!"
echo "═══════════════════════════════════════════"
echo ""
echo "🚀 To start the bot, run:"
echo "   npm start"
echo "   OR"
echo "   ./start.sh"
echo ""
echo "📖 For detailed guide, check:"
echo "   - QUICKSTART.md (Quick start guide)"
echo "   - SETUP_GUIDE.md (Detailed setup)"
echo "   - README_NEW.md (Full documentation)"
echo ""
echo "💡 First time? Start with single instance"
echo "   and test on a small group first!"
echo ""
