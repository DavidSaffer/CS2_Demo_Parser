//go:build js && wasm

package main

import (
	"bytes"
	"fmt"
	"log"
	"syscall/js"

	dem "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs"
	common "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/common"
	events "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/events"
)

/*
PlayerStats holds statistics for a player in the demo analysis
  - EcoKillRounds: Slice of rounds where the player made eco kills
  - LightBuyKillRounds: Slice of rounds where the player made light buy kills
*/
type PlayerStats struct {
	Name               string
	Kills              int
	EcoKills           int
	LightBuyKills      int
	TotalValue         int
	Team               common.Team
	EcoKillRounds      []int
	LightBuyKillRounds []int
}

func AnalyzeDemo(data []byte) {
	js.Global().Call("postMessage", "Starting parse...")

	if len(data) == 0 {
		js.Global().Call("postMessage", "AnalyzeDemo: received empty demo data")
		log.Fatal("AnalyzeDemo: received empty demo data")
	}

	reader := bytes.NewReader(data)

	if reader == nil {
		js.Global().Call("postMessage", "Error: reader is nil")
		return
	}

	progressReader := NewProgressReader(reader, int64(len(data)), func(progress float64) {
		js.Global().Call("postMessage", fmt.Sprintf("Progress: %.0f%%", progress))
	})
	var p dem.Parser = dem.NewParser(progressReader)
	defer p.Close()

	playerStats := make(map[uint64]*PlayerStats)
	roundNum := 1

	RegisterEventHandlers(p, playerStats, &roundNum) // <- Logic is in here

	if err := p.ParseToEnd(); err != nil { // <- Run the parse here
		js.Global().Call("postMessage", fmt.Sprintf("Failed to parse demo: %s", err.Error()))
		log.Panic("failed to parse demo: ", err)
	}

	// Send final player stats to JavaScript
	// Convert player stats to JSON
	sendFinalStats(playerStats, roundNum)
}

func RegisterEventHandlers(p dem.Parser, playerStats map[uint64]*PlayerStats, roundNum *int) {
	p.RegisterEventHandler(func(e events.RoundEnd) {
		HandleRoundEnd(roundNum)
	})

	p.RegisterEventHandler(func(e events.Kill) {
		HandleKillEvent(e, playerStats, roundNum)
	})

	p.RegisterEventHandler(func(e events.PlayerConnect) {

	})

}

func HandleRoundEnd(roundNum *int) {
	*roundNum++
}

func HandleKillEvent(e events.Kill, playerStats map[uint64]*PlayerStats, roundNum *int) {
	if e.Killer == nil || e.Victim == nil {
		return
	}
	if len(e.Killer.Inventory) == 1 && len(e.Victim.Inventory) == 1 {
		// Knife Round
		//*roundNum-- caused negative rounds? oh its because there are multiple kills durring a knife round and this would -- for each kill
		return
	}
	killerName, victimName := e.Killer.Name, e.Victim.Name
	killerID := e.Killer.SteamID64
	// idMessage := fmt.Sprintf("SteamID = %d Name = %s", killerID, killerName)
	// js.Global().Call("postMessage", idMessage)

	if killerName == victimName {
		return // Ignoring self-kills
	}

	if killerID == 0 {
		debugMsg := fmt.Sprintf("SteamID = %d Name = %s", killerID, killerName)
		js.Global().Call("postMessage", debugMsg)
		return // This happened idk how? or why? game had bot
	}
	if e.Victim.SteamID64 == 0 {
		debugMsg := fmt.Sprintf("SteamID = %d Name = %s", e.Victim.SteamID64, victimName)
		js.Global().Call("postMessage", debugMsg)
		return // This happened idk how? or why?
	}

	victimValue := e.Victim.EquipmentValueCurrent()

	killerWeapons, victimWeapons := e.Killer.Weapons(), e.Victim.Weapons()
	// Something is happening - since there was a bot, the inventory is sometimes just randomly empty?
	// on faceit - round = round + 2
	if len(killerWeapons) == 0 || len(victimWeapons) == 0 {
		js.Global().Call("postMessage", "Error: Inventory empty - This game probally had a bot")
	}

	killerPrimaryWeapon, victimPrimaryWeapon := getPrimaryWeapon(killerWeapons), getPrimaryWeapon(victimWeapons)

	killerHasMoreThanPistol, killerHasRifle := getKillerWeaponInfo(killerPrimaryWeapon)
	victimHasMoreThanPistol, victimHasBadGun := getVictimWeaponInfo(victimPrimaryWeapon)

	killerArmor := e.Killer.Armor()
	victimArmor := e.Victim.Armor()

	// Initialize stats if the player is not already in the map
	if _, ok := playerStats[killerID]; !ok {
		playerStats[killerID] = &PlayerStats{
			Name:               killerName,
			Team:               e.Killer.Team - 1,
			EcoKillRounds:      []int{},
			LightBuyKillRounds: []int{},
		}
	}
	if e.Victim.SteamID64 != 0 {
		if _, ok := playerStats[e.Victim.SteamID64]; !ok {
			playerStats[e.Victim.SteamID64] = &PlayerStats{
				Name:               victimName,
				Team:               e.Victim.Team - 1,
				EcoKillRounds:      []int{},
				LightBuyKillRounds: []int{},
			}
		}
	}

	playerStats[killerID].Kills++
	playerStats[killerID].TotalValue += victimValue

	// isHero := (!killerHasMoreThanPistol && !victimHasBadGun)
	// if isHero {
	// 	updateMessageHero := fmt.Sprintf("Hero Kill - Round: %d Killer: %s used: %s - against: %s \n", roundNum, killerName, killerPrimaryWeapon, victimPrimaryWeapon)
	// 	js.Global().Call("postMessage", updateMessageHero)
	// }
	// Check if it's an eco kill
	isEco := (killerHasMoreThanPistol && !victimHasMoreThanPistol) && (killerArmor > 0 && victimArmor == 0)
	if isEco {
		playerStats[killerID].EcoKills++
		playerStats[killerID].EcoKillRounds = append(playerStats[killerID].EcoKillRounds, *roundNum) // Record the round number
		updateMessage3 := fmt.Sprintf("Eco Kill - Round: %d Killer: %s used: %s - against: %s armor: %d\n", *roundNum, killerName, killerPrimaryWeapon.Type.String(), victimPrimaryWeapon.Type.String(), victimArmor)
		js.Global().Call("postMessage", updateMessage3)
	}
	isLightBuyKill := (killerHasMoreThanPistol && !victimHasMoreThanPistol) || (killerHasRifle && victimHasBadGun)
	if !isEco && isLightBuyKill {
		playerStats[killerID].LightBuyKills++
		playerStats[killerID].LightBuyKillRounds = append(playerStats[killerID].LightBuyKillRounds, *roundNum)
		updateMessage := fmt.Sprintf("Light Buy Kill - Round: %d Killer: %s used: %s - against: %s armor: %d", *roundNum, killerName, killerPrimaryWeapon.Type.String(), victimPrimaryWeapon.Type.String(), victimArmor)
		js.Global().Call("postMessage", updateMessage)
	}
}
