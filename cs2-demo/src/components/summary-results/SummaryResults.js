import React, { useState, useEffect } from 'react';
import { fetchPlayerStats } from '../../utils/demoStorageUtil';
import GeneralPlayerStatsTable from '../player-stats/GeneralPlayerStatsTable'
import styles from "../demo-results-container/demoResultsContainer.module.css";


const SummaryResults = () => {
    const [playerStats, setPlayerStats] = useState({});

    useEffect(() => {
        const stats = fetchPlayerStats();
        setPlayerStats(stats);
    }, []);

    return (
        <>
      <div className={styles.parentContainer}>
        <div className={styles.container}>
          <h2>{`Summary of Player Stats`}</h2>
          <div className={styles.results}>
          <GeneralPlayerStatsTable playerStats={playerStats} />
          </div>
        </div>
        
      </div>
      
    </>
    );
};

export default SummaryResults;