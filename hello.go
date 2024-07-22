package main

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
	EcoKills   int // Count of eco frags
	TotalValue int
}

func (ps *PlayerStats) AverageKillValue() float64 {
	if ps.Kills == 0 {
		return 0
	}
	return float64(ps.TotalValue) / float64(ps.Kills)
}

func AnalyzeDemo(data []byte, attackerThreshold, victimThreshold int) {
	js.Global().Call("postMessage", "Starting parse...")

	reader := bytes.NewReader(data)
	p := dem.NewParser(reader)
	defer p.Close()

	playerStats := make(map[string]*PlayerStats)

	roundNum := 0
	p.RegisterEventHandler(func(e events.RoundEnd) {
		// Increment the round number
		roundNum++
		// Send a simple formatted string to JavaScript
		updateMessage := fmt.Sprintf("Round=%d", roundNum)
		js.Global().Call("postMessage", updateMessage)
	})

	p.RegisterEventHandler(func(e events.Kill) {
		if e.Killer == nil || e.Victim == nil {
			return
		}

		killerName := e.Killer.Name
		victimName := e.Victim.Name
		killerValue := e.Killer.EquipmentValueFreezeTimeEnd()
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

		// Check if it's an eco kill
		if killerValue > attackerThreshold && victimValue < victimThreshold {
			playerStats[killerName].EcoKills++
		}

		// Optionally, you can still send interim updates
		// updateMessage := fmt.Sprintf("%s: Kills=%d, EcoKills=%d, TotalValue=%d", killerName, playerStats[killerName].Kills, playerStats[killerName].EcoKills, playerStats[killerName].TotalValue)
		// js.Global().Call("postMessage", updateMessage)
	})

	if err := p.ParseToEnd(); err != nil {
		log.Panic("failed to parse demo: ", err)
	}

	// Send final player stats to JavaScript
	result := "Final Player Stats:\n"
	for player, stats := range playerStats {
		result += fmt.Sprintf("%s: Kills=%d, EcoKills=%d, TotalValue=%d, AvgKillValue=%.2f\n", player, stats.Kills, stats.EcoKills, stats.TotalValue, stats.AverageKillValue())
	}
	js.Global().Call("postMessage", result)
}

func main() {
	c := make(chan struct{}, 0)

	js.Global().Set("analyzeDemo", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		go func() {
			data := make([]byte, args[0].Get("byteLength").Int())
			js.CopyBytesToGo(data, args[0])
			attackerThreshold := args[1].Int() // Get attacker equipment value threshold
			victimThreshold := args[2].Int()   // Get victim equipment value threshold
			AnalyzeDemo(data, attackerThreshold, victimThreshold)
		}()
		return nil
	}))

	<-c
}
