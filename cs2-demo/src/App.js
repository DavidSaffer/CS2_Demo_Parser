import React from "react";
import FileInput from "./components/FileInput";
import ThemeToggleButton from "./components/buttons/ThemeToggleButton";
import { useTheme } from "./ThemeContext";
import "./App.css";

function App() {
  const { theme } = useTheme(); // Assuming useTheme is imported

  return (
    <div className={`App ${theme}`}>
      <div className="ThemeButton">
        <ThemeToggleButton />
      </div>
      <FileInput />
    </div>
  );
}

export default App;
