#!/bin/bash

# Instance Manager - Helper script for managing WhatsApp bot instances

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

show_banner() {
    echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║     WhatsApp Bot Instance Manager         ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
    echo ""
}

show_menu() {
    echo -e "${BLUE}Available Commands:${NC}"
    echo ""
    echo -e "  ${GREEN}launch <total> [start_from]${NC}"
    echo -e "    Launch multiple instances in separate terminals"
    echo -e "    Example: ./manage-instances.sh launch 4"
    echo -e "    Example: ./manage-instances.sh launch 6 3"
    echo ""
    echo -e "  ${GREEN}launch-single <id> <total>${NC}"
    echo -e "    Launch single instance in separate terminal"
    echo -e "    Example: ./manage-instances.sh launch-single 2 4"
    echo ""
    echo -e "  ${GREEN}status${NC}"
    echo -e "    Show running instances"
    echo -e "    Example: ./manage-instances.sh status"
    echo ""
    echo -e "  ${GREEN}stop [id]${NC}"
    echo -e "    Stop instance(s)"
    echo -e "    Example: ./manage-instances.sh stop     # Stop all"
    echo -e "    Example: ./manage-instances.sh stop 3   # Stop instance 3"
    echo ""
    echo -e "  ${GREEN}logs <id>${NC}"
    echo -e "    View logs for specific instance (if available)"
    echo -e "    Example: ./manage-instances.sh logs 2"
    echo ""
    echo -e "  ${GREEN}sessions${NC}"
    echo -e "    List all authentication sessions"
    echo -e "    Example: ./manage-instances.sh sessions"
    echo ""
    echo -e "  ${GREEN}clean-session [id]${NC}"
    echo -e "    Remove session(s) - will logout from WhatsApp"
    echo -e "    Example: ./manage-instances.sh clean-session     # Clean all"
    echo -e "    Example: ./manage-instances.sh clean-session 2   # Clean instance 2"
    echo ""
    echo -e "  ${GREEN}help${NC}"
    echo -e "    Show this help message"
    echo ""
}

show_status() {
    echo -e "${CYAN}═══════════════════════════════════════════${NC}"
    echo -e "${YELLOW}Running Instances:${NC}"
    echo ""
    
    if pgrep -f "instance-runner.js" > /dev/null; then
        ps aux | grep "instance-runner.js" | grep -v grep | while read line; do
            pid=$(echo "$line" | awk '{print $2}')
            args=$(echo "$line" | grep -oP 'instance-runner\.js \K.*')
            instance_id=$(echo "$args" | awk '{print $1}')
            total=$(echo "$args" | awk '{print $2}')
            
            echo -e "  ${GREEN}✓${NC} Instance ${instance_id}/${total} (PID: ${pid})"
        done
    else
        echo -e "  ${YELLOW}No instances running${NC}"
    fi
    
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════${NC}"
}

show_sessions() {
    echo -e "${CYAN}═══════════════════════════════════════════${NC}"
    echo -e "${YELLOW}Authentication Sessions:${NC}"
    echo ""
    
    sessions_found=0
    for dir in "$SCRIPT_DIR"/auth_info_baileys_*; do
        if [ -d "$dir" ]; then
            instance_id=$(basename "$dir" | sed 's/auth_info_baileys_//')
            size=$(du -sh "$dir" 2>/dev/null | awk '{print $1}')
            echo -e "  ${GREEN}✓${NC} Instance ${instance_id} (Size: ${size})"
            sessions_found=1
        fi
    done
    
    if [ $sessions_found -eq 0 ]; then
        echo -e "  ${YELLOW}No sessions found${NC}"
    fi
    
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════${NC}"
}

stop_instances() {
    instance_id=$1
    
    if [ -z "$instance_id" ]; then
        echo -e "${YELLOW}Stopping all instances...${NC}"
        pkill -f "instance-runner.js"
        sleep 1
        
        if ! pgrep -f "instance-runner.js" > /dev/null; then
            echo -e "${GREEN}✓ All instances stopped${NC}"
        else
            echo -e "${RED}Some instances may still be running. Try: pkill -9 -f instance-runner.js${NC}"
        fi
    else
        echo -e "${YELLOW}Stopping instance ${instance_id}...${NC}"
        pkill -f "instance-runner.js ${instance_id}"
        sleep 1
        
        if ! pgrep -f "instance-runner.js ${instance_id}" > /dev/null; then
            echo -e "${GREEN}✓ Instance ${instance_id} stopped${NC}"
        else
            echo -e "${RED}Failed to stop instance ${instance_id}. Try: pkill -9 -f \"instance-runner.js ${instance_id}\"${NC}"
        fi
    fi
}

clean_sessions() {
    instance_id=$1
    
    if [ -z "$instance_id" ]; then
        echo -e "${YELLOW}This will remove ALL sessions and logout from WhatsApp.${NC}"
        read -p "Are you sure? (y/N): " confirm
        
        if [[ $confirm =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Removing all sessions...${NC}"
            rm -rf "$SCRIPT_DIR"/auth_info_baileys_*
            echo -e "${GREEN}✓ All sessions removed${NC}"
        else
            echo -e "${YELLOW}Cancelled${NC}"
        fi
    else
        echo -e "${YELLOW}This will remove session for instance ${instance_id} and logout from WhatsApp.${NC}"
        read -p "Are you sure? (y/N): " confirm
        
        if [[ $confirm =~ ^[Yy]$ ]]; then
            if [ -d "$SCRIPT_DIR/auth_info_baileys_${instance_id}" ]; then
                rm -rf "$SCRIPT_DIR/auth_info_baileys_${instance_id}"
                echo -e "${GREEN}✓ Session for instance ${instance_id} removed${NC}"
            else
                echo -e "${YELLOW}Session for instance ${instance_id} not found${NC}"
            fi
        else
            echo -e "${YELLOW}Cancelled${NC}"
        fi
    fi
}

# Main script
show_banner

case "$1" in
    launch)
        total=${2:-4}
        start_from=${3:-1}
        echo -e "${YELLOW}Launching ${total} instances starting from ${start_from}...${NC}"
        bash "$SCRIPT_DIR/launch-instances.sh" "$total" "$start_from"
        ;;
    
    launch-single)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo -e "${RED}Error: Missing arguments${NC}"
            echo -e "Usage: $0 launch-single <instance_id> <total_instances>"
            exit 1
        fi
        bash "$SCRIPT_DIR/launch-single-instance.sh" "$2" "$3"
        ;;
    
    status)
        show_status
        ;;
    
    stop)
        stop_instances "$2"
        ;;
    
    logs)
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Please specify instance ID${NC}"
            echo -e "Usage: $0 logs <instance_id>"
            exit 1
        fi
        echo -e "${YELLOW}Note: Logs are shown in the instance's terminal window${NC}"
        echo -e "If you need to capture logs, redirect output when launching:"
        echo -e "  node src/instance-runner.js $2 4 2>&1 | tee instance-$2.log"
        ;;
    
    sessions)
        show_sessions
        ;;
    
    clean-session)
        clean_sessions "$2"
        ;;
    
    help|--help|-h)
        show_menu
        ;;
    
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo ""
        show_menu
        exit 1
        ;;
esac

echo ""
