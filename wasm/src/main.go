//go:build js && wasm

package main

import (
	"syscall/js"
)

// GOOS=js GOARCH=wasm go build -o main.wasm
// GOOS=js GOARCH=wasm go build -ldflags="-s -w" -o main.wasm
// wasm-opt --enable-bulk-memory -Os main.wasm -o main_opt.wasm

func main() {
	c := make(chan struct{}, 0)

	js.Global().Set("analyzeDemo", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		go func() {
			data := make([]byte, args[0].Get("byteLength").Int())
			js.CopyBytesToGo(data, args[0])
			AnalyzeDemo(data)
		}()
		return nil
	}))

	<-c
}
