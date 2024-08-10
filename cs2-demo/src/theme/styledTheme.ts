// src/theme/styledTheme.ts
import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  colors: {
    background: '#005c3c',
    secondary: '#337660',
    accent: '#4B4B4B',
    text: '#000000',
    hover: '#69AF90',
    compliment: '#C37597',
  },
  progressBar: {
    background: '#3C473C',
    value: '#c7ffc3',
  },
  table: {
    headerColor: "",
    cellColor: ""
  }
};

export const darkTheme: DefaultTheme = {
  colors: {
    background: '#081C15',
    secondary: '#1e251e',
    accent: '#828282',
    text: '#ffffff',
    hover: '#2F443B',
    compliment: '#301923',
  },
  progressBar: {
    background: '#c7ffc3',
    value: '#234d20',
  },
  table: {
    headerColor: "#193026",
    cellColor: ""
  }
};
