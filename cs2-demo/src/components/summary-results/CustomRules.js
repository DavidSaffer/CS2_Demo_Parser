// src/components/summary-results/CustomRules.js

import React from "react";
import {useState} from React;

const CustomRules = () => {

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
    };
    
    return (
        <>
          <div>
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
          <div className={styles.parentContainer}>
            <div className={styles.container}>
              <h2>Summary of Player Stats</h2>
              <div className={styles.results}>
                <GeneralPlayerStatsTable playerStats={playerStats} />
              </div>
            </div>
          </div>
        </>
    );

};

export default CustomRules