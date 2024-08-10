// src/pages/Home.tsx
import React from "react";
import FileUploadComponent from "../components/FileUploadComponent";
import ProcessFileComponent from "../components/ProcessFileComponent";
import ProgressBar from "../components/DemoProgressBar";
import SortableTable from "../components/SortableTable";

const Individual: React.FC = () => {
  return (
    <div>
      <h1>Upload Individual</h1>
      <FileUploadComponent />
      <ProcessFileComponent />
      <ProgressBar height={"20px"} />
      <SortableTable team={2} />
      <SortableTable team={1} />
    </div>
  );
};

export default Individual;
