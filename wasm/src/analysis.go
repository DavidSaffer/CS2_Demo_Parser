// analysis.go

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

	playerStats := make(map[string]*PlayerStats)
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

func RegisterEventHandlers(p dem.Parser, playerStats map[string]*PlayerStats, roundNum *int) {
	p.RegisterEventHandler(func(e events.RoundEnd) {
		HandleRoundEnd(roundNum)
	})

	p.RegisterEventHandler(func(e events.Kill) {
		HandleKillEvent(e, playerStats, roundNum)
	})

}

func HandleRoundEnd(roundNum *int) {
	*roundNum++
}

func HandleKillEvent(e events.Kill, playerStats map[string]*PlayerStats, roundNum *int) {
	if e.Killer == nil || e.Victim == nil {
		return
	}
	if len(e.Killer.Inventory) == 1 && len(e.Victim.Inventory) == 1 {
		// Knife Round
		//*roundNum-- caused negative rounds? oh its because there are multiple kills durring a knife round and this would -- for each kill
		return
	}
	killerName, victimName := e.Killer.Name, e.Victim.Name
	if killerName == victimName {
		return // Ignoring self-kills
	}

	victimValue := e.Victim.EquipmentValueCurrent()

	killerWeapons, victimWeapons := e.Killer.Weapons(), e.Victim.Weapons()
	killerPrimaryWeapon, victimPrimaryWeapon := getPrimaryWeapon(killerWeapons), getPrimaryWeapon(victimWeapons)

	killerHasMoreThanPistol, killerHasRifle := getKillerWeaponInfo(killerPrimaryWeapon)
	victimHasMoreThanPistol, victimHasBadGun := getVictimWeaponInfo(victimPrimaryWeapon)

	killerArmor := e.Killer.Armor()
	victimArmor := e.Victim.Armor()

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
		playerStats[killerName].EcoKillRounds = append(playerStats[killerName].EcoKillRounds, *roundNum) // Record the round number
		updateMessage3 := fmt.Sprintf("Eco Kill - Round: %d Killer: %s used: %s - against: %s armor: %d\n", *roundNum, killerName, killerPrimaryWeapon.String(), victimPrimaryWeapon.String(), victimArmor)
		js.Global().Call("postMessage", updateMessage3)
	}
	isLightBuyKill := (killerHasMoreThanPistol && !victimHasMoreThanPistol) || (killerHasRifle && victimHasBadGun)
	if !isEco && isLightBuyKill {
		playerStats[killerName].LightBuyKills++
		playerStats[killerName].LightBuyKillRounds = append(playerStats[killerName].LightBuyKillRounds, *roundNum)
		updateMessage := fmt.Sprintf("Light Buy Kill - Round: %d Killer: %s used: %s - against: %s armor: %d", *roundNum, killerName, killerPrimaryWeapon.String(), victimPrimaryWeapon.String(), victimArmor)
		js.Global().Call("postMessage", updateMessage)
	}

}

// Get the "best" weapon in their inventory.
// If they have a primary, its the primary.
// If no primary, itll be their 2ndary - then knife.
func getPrimaryWeapon(weapons []*common.Equipment) common.Equipment {
	if len(weapons) == 0 {
		return common.Equipment{}
	}
	var primaryWeapon common.Equipment
	for _, weapon := range weapons {
		weaponClass := (weapon.Type + 99) / 100
		if weaponClass >= 2 && weaponClass <= 4 {
			primaryWeapon = *weapon
			return primaryWeapon
		}
		if weaponClass == 1 {
			primaryWeapon = *weapon
		}
	}
	return primaryWeapon
}

// Calculate wether killer has more than a pistol, and if the killer has a rifle
func getKillerWeaponInfo(killerPrimaryWeapon common.Equipment) (hasMoreThanPistol, hasRifle bool) {
	weaponClass := (killerPrimaryWeapon.Type + 99) / 100
	if weaponClass >= 2 && weaponClass <= 4 {
		hasMoreThanPistol = true
	}
	if weaponClass == 4 {
		if killerPrimaryWeapon.Type != 306 { // Exclude scout
			hasRifle = true
		}
	}
	if killerPrimaryWeapon.Type == 106 { // Include P90
		hasRifle = true
	}
	return
}

// Calculate if the victim has more than a pistol, and if they had a "bad gun (non rifle)"
func getVictimWeaponInfo(killerPrimaryWeapon common.Equipment) (hasMoreThanPistol, hasBadGun bool) {
	weaponClass := (killerPrimaryWeapon.Type + 99) / 100
	if weaponClass >= 2 && weaponClass <= 4 { // SMG, Heavy, Rifle
		hasMoreThanPistol = true
	}
	if weaponClass == 2 || weaponClass == 3 { // SMG, Heavy
		hasBadGun = true
	}
	if killerPrimaryWeapon.Type == 306 { // Include scout
		hasBadGun = true
	}
	if killerPrimaryWeapon.Type == 106 { // Exclude P90
		hasBadGun = false
	}
	return
}
