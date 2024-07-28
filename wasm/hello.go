package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"syscall/js"

	dem "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs"
	. "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/common"
	events "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/events"
)

// GOOS=js GOARCH=wasm go build -o main.wasm
// GOOS=js GOARCH=wasm go build -ldflags="-s -w" -o main.wasm
// wasm-opt --enable-bulk-memory -Os main.wasm -o main_opt.wasm

type PlayerStats struct {
	Kills              int
	EcoKills           int // Count of eco frags
	LightBuyKills      int
	TotalValue         int
	Team               Team
	EcoKillRounds      []int
	LightBuyKillRounds []int
}

func (ps *PlayerStats) AverageKillValue() float64 {
	if ps.Kills == 0 {
		return 0
	}
	return float64(ps.TotalValue) / float64(ps.Kills)
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

func AnalyzeDemo(data []byte, attackerThreshold, victimThreshold int) {
	js.Global().Call("postMessage", "Starting parse...")

	reader := bytes.NewReader(data)
	progressReader := NewProgressReader(reader, int64(len(data)), func(progress float64) {
		js.Global().Call("postMessage", fmt.Sprintf("Progress: %.2f%%", progress))
	})
	p := dem.NewParser(progressReader)
	defer p.Close()

	playerStats := make(map[string]*PlayerStats)
	roundNum := 1

	// Register an event handler to track round end
	p.RegisterEventHandler(func(e events.RoundEnd) {
		roundNum++
		// updateMessage := fmt.Sprintf("Round=%d", roundNum)
		// js.Global().Call("postMessage", updateMessage)
	})

	p.RegisterEventHandler(func(e events.Kill) {
		if e.Killer == nil || e.Victim == nil {
			return
		}

		if len(e.Killer.Inventory) == 1 && len(e.Victim.Inventory) == 1 {
			//TODO: knife round - needs to decrement number of rounds
			return
		}

		killerName := e.Killer.Name
		victimName := e.Victim.Name
		killerValue := e.Killer.EquipmentValueCurrent()
		victimValue := e.Victim.EquipmentValueCurrent()

		killerHasMoreThanPistol := false
		killerHasRifle := false
		if len(e.Killer.Weapons()) == 0 {
			return
		}
		killerPrimaryWeapon := e.Killer.Weapons()[0]
		killerWeapons := e.Killer.Weapons()
		for _, weapon := range killerWeapons {
			weaponClass := (weapon.Type + 99) / 100
			if weaponClass >= 2 && weaponClass <= 4 {
				killerHasMoreThanPistol = true
				killerPrimaryWeapon = weapon
			}
			if weaponClass == 3 {
				if weapon.Type != 306 && weapon.Type != 305 { // Exclude scout
					killerHasRifle = true
				}
			}
			if weapon.Type == 106 { // Include P90
				killerHasRifle = true
			}
		}
		if len(e.Killer.Weapons()) == 0 {
			return
		}
		victimHasMoreThanPistol := false
		victimHasBadGun := false
		victimWeapons := e.Victim.Weapons()
		if len(victimWeapons) == 0 {
			return
		}
		victimPrimaryWeapon := e.Killer.Weapons()[0]
		for _, weapon := range victimWeapons {
			weaponClass := (weapon.Type + 99) / 100
			if weaponClass >= 2 && weaponClass <= 4 {
				victimHasMoreThanPistol = true
				victimPrimaryWeapon = weapon
			}
			if !victimHasMoreThanPistol && weaponClass == 1 {
				victimPrimaryWeapon = weapon
			}
			if weaponClass == 2 || weaponClass == 3 { // SMG, Heavy
				victimHasBadGun = true
			}
			if weapon.Type == 306 || weapon.Type == 305 { // Include scout
				victimHasBadGun = true
			}
			if weapon.Type == 106 { // Exclude P90
				victimHasBadGun = false
			}
		}

		killerArmor := e.Killer.Armor()
		victimArmor := e.Victim.Armor()

		if killerName == victimName {
			return // Ignoring self-kills
		}

		// Initialize stats if the player is not already in the map
		if _, ok := playerStats[killerName]; !ok {
			playerStats[killerName] = &PlayerStats{
				Team:               e.Killer.Team - 1,
				EcoKillRounds:      []int{},
				LightBuyKillRounds: []int{},
			}
		}
		if _, ok := playerStats[victimName]; !ok {
			playerStats[victimName] = &PlayerStats{
				Team:               e.Victim.Team - 1,
				EcoKillRounds:      []int{},
				LightBuyKillRounds: []int{},
			}
		}

		playerStats[killerName].Kills++
		playerStats[killerName].TotalValue += victimValue

		// isHero := (!killerHasMoreThanPistol && !victimHasBadGun)
		// if isHero {
		// 	updateMessageHero := fmt.Sprintf("Hero Kill - Round: %d Killer: %s used: %s - against: %s \n", roundNum, killerName, killerPrimaryWeapon, victimPrimaryWeapon)
		// 	js.Global().Call("postMessage", updateMessageHero)
		// }
		// Check if it's an eco kill
		isEco := (killerHasMoreThanPistol && !victimHasMoreThanPistol) && (killerArmor > 0 && victimArmor == 0)
		if isEco {
			playerStats[killerName].EcoKills++
			playerStats[killerName].EcoKillRounds = append(playerStats[killerName].EcoKillRounds, roundNum) // Record the round number
			updateMessage3 := fmt.Sprintf("Eco Kill - Round: %d Killer: %s used: %s - against: %s armor: %d\n", roundNum, killerName, killerPrimaryWeapon, victimPrimaryWeapon, victimArmor)
			js.Global().Call("postMessage", updateMessage3)
		}
		isLightBuyKill := (killerHasMoreThanPistol && !victimHasMoreThanPistol) || (killerHasRifle && victimHasBadGun)
		if !isEco && isLightBuyKill {
			playerStats[killerName].LightBuyKills++
			playerStats[killerName].LightBuyKillRounds = append(playerStats[killerName].LightBuyKillRounds, roundNum)
			updateMessage := fmt.Sprintf("Light Buy Kill - Round: %d Killer: %s used: %s - against: %s armor: %d", roundNum, killerName, killerPrimaryWeapon, victimPrimaryWeapon, victimArmor)
			js.Global().Call("postMessage", updateMessage)
		}
	})

	if err := p.ParseToEnd(); err != nil {
		log.Panic("failed to parse demo: ", err)
	}

	// Send final player stats to JavaScript
	// result := "Final Player Stats:\n"
	// for player, stats := range playerStats {
	// 	result += fmt.Sprintf("%s: Kills=%d, EcoKills=%d, TotalValue=%d, AvgKillValue=%.2f\n", player, stats.Kills, stats.EcoKills, stats.TotalValue, stats.AverageKillValue())
	// }
	// js.Global().Call("postMessage", result)

	// Convert player stats to JSON
	statsJSON, err := json.Marshal(playerStats)
	if err != nil {
		js.Global().Call("postMessage", "Error encoding message to JSON")
		return
	}
	msg := map[string]interface{}{
		"type":        "PlayerStats",
		"data":        json.RawMessage(statsJSON),
		"totalRounds": roundNum,
	}
	msgJSON, err := json.Marshal(msg)
	if err != nil {
		js.Global().Call("postMessage", `{"type":"error","data":"Error encoding message to JSON"}`)
		return
	}
	// Send JSON string to JavaScript
	js.Global().Call("postMessage", string(msgJSON))
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
