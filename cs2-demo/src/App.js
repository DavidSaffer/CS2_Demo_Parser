import React, { useState } from "react";
import FileInput from "./components/FileInput";
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

// Define light theme
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000", // Black for light mode
    },
    secondary: {
      main: "#555", // Darker gray for light mode
    },
  },
});

// Define dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fff", // White for dark mode
    },
    secondary: {
      main: "#bbb", // Lighter gray for dark mode
    },
  },
});
//    ../wasm/./build-wasm.sh

function App() {
  const [theme, setTheme] = useState("dark"); // Default theme set to 'dark'
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    document.documentElement.classList.toggle("light-theme");
  };
  // Determine which theme to use
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline enableColorScheme />
      <div className="header">
        <IconButton className="nav-menu" color="inherit">
          <MenuIcon color="primary" />
        </IconButton>
        <IconButton className="settings" color="inherit" onClick={handleMenu}>
          <SettingsIcon color="primary" />
        </IconButton>
        <Menu
          id="settings-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
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
      </div>
    </ThemeProvider>
  );
}

export default App;
