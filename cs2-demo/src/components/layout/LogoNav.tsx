import React from "react";
import styled from "styled-components";

const Logo = styled.div`
  grid-area: logo;
  background-color: ${(props) =>
    props.theme.colors.secondary}; // Matching the theme
  display: flex;
  align-items: center; // Center the logo vertically within the area
  justify-content: center; // Center the logo horizontally
  border-right: 2px solid ${(props) => props.theme.colors.accent};
  border-bottom: 2px solid ${(props) => props.theme.colors.accent};
`;

const LogoComponent: React.FC = () => {
  return (
    <Logo>
      <p>Eco Frags</p>
    </Logo>
  );
};

export default LogoComponent;
