package main

// import (
// 	"fmt"
// 	"log"
// 	"net/http"
// 	"os"

// 	"github.com/gin-contrib/cors"
// 	"github.com/gin-gonic/gin"
// 	dem "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs"
// 	events "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/events"
// )

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

// // Struct to uniquely identify a kill event
// type KillEventID struct {
// 	KillerName string
// 	VictimName string
// 	Weapon     string
// }

// func main() {
// 	// Map to hold player stats
// 	playerStats := make(map[string]*PlayerStats)
// 	processedKills := make(map[KillEventID]bool)

// 	// Parse the demo file and populate playerStats
// 	err := parseDemoFile("demo.dem", playerStats, processedKills)
// 	if err != nil {
// 		log.Panic("failed to parse demo: ", err)
// 	}

// 	// Set up Gin router
// 	router := gin.Default()

// 	// Configure CORS middleware to allow requests from localhost:3000
// 	router.Use(cors.New(cors.Config{
// 		AllowOrigins:     []string{"http://localhost:3000"},
// 		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
// 		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
// 		ExposeHeaders:    []string{"Content-Length"},
// 		AllowCredentials: true,
// 	}))

// 	// Define the endpoint
// 	router.GET("/stats", func(c *gin.Context) {
// 		c.JSON(http.StatusOK, playerStats)
// 	})

// 	// Start the server
// 	router.Run(":8080")
// }

// func parseDemoFile(filename string, playerStats map[string]*PlayerStats, processedKills map[KillEventID]bool) error {
// 	// Open demo file
// 	f, err := os.Open(filename)
// 	if err != nil {
// 		return fmt.Errorf("failed to open demo file: %w", err)
// 	}
// 	defer f.Close()

// 	// Create parser
// 	p := dem.NewParser(f)
// 	defer p.Close()

// 	// Register handler on kill events
// 	p.RegisterEventHandler(func(e events.Kill) {
// 		var hs, wallBang string

// 		if e.IsHeadshot {
// 			hs = " (HS)"
// 		}
// 		if e.PenetratedObjects > 0 {
// 			wallBang = " (WB)"
// 		}

// 		// Check if Killer and Victim are not nil to avoid nil pointer dereference
// 		if e.Killer == nil || e.Victim == nil {
// 			return
// 		}

// 		killerName := e.Killer.Name
// 		victimName := e.Victim.Name
// 		killerValue := e.Killer.EquipmentValueFreezeTimeEnd()
// 		weapon := e.Weapon.String()

// 		// Ignore self-kills
// 		if killerName == victimName {
// 			fmt.Printf("Ignoring self-kill: %s killed themselves\n", killerName)
// 			return
// 		}

// 		// Create a unique identifier for the kill event
// 		killID := KillEventID{
// 			KillerName: killerName,
// 			VictimName: victimName,
// 			Weapon:     weapon,
// 		}

// 		// Check if this kill event has already been processed
// 		if _, ok := processedKills[killID]; ok {
// 			return
// 		}

// 		// Mark this kill event as processed
// 		processedKills[killID] = true

// 		// Initialize stats if the player is not already in the map
// 		if _, ok := playerStats[killerName]; !ok {
// 			playerStats[killerName] = &PlayerStats{}
// 		}
// 		if _, ok := playerStats[victimName]; !ok {
// 			playerStats[victimName] = &PlayerStats{}
// 		}

// 		// Debugging: Print event details
// 		fmt.Printf("Processing kill event: Killer: %s, Victim: %s, Weapon: %v%s%s\n", killerName, victimName, e.Weapon, hs, wallBang)

// 		// Update killer stats
// 		playerStats[killerName].Kills++
// 		playerStats[killerName].TotalValue += killerValue

// 		// Print the event
// 		fmt.Printf("%s (Value: %d) <%v%s%s> %s\n", killerName, killerValue, e.Weapon, hs, wallBang, victimName)
// 	})

// 	// Parse to end
// 	err = p.ParseToEnd()
// 	if err != nil {
// 		return fmt.Errorf("failed to parse demo: %w", err)
// 	}

// 	return nil
// }
