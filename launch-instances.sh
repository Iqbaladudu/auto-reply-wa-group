#!/bin/bash

# Launch Multiple WhatsApp Bot Instances
# Each instance runs in a separate terminal window

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
TOTAL_INSTANCES=${1:-4}
START_INSTANCE=${2:-1}

echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   WhatsApp Bot Multi-Instance Launcher    ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Validate input
if [ "$TOTAL_INSTANCES" -lt 1 ] || [ "$TOTAL_INSTANCES" -gt 10 ]; then
    echo -e "${RED}Error: Total instances must be between 1 and 10${NC}"
    exit 1
fi

echo -e "${YELLOW}Configuration:${NC}"
echo -e "  Total Instances: ${GREEN}${TOTAL_INSTANCES}${NC}"
echo -e "  Starting from Instance: ${GREEN}${START_INSTANCE}${NC}"
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
    TERM_CMD="gnome-terminal --title=\"WhatsApp Bot - Instance \$i\" -- bash -c"
elif command -v xterm &> /dev/null; then
    TERMINAL="xterm"
    TERM_CMD="xterm -title \"WhatsApp Bot - Instance \$i\" -e"
elif command -v konsole &> /dev/null; then
    TERMINAL="konsole"
    TERM_CMD="konsole --new-tab -p tabtitle=\"WhatsApp Bot - Instance \$i\" -e"
elif command -v xfce4-terminal &> /dev/null; then
    TERMINAL="xfce4-terminal"
    TERM_CMD="xfce4-terminal --title=\"WhatsApp Bot - Instance \$i\" -e"
else
    echo -e "${RED}Error: No compatible terminal emulator found.${NC}"
    echo -e "${YELLOW}Please install one of: gnome-terminal, xterm, konsole, xfce4-terminal${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Using terminal: ${TERMINAL}${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Launch instances
echo -e "${YELLOW}Launching instances...${NC}"
echo ""

for (( i=$START_INSTANCE; i<=$TOTAL_INSTANCES; i++ ))
do
    echo -e "${CYAN}Starting Instance ${i}/${TOTAL_INSTANCES}...${NC}"
    
    # Build command based on terminal type
    case $TERMINAL in
        gnome-terminal)
            gnome-terminal --title="WhatsApp Bot - Instance $i" -- bash -c "cd '$SCRIPT_DIR' && node src/instance-runner.js $i $TOTAL_INSTANCES; exec bash" &
            ;;
        xterm)
            xterm -title "WhatsApp Bot - Instance $i" -e "cd '$SCRIPT_DIR' && node src/instance-runner.js $i $TOTAL_INSTANCES; exec bash" &
            ;;
        konsole)
            konsole --new-tab -p tabtitle="WhatsApp Bot - Instance $i" -e bash -c "cd '$SCRIPT_DIR' && node src/instance-runner.js $i $TOTAL_INSTANCES; exec bash" &
            ;;
        xfce4-terminal)
            xfce4-terminal --title="WhatsApp Bot - Instance $i" -e "bash -c 'cd $SCRIPT_DIR && node src/instance-runner.js $i $TOTAL_INSTANCES; exec bash'" &
            ;;
    esac
    
    # Small delay between launches
    sleep 1
done

echo ""
echo -e "${GREEN}✓ All instances launched successfully!${NC}"
echo ""
echo -e "${YELLOW}Tips:${NC}"
echo -e "  - Each instance runs in its own terminal window"
echo -e "  - Press Ctrl+C in each terminal to stop that instance"
echo -e "  - Scan QR code in each instance if needed"
echo -e "  - Check logs in each terminal window"
echo ""
