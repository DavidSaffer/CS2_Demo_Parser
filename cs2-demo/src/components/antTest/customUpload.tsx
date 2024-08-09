import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import styled from "styled-components";

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: false,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  accept: ".dem",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

// -__- i have no idea whats going on here, but it seems to work
const CustomDragger = styled(Dragger)`
  .ant-upload-drag {
    border: 2px dashed #000000; // Default border color
    &:hover {
      border: 2px dashed #ffffff; // Border color on hover
    }
  }
  .ant-upload {
    &:hover {
      border: 2px dashed #ffffff; // Border color on hover
    }
  }
`;

const UploadMessage = styled.p`
  color: ${(props) => props.theme.colors.text};
`;

const App: React.FC = () => (
  <CustomDragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <UploadMessage>Click or drag file to this area to upload</UploadMessage>
  </CustomDragger>
);

export default App;
