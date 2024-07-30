// src/components/demo-results-container/demoResultsContainer.js

import PlayerStatsTable from "../player-stats/PlayerStatsTable";
import styles from "./demoResultsContainer.module.css";

const DemoResultsContainer = ({ demoName, demoResults }) => {
  console.log("DEMO NAME ", demoName);
  console.log("DEMO RESULTS ", demoResults);
  return (
    <>
      <div className={styles.parentContainer}>
        <div className={styles.container}>
          <h2>{demoName}</h2>
          <div className={styles.results}>
            <PlayerStatsTable playerStats={demoResults} />
          </div>
        </div>
      </div>
    </>
  );
};
export default DemoResultsContainer;
