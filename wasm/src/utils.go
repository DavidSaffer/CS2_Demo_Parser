// utils.go
package main

import (
	"encoding/json"
	"io"
	"syscall/js"
)

// sendProgressUpdate sends a status message to the JavaScript side using WebAssembly's syscall/js package.
func sendProgressUpdate(message string) {
	js.Global().Call("postMessage", message)
}

// sendError communicates an error message in JSON format to the JavaScript side.
func sendError(errorMessage string) {
	errorMsg := map[string]interface{}{
		"type": "error",
		"data": errorMessage,
	}
	errorJSON, err := json.Marshal(errorMsg)
	if err != nil {
		// Fallback if JSON marshaling fails
		js.Global().Call("postMessage", `{"type":"error","data":"Failed to encode error message"}`)
		return
	}
	js.Global().Call("postMessage", string(errorJSON))
}

// sendFinalStats serializes the final statistics to JSON and sends it to JavaScript.
func sendFinalStats(playerStats map[string]*PlayerStats, roundNum int) {
	statsJSON, err := json.Marshal(playerStats)
	if err != nil {
		sendError("Error encoding player stats to JSON")
		return
	}
	msg := map[string]interface{}{
		"type":        "PlayerStats",
		"data":        json.RawMessage(statsJSON),
		"totalRounds": roundNum,
	}
	msgJSON, err := json.Marshal(msg)
	if err != nil {
		sendError("Error encoding final message to JSON")
		return
	}
	js.Global().Call("postMessage", string(msgJSON))
}

type ProgressReader struct {
	reader          io.Reader
	totalSize       int64
	bytesRead       int64
	lastReportedInt int
	progressFunc    func(progress float64)
}

func (p *ProgressReader) Read(b []byte) (int, error) {
	n, err := p.reader.Read(b)
	p.bytesRead += int64(n)
	if p.totalSize > 0 {
		progress := float64(p.bytesRead) / float64(p.totalSize) * 100
		currentIntProgress := int(progress)

		// Check if integer progress has changed
		if currentIntProgress != p.lastReportedInt {
			p.lastReportedInt = currentIntProgress
			p.progressFunc(progress)
		}
	}
	return n, err
}

func NewProgressReader(reader io.Reader, totalSize int64, progressFunc func(progress float64)) *ProgressReader {
	return &ProgressReader{
		reader:          reader,
		totalSize:       totalSize,
		lastReportedInt: -1,
		progressFunc:    progressFunc,
	}
}
