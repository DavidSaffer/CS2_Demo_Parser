import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';

const PlayerStatsTable = ({ playerStats }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Player');
  const columns = ["Player", "Kills", "EcoKills", "TotalValue", "AvgKillValue"];

  // Calculate average kill value for each player
  const calculateAvgKillValue = (stats) => {
    return stats.Kills === 0 ? 0 : (stats.TotalValue / stats.Kills).toFixed(2);
  };

  // Handle sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedPlayerStats = Object.entries(playerStats).sort((a, b) => {
    const [playerA, statsA] = a;
    const [playerB, statsB] = b;

    if (orderBy === "Player") {
      return (order === 'asc' ? playerA.localeCompare(playerB) : playerB.localeCompare(playerA));
    } else {
      const valueA = orderBy === "AvgKillValue" ? calculateAvgKillValue(statsA) : statsA[orderBy];
      const valueB = orderBy === "AvgKillValue" ? calculateAvgKillValue(statsB) : statsB[orderBy];
      return (order === 'asc' ? valueA - valueB : valueB - valueA);
    }
  });

  return (
    <TableContainer component={Paper}>
      <Table aria-label="player stats table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>
                <TableSortLabel
                  active={orderBy === column}
                  direction={orderBy === column ? order : 'asc'}
                  onClick={(event) => handleRequestSort(event, column)}
                >
                  {column}
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
              <TableCell>{stats.TotalValue}</TableCell>
              <TableCell>{calculateAvgKillValue(stats)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayerStatsTable;
