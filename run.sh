#!/bin/bash

condition=true

while "${condition}"; do
echo "Memulai bot..."
echo

# run node js script
tsc index.ts
node index.js
sleep 1s; done
