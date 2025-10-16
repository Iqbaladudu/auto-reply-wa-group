#!/bin/bash

# Launch Single WhatsApp Bot Instance
# Opens a new terminal window for the specified instance

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get parameters
INSTANCE_ID=${1:-1}
TOTAL_INSTANCES=${2:-1}

echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   WhatsApp Bot Single Instance Launcher   ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Configuration:${NC}"
echo -e "  Instance ID: ${GREEN}${INSTANCE_ID}${NC}"
echo -e "  Total Instances: ${GREEN}${TOTAL_INSTANCES}${NC}"
echo ""

# Check if running in a graphical environment
if [ -z "$DISPLAY" ]; then
    echo -e "${RED}Error: No display found. This script requires a graphical environment.${NC}"
    echo -e "${YELLOW}Tip: If you're using SSH, connect with X11 forwarding: ssh -X${NC}"
    exit 1
fi

# Detect available terminal emulator
TERMINAL=""
if command -v gnome-terminal &> /dev/null; then
    TERMINAL="gnome-terminal"
elif command -v xterm &> /dev/null; then
    TERMINAL="xterm"
elif command -v konsole &> /dev/null; then
    TERMINAL="konsole"
elif command -v xfce4-terminal &> /dev/null; then
    TERMINAL="xfce4-terminal"
else
    echo -e "${RED}Error: No compatible terminal emulator found.${NC}"
    echo -e "${YELLOW}Please install one of: gnome-terminal, xterm, konsole, xfce4-terminal${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Using terminal: ${TERMINAL}${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Launch instance
echo -e "${CYAN}Launching Instance ${INSTANCE_ID}...${NC}"

case $TERMINAL in
    gnome-terminal)
        gnome-terminal --title="WhatsApp Bot - Instance $INSTANCE_ID" -- bash -c "cd '$SCRIPT_DIR' && node src/instance-runner.js $INSTANCE_ID $TOTAL_INSTANCES; exec bash" &
        ;;
    xterm)
        xterm -title "WhatsApp Bot - Instance $INSTANCE_ID" -e "cd '$SCRIPT_DIR' && node src/instance-runner.js $INSTANCE_ID $TOTAL_INSTANCES; exec bash" &
        ;;
    konsole)
        konsole --new-tab -p tabtitle="WhatsApp Bot - Instance $INSTANCE_ID" -e bash -c "cd '$SCRIPT_DIR' && node src/instance-runner.js $INSTANCE_ID $TOTAL_INSTANCES; exec bash" &
        ;;
    xfce4-terminal)
        xfce4-terminal --title="WhatsApp Bot - Instance $INSTANCE_ID" -e "bash -c 'cd $SCRIPT_DIR && node src/instance-runner.js $INSTANCE_ID $TOTAL_INSTANCES; exec bash'" &
        ;;
esac

echo ""
echo -e "${GREEN}✓ Instance launched successfully!${NC}"
echo ""
