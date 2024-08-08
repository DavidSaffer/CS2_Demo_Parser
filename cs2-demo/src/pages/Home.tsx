// src/pages/Home.tsx
import React from "react";
import { useAppSelector } from "../app/hooks";

const Home: React.FC = () => {
  const currentPage = useAppSelector((state) => state.navigation.currentPage);

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the {currentPage} page!</p>
    </div>
  );
};

export default Home;
