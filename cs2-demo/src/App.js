import React, { useState } from 'react';
import FileInput from './components/FileInput';
import './App.css'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define light theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

// Define dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
//    ../wasm/./build-wasm.sh 

function App() {

  const [theme, setTheme] = useState('dark');  // Default theme set to 'dark'

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    document.documentElement.classList.toggle('light-theme')
  };
  // Determine which theme to use
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline enableColorScheme />
      <div className="App">
        <button onClick={toggleTheme}>Theme</button>
        <FileInput />
      </div>
    </ThemeProvider>
  );
}

export default App;
