#!/bin/bash

condition=true

while "${condition}"; do
echo "Memulai bot..."
echo

# run node js script
rm -rf ./auth_info_baileys
tsc index.ts
node index.js
sleep 1s; done
