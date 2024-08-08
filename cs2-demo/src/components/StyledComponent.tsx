// src/components/StyledComponent.tsx
import styled from 'styled-components';

// Styled container that uses colors from the theme
const StyledContainer = styled.div`
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  padding: 20px;
  border: 2px solid ${props => props.theme.colors.accent};
  border-radius: 8px;
  margin: 20px;
  text-align: center;
`;

const StyledComponent: React.FC = () => {
  return (
    <StyledContainer>
      This is a styled component that adapts to the theme!
    </StyledContainer>
  );
};

export default StyledComponent;
