// src/types/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      secondary: string;
      accent: string;
      text: string;
      hover: string;
      compliment: string;
    };
  }
}
