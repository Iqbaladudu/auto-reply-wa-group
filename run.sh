#!/bin/bash

# ═══════════════════════════════════════════════
#   WhatsApp Bot - Direct Instance Runner
#   Usage: ./run.sh [nomor_instance] [jumlah_instance]
#   Example: ./run.sh 1 4   (jalankan instance 1 dari 4)
#            ./run.sh 2 4   (jalankan instance 2 dari 4)
# ═══════════════════════════════════════════════

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get parameters
INSTANCE_ID=${1:-1}
TOTAL_INSTANCES=${2:-1}

# Show help if --help or -h
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   WhatsApp Bot - Direct Instance Runner   ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo -e "  ./run.sh [nomor_instance] [jumlah_instance]"
    echo ""
    echo -e "${YELLOW}Arguments:${NC}"
    echo -e "  nomor_instance    Nomor instance yang akan dijalankan (default: 1)"
    echo -e "  jumlah_instance   Total jumlah instance (default: 1)"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  ./run.sh              # Jalankan instance 1 dari 1 (single bot)"
    echo -e "  ./run.sh 1 4          # Jalankan instance 1 dari 4"
    echo -e "  ./run.sh 2 4          # Jalankan instance 2 dari 4"
    echo -e "  ./run.sh 3 4          # Jalankan instance 3 dari 4"
    echo -e "  ./run.sh 4 4          # Jalankan instance 4 dari 4"
    echo ""
    echo -e "${YELLOW}Tips:${NC}"
    echo -e "  - Jalankan setiap instance di terminal yang berbeda"
    echo -e "  - Tekan Ctrl+C untuk menghentikan instance"
    echo -e "  - Scan QR code saat pertama kali"
    echo ""
    exit 0
fi

# Validate inputs
if ! [[ "$INSTANCE_ID" =~ ^[0-9]+$ ]] || [ "$INSTANCE_ID" -lt 1 ]; then
    echo -e "${RED}Error: Nomor instance harus berupa angka positif${NC}"
    echo -e "Usage: ./run.sh [nomor_instance] [jumlah_instance]"
    exit 1
fi

if ! [[ "$TOTAL_INSTANCES" =~ ^[0-9]+$ ]] || [ "$TOTAL_INSTANCES" -lt 1 ]; then
    echo -e "${RED}Error: Jumlah instance harus berupa angka positif${NC}"
    echo -e "Usage: ./run.sh [nomor_instance] [jumlah_instance]"
    exit 1
fi

if [ "$INSTANCE_ID" -gt "$TOTAL_INSTANCES" ]; then
    echo -e "${RED}Error: Nomor instance ($INSTANCE_ID) tidak boleh lebih besar dari jumlah instance ($TOTAL_INSTANCES)${NC}"
    exit 1
fi

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Banner
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   WhatsApp Bot - Instance ${INSTANCE_ID}/${TOTAL_INSTANCES}             ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Instance  :${NC} ${GREEN}${INSTANCE_ID}${NC}"
echo -e "${YELLOW}Total     :${NC} ${GREEN}${TOTAL_INSTANCES}${NC}"
echo ""
echo -e "${GREEN}Memulai bot...${NC}"
echo -e "${YELLOW}Tekan Ctrl+C untuk menghentikan${NC}"
echo ""

# Run the bot directly in this terminal
exec node "$SCRIPT_DIR/src/instance-runner.js" "$INSTANCE_ID" "$TOTAL_INSTANCES"
