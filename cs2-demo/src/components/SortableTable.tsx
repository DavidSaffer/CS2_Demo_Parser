import React, { useEffect, useState, useMemo } from "react";
import { useAppSelector } from "../app/hooks";
import styled from "styled-components";

const StyledTable = styled.table`
  width: fit-content;
  border-collapse: collapse;
  margin: 20px 0;
  outline: 2px solid black;
`;

const StyledHeader = styled.th`
  background-color: ${({ theme }) => theme.table.headerColor};
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  border-bottom: 3px solid black; // Apply top border to each row
  border-top: 1px solid black;
  border-right: 3px solid black;
  &:last-child {
    border-right: 1px solid black;
  }
`;

const StyledRow = styled.tr`
  border-top: 1px solid black; // Apply top border to each row

  /* &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.background};
  }
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.accent};
  } */
`;

const StyledCol = styled.col`
  border-right: 1px solid black;
  /* &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.background};
  }
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.secondary};
  } */
`;

const StyledCell = styled.td`
  padding: 10px;
  text-align: center;
`;

interface PlayerStats {
  Name: string;
  Kills: number;
  EcoKills: number;
  LightBuyKills: number;
  TotalValue: number;
  Team: number;
  EcoKillRounds: number[];
  LightBuyKillRounds: number[];
}

interface SortableTableProps {
  team: number;
}

const SortableTable: React.FC<SortableTableProps> = ({ team }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PlayerStats;
    direction: "ascending" | "descending";
  } | null>(null);
  // Fetch all players, then filter by team
  const allPlayers = useAppSelector((state) => {
    // Check if finalData is null or undefined before using Object.values
    return state.demoParse.finalData
      ? Object.values(state.demoParse.finalData)
      : [];
  });
  const [players, setPlayers] = useState<PlayerStats[]>([]);

  const filteredPlayers = useMemo(
    () => allPlayers.filter((player) => player.Team === team),
    [allPlayers, team]
  );

  const sortedPlayers = useMemo(() => {
    return sortConfig
      ? [...filteredPlayers].sort((a, b) => {
          const key = sortConfig.key;
          const order = sortConfig.direction === "ascending" ? 1 : -1;
          return a[key] < b[key] ? -1 * order : a[key] > b[key] ? 1 * order : 0;
        })
      : filteredPlayers;
  }, [filteredPlayers, sortConfig]);

  return (
    <StyledTable>
      <colgroup>
        <StyledCol />
        <StyledCol />
        <StyledCol />
      </colgroup>
      <thead>
        <tr>
          <StyledHeader
            onClick={() =>
              setSortConfig({
                key: "Name",
                direction:
                  sortConfig?.key === "Name" &&
                  sortConfig.direction === "descending"
                    ? "ascending"
                    : "descending",
              })
            }
          >
            Name
          </StyledHeader>
          <StyledHeader
            onClick={() =>
              setSortConfig({
                key: "Kills",
                direction:
                  sortConfig?.key === "Kills" &&
                  sortConfig.direction === "descending"
                    ? "ascending"
                    : "descending",
              })
            }
          >
            Kills
          </StyledHeader>
          <StyledHeader
            onClick={() =>
              setSortConfig({
                key: "EcoKills",
                direction:
                  sortConfig?.key === "EcoKills" &&
                  sortConfig.direction === "descending"
                    ? "ascending"
                    : "descending",
              })
            }
          >
            Eco Kills
          </StyledHeader>
        </tr>
      </thead>
      <tbody>
        {sortedPlayers.map((player, index) => (
          <StyledRow key={index}>
            <StyledCell>{player.Name}</StyledCell>
            <StyledCell>{player.Kills}</StyledCell>
            <StyledCell>{player.EcoKills}</StyledCell>
          </StyledRow>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default SortableTable;
