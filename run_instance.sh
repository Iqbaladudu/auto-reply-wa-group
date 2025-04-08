# Check arguments
if [ -z "$1" ]; then
    echo "Usage: ./run_instance.sh <instance_number> [total_instances]"
    echo "Example: ./run_instance.sh 1 4"
    exit 1
fi

INSTANCE=$1
TOTAL=${2:-4}  # Default total instances is 4 if not provided

# Clear previous session
rm -rf "./auth_info_baileys_$INSTANCE"

# Create directories if they don't exist
mkdir -p ./qrcodes

# Set environment variables
export LOG_LEVEL=warn  # Options: info, warn, error, silent

# Run the instance
echo "Starting WhatsApp bot instance $INSTANCE of $TOTAL"
echo "---------------------------------------------"
node --experimental-strip-types single_client.js "$INSTANCE" "$TOTAL"
