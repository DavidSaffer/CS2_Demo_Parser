import React, { useState, useEffect } from "react";
import FileInput from "./components/FileInput";
import DemoResultsContainer from "./components/demo-results-container/demoResultsContainer";
import { fetchAnalysisResults } from "./utils/demoStorageUtil";
import SummaryResults from "./components/summary-results/SummaryResults";
import "./App.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import DeleteIcon from '@mui/icons-material/Delete';
import ListItemIcon from '@mui/material/ListItemIcon';

import {STORAGE_KEY} from './utils/demoStorageUtil'

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#555",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fff",
    },
    secondary: {
      main: "#bbb",
    },
  },
});

function App() {
  const [theme, setTheme] = useState("dark");
  const [appMenuAnchorEl, setAppMenuAnchorEl] = useState(null);
  const [settingsMenuAnchorEl, setSettingsMenuAnchorEl] = useState(null);
  const [demos, setDemos] = useState([]);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [showSummaryResults, setShowSummaryResults] = useState(false);

  useEffect(() => {
    setDemos(fetchAnalysisResults());
  }, []);

  const handleAppMenu = (event) => {
    setAppMenuAnchorEl(event.currentTarget);
  };

  const handleSettingsMenu = (event) => {
    setSettingsMenuAnchorEl(event.currentTarget);
  };

  const closeAppMenu = () => {
    setAppMenuAnchorEl(null);
  };

  const closeSettingsMenu = () => {
    setSettingsMenuAnchorEl(null);
  };

  const handleDemoClick = (demo) => {
    console.log(demo);
    setSelectedDemo(demo);
    closeAppMenu();
    setShowSummaryResults(false);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    document.documentElement.classList.toggle("light-theme");
  };

  const handleDeleteDemo = (event, demoName) => {
    event.stopPropagation(); // Prevent triggering the click event of the menu item
    const updatedDemos = demos.filter(demo => demo.demoName !== demoName);
    setDemos(updatedDemos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDemos));
    // Optionally, you might want to update or clear the player stats if needed
    if (selectedDemo && selectedDemo.demoName === demoName) {
      setSelectedDemo(null); // Clear selection if the deleted demo was selected
    }
  };

  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline enableColorScheme={true} />
      <div className="header">
        <IconButton color="inherit" onClick={handleAppMenu}>
          <MenuIcon color="primary" />
        </IconButton>
        <Menu
          id="app-menu"
          anchorEl={appMenuAnchorEl}
          open={Boolean(appMenuAnchorEl)}
          onClose={closeAppMenu}
        >
          <MenuItem onClick={() => { setSelectedDemo(null); closeAppMenu(); setShowSummaryResults(true); }}>Summary Results</MenuItem>
          {demos.map((demo, index) => (
            <MenuItem key={index} onClick={() => handleDemoClick(demo)}>
              {demo.demoName}
              <ListItemIcon onClick={(e) => handleDeleteDemo(e, demo.demoName)}>
                <DeleteIcon />
              </ListItemIcon>
            </MenuItem>
          ))}
        </Menu>
        <IconButton color="inherit" onClick={handleSettingsMenu}>
          <SettingsIcon color="primary" />
        </IconButton>
        <Menu
          id="settings-menu"
          anchorEl={settingsMenuAnchorEl}
          open={Boolean(settingsMenuAnchorEl)}
          onClose={closeSettingsMenu}
        >
          <MenuItem>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch checked={theme === "dark"} onChange={toggleTheme} />
                }
                label={theme === "dark" ? "Dark Mode" : "Light Mode"}
              />
            </FormGroup>
          </MenuItem>
        </Menu>
      </div>
      <div className="App">
        <FileInput />
        {selectedDemo && (
          <DemoResultsContainer
            demoName={selectedDemo.demoName}
            demoResults={selectedDemo.result}
          />
        )}
        {showSummaryResults && (
          <SummaryResults />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
