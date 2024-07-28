#!/bin/bash

# Navigate to the src directory where your Go code is located
cd "$(dirname "$0")/src"

# Set the environment variables for cross-compilation to WebAssembly
export GOOS=js
export GOARCH=wasm

# Build the WebAssembly binary with optimizations for hello.go
go build -ldflags="-s -w" -o ../static/main.wasm hello.go

# Navigate to the static directory to handle wasm files
cd ../static

# Apply optimization using wasm-opt
wasm-opt --enable-bulk-memory -Os main.wasm -o main_opt.wasm

# Compress the optimized WebAssembly binary
gzip -9 -f -k main_opt.wasm

# Rename the compressed file to match code expectation
mv main_opt.wasm.gz main.wasm.gz

# Move the compressed WebAssembly file and wasm_exec.js to the React public directory
mv main.wasm.gz ../../cs2-demo/public/
cp $(go env GOROOT)/misc/wasm/wasm_exec.js ../../cs2-demo/public/

# Return to the original directory
cd -