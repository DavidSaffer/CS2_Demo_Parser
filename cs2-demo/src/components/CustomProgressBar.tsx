import React from "react";
import { useEffect, useState } from "react";
// Updated interface to include includeText parameter
interface ProgressBarProps {
  barValueColor: string; // Hex color for the bar's progress indicator
  barBackgroundColor: string; // Hex color for the bar's background
  textColor: string; // Hex color for the text inside the bar
  progress: number; // Assuming progress is always a number representing a percentage
  height: string; // Assuming height is a string like '20px', '2em', etc.
  includeText: boolean; // New parameter to control text display
}

const CustomProgressBar: React.FC<ProgressBarProps> = ({
  barValueColor,
  barBackgroundColor,
  textColor,
  progress,
  height,
  includeText, // Deconstruct includeText from props
}) => {
  const [shouldIncludeText, setShouldIncludeText] = useState(false);
  useEffect(() => {
    if (includeText) {
      if (progress >= 5) {
        setShouldIncludeText(true);
      }
    }
  }, [progress, includeText]);

  const parentDivStyle = {
    height: height,
    width: "100%",
    backgroundColor: barBackgroundColor,
    borderRadius: 40,
    outline: `1px solid ${textColor}`,
  };

  const childDivStyle = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: barValueColor,
    borderRadius: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  };

  const progressTextStyle = {
    padding: 10,
    color: textColor,
    fontWeight: 900 as const,
  };

  return (
    <div style={parentDivStyle}>
      <div style={childDivStyle}>
        {shouldIncludeText && (
          <span style={progressTextStyle}>{`${progress}%`}</span>
        )}
      </div>
    </div>
  );
};

export default CustomProgressBar;
