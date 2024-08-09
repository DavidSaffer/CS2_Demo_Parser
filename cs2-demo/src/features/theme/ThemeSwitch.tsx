// src/features/theme/ThemeSwitch.tsx
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleTheme } from "./themeSlice";

const ThemeSwitch: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  const handleButtonClick = () => {
    dispatch(toggleTheme());
    console.log("test");
  };

  return (
    <button onClick={handleButtonClick}>
      Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
};

export default ThemeSwitch;
