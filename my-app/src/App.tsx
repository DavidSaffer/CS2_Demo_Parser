// src/App.tsx
import React from "react";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import { useAppSelector } from "./app/hooks";
import { darkTheme, lightTheme } from "./theme/styledTheme";
import GlobalStyle from "./theme/GlobalStyle";
import TopNav from "./components/layout/TopNav";
import SideNav from "./components/layout/SideNav";
import Logo from "./components/layout/LogoNav";
import Home from "./pages/Home";
import Individual from "./pages/Individual";
import Batch from "./pages/Batch";
import Help from "./pages/Help";
import Settings from "./pages/Settings";

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr; // Sidebar takes 200px, main content takes the rest
  grid-template-rows: 60px auto; // TopNav is 60px high, main content takes the remaining space
  grid-template-areas: "logo topnav" // Logo in the left corner, TopNav for the rest of the top row
    "sidenav content"; // SideNav and main content in separate columns
  height: 100vh; // Ensure the container fills the viewport height
`;

// Define a styled main content container
const MainContent = styled.main`
  grid-area: content;
  padding: 20px;
`;

const App: React.FC = () => {
  const themeMode = useAppSelector((state) => state.theme.mode);
  const currentPage = useAppSelector((state) => state.navigation.currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case "Home":
        return <Home />;
      case "Individual":
        return <Individual />;
      case "Batch":
        return <Batch />;
      case "Help":
        return <Help />;
      case "Settings":
        return <Settings />;
      // Add more cases as needed for other pages
      default:
        return (
          <>
            <h1>Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
          </>
        );
    }
  };

  return (
    <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
      <GlobalStyle />
      <LayoutContainer>
        <TopNav />
        <Logo />
        <SideNav />
        <MainContent>{renderPage()}</MainContent>
      </LayoutContainer>
    </ThemeProvider>
  );
};

export default App;
