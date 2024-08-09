# Eco Frags

## Libraries
- Styled Components
- Redux

## File Structure
```
src/
├── app/                     # Configuration and setup for Redux
│   ├── hooks.ts             # Custom React hooks, including Redux hooks for state management
│   └── store.ts             # Setup and configuration of the Redux store
│
├── components/              # Reusable UI components
│   ├── layout/              # Components for the top&side nav bars
│   └── StyledComponent.tsx  # Example of a styled component using styled-components
│
├── features/                # Modular features containing logic and UI components
│   └── theme/               # Theme management functionality
│       ├── ThemeSwitch.tsx  # Component to toggle between light and dark themes
│       └── themeSlice.ts    # Redux slice for managing theme-related state
│
├── theme/                   # Styling and theming configurations
│   ├── GlobalStyle.tsx      # Global styles defined using styled-components
│   └── styledTheme.ts       # Theme definitions for light and dark modes
│
└── types/                   # Custom TypeScript types and extensions
    └── styled.d.ts          # Extensions for styled-components' default theme to include custom properties
```