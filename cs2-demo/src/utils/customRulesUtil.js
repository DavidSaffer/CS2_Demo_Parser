

const applyCustomRules = (playerStats, rules) => {
    const newStats = {};

    Object.entries(playerStats).forEach(([playerName, stats]) => {
        const canonicalName = rules[playerName] || playerName;
        if (!newStats[canonicalName]) {
            newStats[canonicalName] = { ...stats, gamesPlayed: 0, totalKills: 0, EcoKills: 0, LightBuyKills: 0, TotalValue: 0 };
        }
        newStats[canonicalName].gamesPlayed += stats.gamesPlayed;
        newStats[canonicalName].totalKills += stats.totalKills;
        newStats[canonicalName].EcoKills += stats.EcoKills;
        newStats[canonicalName].LightBuyKills += stats.LightBuyKills;
        newStats[canonicalName].TotalValue += stats.TotalValue;
    });

    return newStats;
};

const fetchCustomRules = () => {
    return JSON.parse(localStorage.getItem("playerNameRules")) || {};
};

export { fetchCustomRules, applyCustomRules }