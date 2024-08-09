#!/bin/bash

# Navigate to the src directory where your Go code is located
cd "$(dirname "$0")/src"

# Set the environment variables for cross-compilation to WebAssembly
export GOOS=js
export GOARCH=wasm

# Build the WebAssembly binary with optimizations
go build -ldflags="-s -w" -o ../static/main.wasm main.go analysis.go utils.go analysis_helpers.go

# Compress the WebAssembly binary with maximum compression
gzip -9 -f -k ../static/main.wasm

# Move the compressed WebAssembly file to the React public directory
mv ../static/main.wasm.gz ../../cs2-demo/public/

# Copy wasm_exec.js from the Go installation to the React public directory
cp $(go env GOROOT)/misc/wasm/wasm_exec.js ../../cs2-demo/public/

# Return to the original directory
cd -