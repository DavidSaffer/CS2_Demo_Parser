const MAX_ENTRIES = 100;
export const STORAGE_KEY = "allDemos";
const PLAYER_STATS_KEY = "playerStats";

// // Helper to update or initialize player stats
// const updatePlayerStats = (players) => {
//   const storedStats = JSON.parse(localStorage.getItem(PLAYER_STATS_KEY)) || {};
//   Object.entries(players).forEach(([playerName, stats]) => {
//     if (storedStats[playerName]) {
//       storedStats[playerName].gamesPlayed += 1;
//       storedStats[playerName].totalKills += stats.Kills;
//       storedStats[playerName].EcoKills += stats.EcoKills;
//       storedStats[playerName].LightBuyKills += stats.LightBuyKills;
//       storedStats[playerName].TotalValue += stats.TotalValue;
//     } else {
//       storedStats[playerName] = {
//         gamesPlayed: 1,
//         totalKills: stats.Kills,
//         EcoKills: stats.EcoKills,
//         LightBuyKills: stats.LightBuyKills,
//         TotalValue: stats.TotalValue,
//       };
//     }
//   });
//   localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(storedStats));
// };

export const saveAnalysisResult = (demoName, result) => {
  const allResults = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const existingIndex = allResults.findIndex(
    (item) => item.demoName === demoName
  );
  if (existingIndex !== -1) {
    allResults[existingIndex] = { demoName, result };
  } else {
    if (allResults.length >= MAX_ENTRIES) {
      allResults.shift(); // Ensure we do not exceed the max entries
    }
    allResults.push({ demoName, result });
    // updatePlayerStats(result); // Update player stats with the new result
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allResults));
};

export const fetchAnalysisResults = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const fetchPlayerStats = (minGames = 2) => {
  const allDemos = fetchAnalysisResults();
  const playerStats = {};

  // Aggregate player stats from each demo
  allDemos.forEach((demo) => {
    Object.entries(demo.result).forEach(([playerName, stats]) => {
      if (!playerStats[playerName]) {
        playerStats[playerName] = {
          name: "",
          gamesPlayed: 0,
          totalKills: 0,
          EcoKills: 0,
          LightBuyKills: 0,
          TotalValue: 0,
        };
      }
      playerStats[playerName].name = stats.Name;
      playerStats[playerName].gamesPlayed += 1;
      playerStats[playerName].totalKills += stats.Kills;
      playerStats[playerName].EcoKills += stats.EcoKills;
      playerStats[playerName].LightBuyKills += stats.LightBuyKills;
      playerStats[playerName].TotalValue += stats.TotalValue;
    });
  });

  // Filter stats based on the minimum games played
  const filteredStats = {};
  Object.entries(playerStats).forEach(([playerName, stats]) => {
    if (stats.gamesPlayed >= minGames) {
      filteredStats[playerName] = stats;
    }
  });

  return filteredStats;
};

export const clearAnalysisResults = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PLAYER_STATS_KEY); // Clear player stats as well
};
