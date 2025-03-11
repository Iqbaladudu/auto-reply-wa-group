#!/usr/bin/env bash

condition=true
# Function to clean up and set up the environment
setup_environment() {
    echo "Setting up environment..."
    rm -rf ./auth_info_baileys
}

# Function to run the Node.js script
run_node_script() {
    echo "Starting the bot..."
    node --experimental-strip-types index.js
}

# Main loop
main() {
    local condition=true

    while $condition; do
        setup_environment
        run_node_script
        sleep 1s
    done
}

# Execute the main function
main
