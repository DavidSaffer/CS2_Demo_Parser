import React, { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";

const BarChart = ({ playerStats, chartType }) => {

  // Prepare data for the ecos chart
  const ecosData = useMemo(() => {
    const chartData = [];
    Object.entries(playerStats).forEach(([player, rounds]) => {
      rounds.ecos.forEach((round) => {
        const roundLabel = `Round ${round}`;
        let roundData = chartData.find((d) => d.round === roundLabel);
        if (!roundData) {
          roundData = { round: roundLabel };
          chartData.push(roundData);
        }
        roundData[player] = (roundData[player] || 0) + 1; // Increment the count of kills for this round
      });
    });
    chartData.sort((a, b) => {
      const roundNumberA = parseInt(a.round.replace(/\D/g, ""), 10);
      const roundNumberB = parseInt(b.round.replace(/\D/g, ""), 10);
      return roundNumberA - roundNumberB;
    });
    return chartData;
  }, [playerStats]);

  // Prepare data for the lightBuys chart
  const lightBuysData = useMemo(() => {
    const chartData = [];
    Object.entries(playerStats).forEach(([player, rounds]) => {
      rounds.lightBuys.forEach((round) => {
        const roundLabel = `Round ${round}`;
        let roundData = chartData.find((d) => d.round === roundLabel);
        if (!roundData) {
          roundData = { round: roundLabel };
          chartData.push(roundData);
        }
        roundData[player] = (roundData[player] || 0) + 1; // Increment the count of kills for this round
      });
    });
    chartData.sort((a, b) => {
      const roundNumberA = parseInt(a.round.replace(/\D/g, ""), 10);
      const roundNumberB = parseInt(b.round.replace(/\D/g, ""), 10);
      return roundNumberA - roundNumberB;
    });
    return chartData;
  }, [playerStats]);

  

  const data = chartType === "ecos" ? ecosData : lightBuysData;

  // Determine the maximum value for the Y axis
  const maxYValue = useMemo(() => {
    return data.reduce((total, current) => {
      const values = Object.values(current).filter(value => typeof value === 'number');
      const sumValues = values.length > 0 ? values.reduce((sum, value) => sum + value, 0) : 0; // Sum of kills for given round
      return sumValues > total ? sumValues : total;
    }, 0);
  }, [data]);

  // Create an array of integers from 0 to maxYValue
  const yTickValues = useMemo(() => {
    return Array.from({ length: maxYValue + 1 }, (_, i) => i);
  }, [maxYValue]);
  console.log(yTickValues)

  // Custom theme for tooltips
  const theme = {
    tooltip: {
      container: {
        background: '#333333', // Dark background
        color: '#ffffff', // Light text
      },
    },
  };

  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={data}
        keys={Object.keys(playerStats)}
        indexBy="round"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Round",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Kills",
          legendPosition: "middle",
          legendOffset: -40,
          tickValues: yTickValues,
        }}
        enableGridY={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["brighter", 1.6]] }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        theme={theme}
      />
    </div>
  );
};

export default BarChart;
