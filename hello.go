package main

// GOOS=js GOARCH=wasm go build -o main.wasm

import (
	"bytes"
	"fmt"
	"log"
	"syscall/js"

	dem "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs"
	events "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/events"
)

type PlayerStats struct {
	Kills      int
	TotalValue int
}

func (ps *PlayerStats) AverageKillValue() float64 {
	if ps.Kills == 0 {
		return 0
	}
	return float64(ps.TotalValue) / float64(ps.Kills)
}

func AnalyzeDemo(data []byte) {
	js.Global().Call("postMessage", "Starting parse...")

	reader := bytes.NewReader(data)
	p := dem.NewParser(reader)
	defer p.Close()

	playerStats := make(map[string]*PlayerStats)

	p.RegisterEventHandler(func(e events.Kill) {
		if e.Killer == nil || e.Victim == nil {
			return
		}

		killerName := e.Killer.Name
		victimName := e.Victim.Name
		victimValue := e.Victim.EquipmentValueFreezeTimeEnd()

		if killerName == victimName {
			return // Ignoring self-kills
		}

		if _, ok := playerStats[killerName]; !ok {
			playerStats[killerName] = &PlayerStats{}
		}
		if _, ok := playerStats[victimName]; !ok {
			playerStats[victimName] = &PlayerStats{}
		}

		playerStats[killerName].Kills++
		playerStats[killerName].TotalValue += victimValue

		// Send a simple formatted string to JavaScript
		updateMessage := fmt.Sprintf("%s: Kills=%d, TotalValue=%d", killerName, playerStats[killerName].Kills, playerStats[killerName].TotalValue)
		js.Global().Call("postMessage", updateMessage)
	})

	if err := p.ParseToEnd(); err != nil {
		log.Panic("failed to parse demo: ", err)
	}
}

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
