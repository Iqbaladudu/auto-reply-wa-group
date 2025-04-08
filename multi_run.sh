NUM_INSTANCES=4

# Function to clean up and set up the environment
setup_environment() {
    local instance=$1
    echo "Setting up environment for instance $instance..."
    rm -rf "./auth_info_baileys_$instance"
}

# Function to run a single instance
run_instance() {
    local instance=$1

    echo "Starting bot instance $instance..."

    while true; do
        setup_environment "$instance"
        node --experimental-strip-types multi_client.js "$instance"
        echo "Instance $instance restarting..."
        sleep 1s
    done
}

# Main function
main() {
    echo "Starting $NUM_INSTANCES WhatsApp bot instances..."

    # Start each instance in background
    for ((i=1; i<=NUM_INSTANCES; i++)); do
        run_instance "$i" &
        echo "Started instance $i in background"
        # Small delay to prevent resource contention during startup
        sleep 2
    done

    # Wait for all background processes
    wait
}

# Run the main function
main
