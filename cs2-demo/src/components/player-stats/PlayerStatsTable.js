import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BarChart from "../bar-graph/BarGraph";

const PlayerStatsTable = ({ playerStats }) => {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("EcoKills");
  const columns = [
    { id: "Player", label: "Player" },
    { id: "Kills", label: "Kills" },
    { id: "EcoKills", label: "EcoKills" },
    { id: "LightBuyKills", label: "Light Buy Kills" }, // Using the correct data key
    { id: "AvgKillValue", label: "Avg Kill Value" }, // Making it human-readable
  ];
  const [expanded, setExpanded] = useState({});

  const calculateAvgKillValue = (stats) => {
    return stats.Kills === 0 ? 0 : (stats.TotalValue / stats.Kills).toFixed(2);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const teams = useMemo(() => {
    const groupedTeams = {};
    Object.entries(playerStats).forEach(([player, stats]) => {
      const teamId = stats.Team;
      if (!groupedTeams[teamId]) {
        groupedTeams[teamId] = [];
      }
      groupedTeams[teamId].push([player, stats]);
    });
    return groupedTeams;
  }, [playerStats]);

  const teamBarGraphData = useMemo(() => {
    const data = {};
    Object.entries(playerStats).forEach(([player, stats]) => {
      if (stats.Team && stats.EcoKillRounds) {
        if (!data[stats.Team]) {
          data[stats.Team] = {};
        }
        data[stats.Team][player] = stats.EcoKillRounds;
      }
    });
    return data;
  }, [playerStats]);
  console.log("Team Bar Graph Data:", teamBarGraphData);

  const handleExpand = (teamId) => (event, isExpanded) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [teamId]: isExpanded ? !prevExpanded[teamId] : false,
    }));
  };

  const renderTeamTable = (teamPlayers, teamId) => {
    const sortedPlayerStats = teamPlayers.sort((a, b) => {
      const [playerA, statsA] = a;
      const [playerB, statsB] = b;

      // Adjusting this to parse float only for AvgKillValue which is a string
      const valueA =
        orderBy === "AvgKillValue"
          ? parseFloat(calculateAvgKillValue(statsA))
          : statsA[orderBy];
      const valueB =
        orderBy === "AvgKillValue"
          ? parseFloat(calculateAvgKillValue(statsB))
          : statsB[orderBy];

      return order === "asc" ? valueA - valueB : valueB - valueA;
    });

    return (
      <Accordion
        expanded={expanded[teamId] || false}
        onChange={handleExpand(teamId)}
        key={teamId}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Team {teamId}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table aria-label={`Player stats table for Team ${teamId}`}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={(event) => handleRequestSort(event, column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPlayerStats.map(([player, stats]) => (
                  <TableRow key={player}>
                    <TableCell>{player}</TableCell>
                    <TableCell>{stats.Kills}</TableCell>
                    <TableCell>{stats.EcoKills}</TableCell>
                    <TableCell>{stats.LightBuyKills}</TableCell>
                    {/* New column for Light Buy Kills */}
                    <TableCell>{calculateAvgKillValue(stats)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <BarChart playerStats={teamBarGraphData[teamId]} />
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <div>
      {Object.keys(teams).map((teamId) =>
        renderTeamTable(teams[teamId], teamId)
      )}
    </div>
  );
};

export default PlayerStatsTable;
