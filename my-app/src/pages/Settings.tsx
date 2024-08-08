// src/pages/Home.tsx
import React from "react";
import ThemeSwitch from "../features/theme/ThemeSwitch";

const Settings: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the React App</h1>
      <ThemeSwitch />
    </div>
  );
};

export default Settings;
