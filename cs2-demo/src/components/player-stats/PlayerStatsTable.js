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
import TeamBarChart from "../bar-graph/TeamBarChart";
import styles from "./PlayerStatsTable.module.css";

const PlayerStatsTable = ({ playerStats }) => {
  console.log("PLAYERSTATS TABLE: ", playerStats)
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("EcoKills");
  const [expanded, setExpanded] = useState({});

  const columns = [
    { id: "Player", label: "Player" },
    { id: "Kills", label: "Kills" },
    { id: "RealKills", label: '"Real" Kills' },
    { id: "EcoKills", label: "EcoKills" },
    { id: "LightBuyKills", label: "Light Buy Kills" },
    { id: "AvgKillValue", label: "Avg Kill Value" },
  ];

  const calculateAvgKillValue = (stats) => {
    return stats.Kills === 0 ? 0 : (stats.TotalValue / stats.Kills).toFixed(2);
  };

  const calculateRealKills = (stats) => {
    return stats.Kills - stats.EcoKills - stats.LightBuyKills;
  };

  const handleRequestSort = (event, property) => {
    const isNewColumn = orderBy !== property;
    // If it's a new column, start with descending, otherwise toggle the current order
    setOrder(isNewColumn ? "desc" : order === "asc" ? "desc" : "asc");
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
      if (stats.Team) {
        if (!data[stats.Team]) {
          data[stats.Team] = {};
        }
        data[stats.Team][player] = {
          ecos: stats.EcoKillRounds,
          lightBuys: stats.LightBuyKillRounds,
        };
      }
    });
    return data;
  }, [playerStats]);

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

      let valueA = statsA[orderBy]; // Default to direct attribute
      let valueB = statsB[orderBy];

      if (orderBy === "AvgKillValue") {
        valueA = parseFloat(calculateAvgKillValue(statsA));
        valueB = parseFloat(calculateAvgKillValue(statsB));
      } else if (orderBy === "RealKills") {
        valueA = calculateRealKills(statsA);
        valueB = calculateRealKills(statsB);
      }

      return order === "asc" ? valueA - valueB : valueB - valueA;
    });

    return (
      <Accordion
        expanded={expanded[teamId] || false}
        onChange={handleExpand(teamId)}
        key={teamId}
        className={styles.Accordion}
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
                    <TableCell style={{ textAlign: "center" }}>
                      {stats.Name}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {stats.Kills}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {calculateRealKills(stats)}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {stats.EcoKills}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {stats.LightBuyKills}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {calculateAvgKillValue(stats)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TeamBarChart teamId={teamId} teamData={teamBarGraphData[teamId]} />
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
