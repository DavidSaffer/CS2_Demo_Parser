// src/components/ThemeToggleButton.js
import React from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useTheme } from "../../ThemeContext";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <DarkModeSwitch
      style={{ marginBottom: "2rem" }}
      checked={theme === "dark"}
      onChange={toggleTheme}
      size={50}
    />
  );
};

export default ThemeToggleButton;
