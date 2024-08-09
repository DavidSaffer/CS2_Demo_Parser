import React, { createContext, useState, useContext, ReactNode } from "react";

interface FileContextType {
  file: File | null;
  setFile: (file: File | null) => void;
}

const FileContext = createContext<FileContextType | null>(null);

interface FileProviderProps {
  children: ReactNode; // Make sure to import ReactNode
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);
  const value = { file, setFile };

  // Ensure that a JSX element is always returned
  return (
    <FileContext.Provider value={value}> {children} </FileContext.Provider>
  );
};

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
};
