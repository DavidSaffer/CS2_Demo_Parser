import React from "react";
import { useAppSelector } from "../app/hooks";
import styled from "styled-components";
import CustomProgressBar from "./CustomProgressBar";
import { useTheme } from "styled-components";

// Define the prop types using an interface
interface ProgressBarProps {
  width?: string;
  height?: string;
}

// Accept props in the styled component for dynamic styling
// const DemoProgressBar = styled.progress<{ width: string; height: string }>`
//   /* Dynamic width and height based on props */
//   width: ${({ width }) => width || "100%"};
//   height: ${({ height }) => height || "20px"};

//   /* Remove default appearance */
//   appearance: none;
//   -webkit-appearance: none;
//   background-color: #c7ffc3;

//   /* Border radius for rounded corners */
//   border-radius: 10px;

//   outline: 2px solid white;

//   /* Style the progress value for WebKit browsers */
//   &::-webkit-progress-bar {
//     background-color: #c7ffc3;
//     border-radius: 10px;
//   }
//   &::-webkit-progress-value {
//     background-color: #234d20;
//     transition: width 0.5s ease;
//     border-radius: 10px;
//   }

//   /* Style the progress value for Firefox */
//   &::-moz-progress-bar {
//     background-color: #234d20;
//   }
// `;

const DemoProgressBar: React.FC<ProgressBarProps> = ({
  width = "100%",
  height = "20px",
}) => {
  const theme = useTheme();
  let currentProgress = useAppSelector((state) => state.demoParse.progress);

  return (
    <CustomProgressBar
      progress={currentProgress}
      height={height}
      barBackgroundColor={theme.progressBar.background}
      barValueColor={theme.progressBar.value}
      textColor={theme.colors.text}
      includeText={true}
    />
  );
};

export default DemoProgressBar;
