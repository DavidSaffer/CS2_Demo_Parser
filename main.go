package main

// // PlayerStats holds stats for a player
// type PlayerStats struct {
// 	Kills      int
// 	TotalValue int
// }

// // AverageKillValue calculates the average kill value
// func (ps *PlayerStats) AverageKillValue() float64 {
// 	if ps.Kills == 0 {
// 		return 0
// 	}
// 	return float64(ps.TotalValue) / float64(ps.Kills)
// }

// func main() {
// 	f, err := os.Open("demo.dem")
// 	if err != nil {
// 		log.Panic("failed to open demo file: ", err)
// 	}
// 	defer f.Close()

// 	p := dem.NewParser(f)
// 	defer p.Close()

// 	// Map to hold player stats
// 	playerStats := make(map[string]*PlayerStats)

// 	// Register handler on kill events
// 	p.RegisterEventHandler(func(e events.Kill) {

// 		// Check if Killer and Victim are not nil to avoid nil pointer dereference
// 		if e.Killer == nil || e.Victim == nil {
// 			print("HERE?")
// 			return
// 		}

// 		killerName := e.Killer.Name
// 		victimName := e.Victim.Name
// 		// killerValue := e.Killer.EquipmentValueFreezeTimeEnd()
// 		victimValue := e.Victim.EquipmentValueFreezeTimeEnd()

// 		// Ignore self-kills
// 		if killerName == victimName {
// 			fmt.Printf("Ignoring self-kill: %s killed themselves\n", killerName)
// 			return
// 		}

// 		// Initialize stats if the player is not already in the map
// 		if _, ok := playerStats[killerName]; !ok {
// 			playerStats[killerName] = &PlayerStats{}
// 		}
// 		if _, ok := playerStats[victimName]; !ok {
// 			playerStats[victimName] = &PlayerStats{}
// 		}

// 		// Update killer stats
// 		playerStats[killerName].Kills++
// 		playerStats[killerName].TotalValue += victimValue

// 		// Print the event
// 		//fmt.Printf("%s (Value: %d) <%v%s%s> %s\n", killerName, killerValue, e.Weapon, hs, wallBang, victimName)
// 	})

// 	// Parse to end
// 	err = p.ParseToEnd()
// 	if err != nil {
// 		log.Panic("failed to parse demo: ", err)
// 	}

// 	fmt.Println("\nPlayer Stats:")
// 	for player, stats := range playerStats {
// 		fmt.Printf("Player: %s, Kills: %d, Total Kill Value: %d, Average Kill Value: %.2f\n", player, stats.Kills, stats.TotalValue, stats.AverageKillValue())
// 	}
// }
