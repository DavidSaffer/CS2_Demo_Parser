import React, { useRef } from "react";
import styled from "styled-components";
import { FaFileUpload } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setFile, setUploadStatus } from "../features/file/fileSlice";
import { useFile } from "../context/fileContext";

const StyledContainer = styled.div`
  //padding: 20px;
  //background-color: ${(props) => props.theme.colors.secondary};
  //border-radius: 8px;
  //box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  //gap: 10px;
  width: fit-content;
  height: fit-content;
`;

const HiddenInput = styled.input`
  display: none;
`;

const StyledButton = styled.button`
  background-color: #418d43;
  color: ${(props) => props.theme.colors.text};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #45a049;
  }
  display: flex;
  flex-direction: row;
`;

const IconWrapper = styled.div`
  margin-right: 10px; /* Adjust the value as needed for the desired spacing */
  display: flex;
  align-items: center; /* Ensures icons are centered vertically */
`;

const FileUpload = () => {
  const { file, setFile } = useFile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <StyledContainer>
      <HiddenInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".dem"
      />
      <StyledButton onClick={handleButtonClick}>
        <IconWrapper>
          <FaFileUpload />
        </IconWrapper>
        Upload File
      </StyledButton>
      {file ? <p>{file.name}</p> : <p>No file selected</p>}
    </StyledContainer>
  );
};

export default FileUpload;
