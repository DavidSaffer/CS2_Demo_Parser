import React from "react";
import styled from "styled-components";
import { useWorker } from "../context/demoWorkerContext";
import { useFile } from "../context/fileContext";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  height: fit-content;
`;

const IconWrapper = styled.div`
  margin-right: 10px; /* Adjust the value as needed for the desired spacing */
  display: flex;
  align-items: center; /* Ensures icons are centered vertically */
`;

const StyledButton = styled.button`
  padding: 10px;
`;

const ProcessFileComponent = () => {
  const { file } = useFile();
  const { postMessage } = useWorker();

  const startButtonClick = () => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      postMessage({ data: uint8Array });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <StyledContainer>
      <StyledButton onClick={startButtonClick}>Start</StyledButton>
    </StyledContainer>
  );
};

export default ProcessFileComponent;
