// src/theme/styledTheme.ts
import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  colors: {
    background: '#4C8C76',
    secondary: '#669D8A',
    accent: '#4B4B4B',
    text: '#000000',
    hover: '#69AF90',
    compliment: '#C37597',
  },
  table: {
    header: '#f0f0f0',
    body: '#324F46',
    divider: '#e0e0e0',
    text: '#333',
    hover: '#e8f5e9',
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    background: '#081C15',
    secondary: '#193026',
    accent: '#828282',
    text: '#ffffff',
    hover: '#2F443B',
    compliment: '#301923'
  },
  table: {
    header: '#1c3c32',
    body: '#324F46',
    divider: '#2c5242',
    text: '#ffffff',
    hover: '#2a3f3b',
  }
};
