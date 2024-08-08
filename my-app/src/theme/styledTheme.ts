// src/theme/styledTheme.ts
import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  colors: {
    background: '#BAFFDF',
    secondary: '#75C3A1',
    accent: '#4B4B4B', // Dark Grey as a softer option compared to black
    text: '#000000',
    hover: '#69AF90',
    compliment: '#C37597',
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    background: '#081C15',
    secondary: '#193026',
    accent: '#828282', // Light Grey for visibility without harsh contrast
    text: '#ffffff',
    hover: '#2F443B',
    compliment: '#301923'
  },
};
