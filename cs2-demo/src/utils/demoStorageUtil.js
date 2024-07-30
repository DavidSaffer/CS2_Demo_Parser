// src/utils/storageUtils.js

const MAX_ENTRIES = 10;
const STORAGE_KEY = "allDemos"; // Single key for storing all demos

export const saveAnalysisResult = (demoName, result) => {
  const allResults = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  // Check if the demo already exists and update it, otherwise push new
  const existingIndex = allResults.findIndex(
    (item) => item.demoName === demoName
  );
  if (existingIndex !== -1) {
    allResults[existingIndex] = { demoName, result };
  } else {
    if (allResults.length >= MAX_ENTRIES) {
      allResults.shift(); // Ensure we do not exceed the max entries
    }
    allResults.push({ demoName, result });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allResults));
};

export const fetchAnalysisResults = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const clearAnalysisResults = () => {
  localStorage.removeItem(STORAGE_KEY);
};
