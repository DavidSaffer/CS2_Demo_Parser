// src/pages/Home.tsx
import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../app/hooks";
import FileUploadComponent from "../components/FileUploadComponent";
import ProcessFileComponent from "../components/ProcessFileComponent";
import ProgressBar from "../components/DemoProgressBar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.table.headerColor};
  padding: 30px;
  border-radius: 10px;
`;

const Home: React.FC = () => {
  const currentPage = useAppSelector((state) => state.navigation.currentPage);

  return (
    <>
      <h1>Home Page</h1>
      <p>Welcome to the {currentPage} page!</p>
      <Container>
        <Card>
          <p>Start Upload</p>
          <FileUploadComponent />
          <ProcessFileComponent />
          <ProgressBar height={"20px"} />
        </Card>
      </Container>
    </>
  );
};

export default Home;
