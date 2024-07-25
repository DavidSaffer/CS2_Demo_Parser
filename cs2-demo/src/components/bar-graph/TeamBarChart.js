import React, { useState } from "react";
import { Button } from "@mui/material";
import BarChart from "./BarChart";

const TeamBarChart = ({ teamId, teamData }) => {
  const [chartType, setChartType] = useState("ecos");

  return (
    <div>
        <br></br>
      <div>
        <Button
          variant={chartType === "ecos" ? "contained" : "outlined"}
          onClick={() => setChartType("ecos")}
        >
          Ecos
        </Button>
        <Button
          variant={chartType === "lightBuys" ? "contained" : "outlined"}
          onClick={() => setChartType("lightBuys")}
        >
          Light Buys
        </Button>
      </div>
      <BarChart playerStats={teamData} chartType={chartType} />
    </div>
  );
};

export default TeamBarChart;
