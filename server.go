package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	dem "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs"
	. "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/common"
	events "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/events"
)

// PlayerStats holds stats for a player
type PlayerStats struct {
	Kills      int
	TotalValue int
	Team       Team
}

// AverageKillValue calculates the average kill value
func (ps *PlayerStats) AverageKillValue() float64 {
	if ps.Kills == 0 {
		return 0
	}
	return float64(ps.TotalValue) / float64(ps.Kills)
}

// Struct to uniquely identify a kill event
type KillEventID struct {
	KillerName string
	VictimName string
	Weapon     string
}

var (
	uploadedFile string
)

func main() {
	// Set up Gin router
	router := gin.Default()

	// Configure CORS middleware to allow requests from localhost:3000
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Define the file upload endpoint
	router.POST("/upload", func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Save the uploaded file to the server
		filePath := "./" + file.Filename
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		uploadedFile = filePath
		c.JSON(http.StatusOK, gin.H{"status": "File uploaded successfully"})
	})

	// Define the process demo endpoint
	router.POST("/process", func(c *gin.Context) {
		if uploadedFile == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
			return
		}

		playerStatsMap := make(map[string]*PlayerStats)
		processedKills := make(map[KillEventID]bool)

		err := parseDemoFile(uploadedFile, playerStatsMap, processedKills)
		if err != nil {
			log.Println("Error processing demo file:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Separate players into teams
		teams := map[Team]map[string]*PlayerStats{
			TeamTerrorists:        {},
			TeamCounterTerrorists: {},
		}

		for player, stats := range playerStatsMap {
			if stats.Team == TeamTerrorists || stats.Team == TeamCounterTerrorists {
				teams[stats.Team][player] = stats
			}
		}

		// Return the player stats by teams
		c.JSON(http.StatusOK, teams)
	})

	// Start the server
	router.Run(":8080")
}

func parseDemoFile(filename string, playerStats map[string]*PlayerStats, processedKills map[KillEventID]bool) error {
	// Open demo file
	f, err := os.Open(filename)
	if err != nil {
		return fmt.Errorf("failed to open demo file: %w", err)
	}
	defer f.Close()

	// Create parser
	p := dem.NewParser(f)
	defer p.Close()

	// Register handler on kill events
	p.RegisterEventHandler(func(e events.Kill) {
		// Check if Killer and Victim are not nil to avoid nil pointer dereference
		if e.Killer == nil || e.Victim == nil {
			return
		}

		killerName := e.Killer.Name
		victimName := e.Victim.Name
		killerValue := e.Killer.EquipmentValueFreezeTimeEnd()
		weapon := e.Weapon.String()

		// Ignore self-kills
		if killerName == victimName {
			fmt.Printf("Ignoring self-kill: %s killed themselves\n", killerName)
			return
		}

		// Create a unique identifier for the kill event
		killID := KillEventID{
			KillerName: killerName,
			VictimName: victimName,
			Weapon:     weapon,
		}

		// Check if this kill event has already been processed
		if _, ok := processedKills[killID]; ok {
			return
		}

		// Mark this kill event as processed
		processedKills[killID] = true

		// Initialize stats if the player is not already in the map
		if _, ok := playerStats[killerName]; !ok {
			playerStats[killerName] = &PlayerStats{
				Team: e.Killer.Team,
			}
		}
		if _, ok := playerStats[victimName]; !ok {
			playerStats[victimName] = &PlayerStats{
				Team: e.Victim.Team,
			}
		}

		// Update killer stats
		playerStats[killerName].Kills++
		playerStats[killerName].TotalValue += killerValue
	})

	// Parse to end
	err = p.ParseToEnd()
	if err != nil {
		return fmt.Errorf("failed to parse demo: %w", err)
	}

	return nil
}
