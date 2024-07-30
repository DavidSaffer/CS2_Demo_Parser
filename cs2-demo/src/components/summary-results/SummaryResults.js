import React, { useState, useEffect } from 'react';
import { fetchPlayerStats } from '../../utils/demoStorageUtil';
import GeneralPlayerStatsTable from '../player-stats/GeneralPlayerStatsTable'
import styles from "../demo-results-container/demoResultsContainer.module.css";
import { applyCustomRules, fetchCustomRules } from '../../utils/customRulesUtil';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import styles2 from './SummaryResults.module.css'

const SummaryResults = () => {
    const [playerStats, setPlayerStats] = useState({});

    const [rules, setRules] = useState(fetchCustomRules());
    const [newRule, setNewRule] = useState({ altName: "", canonicalName: "" });
    
    const handleRuleChange = (event) => {
        setNewRule({ ...newRule, [event.target.name]: event.target.value });
    };
    
    const saveRule = () => {
        const updatedRules = { ...rules, [newRule.altName]: newRule.canonicalName };
        localStorage.setItem("playerNameRules", JSON.stringify(updatedRules));
        setRules(updatedRules);
        setNewRule({ altName: "", canonicalName: "" }); // Reset form
         // Re-fetch and apply rules to stats
         const updatedStats = applyCustomRules(fetchPlayerStats(), updatedRules);
         setPlayerStats(updatedStats);
    };

    const deleteRule = (altName) => {
        const updatedRules = { ...rules };
        delete updatedRules[altName];
        localStorage.setItem("playerNameRules", JSON.stringify(updatedRules));
        setRules(updatedRules);
        // Re-fetch and apply rules to stats
        const updatedStats = applyCustomRules(fetchPlayerStats(), updatedRules);
        setPlayerStats(updatedStats);
    };

    useEffect(() => {
        const stats = fetchPlayerStats();
        const rules = fetchCustomRules();
        const updatedStats = applyCustomRules(stats, rules);
        setPlayerStats(updatedStats);
        console.log(stats);
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
        <div className={styles.container}>
            <input
              value={newRule.altName}
              onChange={handleRuleChange}
              name="altName"
              placeholder="Alternate Name"
            />
            <input
              value={newRule.canonicalName}
              onChange={handleRuleChange}
              name="canonicalName"
              placeholder="Canonical Name"
            />
            <button onClick={saveRule}>Save Rule</button>
          </div>
          <div className={styles.container}>
          <h2>Custom Naming Rules</h2>
          <ul>
            {Object.entries(rules).map(([altName, canonicalName]) => (
              <li key={altName} className={styles2.ruleItem}>
                {`${altName}  ->  ${canonicalName}`}
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => deleteRule(altName)}
                  color="error"
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
    </>
    );
};

export default SummaryResults;