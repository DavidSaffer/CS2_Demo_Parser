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
  Typography
} from "@mui/material";
import styles from "./PlayerStatsTable.module.css";

const GeneralPlayerStatsTable = ({ playerStats }) => {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("totalKills");

  const columns = [
    { id: "Player", label: "Player" },
    { id: "gamesPlayed", label: "Games Played" },
    { id: "totalKills", label: "Total Kills" },
    { id: "EcoKills", label: "Eco Kills" },
    { id: "LightBuyKills", label: "Light Buy Kills" },
    { id: "realKills", label: "Real Kills" },
    { id: "avgKillValue", label: "Average Kill Value" }
  ];

  const calculateRealKills = (stats) => {
    return stats.totalKills - stats.EcoKills - stats.LightBuyKills;
  };

  const calculateAvgKillValue = (stats) => {
    return stats.totalKills > 0 ? (stats.TotalValue / stats.totalKills).toFixed(2) : 0;
  };

  const handleRequestSort = (event, property) => {
    const isNewOrder = orderBy !== property;
    setOrder(isNewOrder ? "desc" : order === "asc" ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedPlayerStats = useMemo(() => {
    return Object.entries(playerStats).sort((a, b) => {
      let valueA = a[1][orderBy];
      let valueB = b[1][orderBy];
      if (orderBy === "realKills") {
        valueA = calculateRealKills(a[1]);
        valueB = calculateRealKills(b[1]);
    } else if (orderBy === "avgKillValue") {
        valueA = parseFloat(calculateAvgKillValue(a[1]));
        valueB = parseFloat(calculateAvgKillValue(b[1]));
    } else {
        valueA = a[1][orderBy];
        valueB = b[1][orderBy];
    }
    
      return order === "asc" ? valueA - valueB : valueB - valueA;
    });
  }, [playerStats, orderBy, order]);

  return (
    <div>
      <Typography variant="h6" style={{ padding: 16 }}>Player Statistics</Typography>
      <TableContainer component={Paper}>
        <Table>
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
                <TableCell>{stats.gamesPlayed}</TableCell>
                <TableCell>{stats.totalKills}</TableCell>
                <TableCell>{stats.EcoKills}</TableCell>
                <TableCell>{stats.LightBuyKills}</TableCell>
                <TableCell>{calculateRealKills(stats)}</TableCell>
                <TableCell>{calculateAvgKillValue(stats)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GeneralPlayerStatsTable;
