#!/bin/bash

# Navigate to the Go directory where your Go code is located
cd "$(dirname "$0")"

# Set the environment variables for cross-compilation to WebAssembly
export GOOS=js
export GOARCH=wasm

# Build the WebAssembly binary with optimizations
go build -ldflags="-s -w" -o main.wasm hello.go

# Compress the WebAssembly binary with maximum compression
gzip -9 -f -k main.wasm

# Move the compressed WebAssembly file and wasm_exec.js to the React public directory
mv main.wasm.gz ../cs2-demo/public/
cp $(go env GOROOT)/misc/wasm/wasm_exec.js ../cs2-demo/public/

# Return to the original directory
cd -
