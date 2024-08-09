// src/pages/Home.tsx
import React from "react";
import FileUploadComponent from "../components/FileUploadComponent";
import ProcessFileComponent from "../components/ProcessFileComponent";
import ProgressBar from "../components/DemoProgressBar";

const Individual: React.FC = () => {
  return (
    <div>
      <h1>Upload Individual</h1>
      <FileUploadComponent />
      <ProcessFileComponent />
      <ProgressBar height={"50px"} />
    </div>
  );
};

export default Individual;
