import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../app/hooks"; // Adjust the path as necessary

const TopNavContainer = styled.div`
  grid-area: topnav;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid ${(props) => props.theme.colors.accent};
`;

const PageTitle = styled.div`
  flex-grow: 1;
  text-align: center;
`;

const TopNav: React.FC = () => {
  const currentPage = useAppSelector((state) => state.navigation.currentPage); // Assuming navigation state has currentPage

  return (
    <TopNavContainer>
      <PageTitle>
        <h2>{currentPage}</h2>
      </PageTitle>
    </TopNavContainer>
  );
};

export default TopNav;
