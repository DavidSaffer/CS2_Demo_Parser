// src/pages/Home.tsx
import React from "react";
import { useAppSelector } from "../app/hooks";
import AntdStyledComponents from "../components/antTest/customAntComponent";
import Breadcrumbs from "../components/antTest/customBreadcrumbs";

const Home: React.FC = () => {
  const currentPage = useAppSelector((state) => state.navigation.currentPage);

  return (
    <div>
      <Breadcrumbs />
      <h1>Home Page</h1>
      <p>Welcome to the {currentPage} page!</p>
      <AntdStyledComponents />
    </div>
  );
};

export default Home;
