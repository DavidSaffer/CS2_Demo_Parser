import React, { useState, useRef, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import {
  saveAnalysisResult,
  fetchAnalysisResults,
} from "../utils/demoStorageUtil";

import PlayerStatsTable from "./player-stats/PlayerStatsTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTheme } from "@mui/material/styles";
import styles from "./FileInput.module.css";

function FileInput() {
  const [messages, setMessages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setLoading] = useState(false); // Manage loading state for the button
  const [playerStats, setPlayerStats] = useState({});
  const fileRef = useRef(null); // Use useRef here
  const workerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  useEffect(() => {
    workerRef.current = new Worker(`${process.env.PUBLIC_URL}/worker.js`);

    workerRef.current.onmessage = (event) => {
      const message = event.data;
      console.log(message);
      if (message.startsWith("Progress:")) {
        const progressValue = parseFloat(message.split(":")[1]);
        setProgress(progressValue);
      } else if (message.startsWith("{")) {
        // The message looks like a JSON string
        try {
          const json = JSON.parse(message);
          switch (json.type) {
            case "PlayerStats":
              setPlayerStats(json.data);
              // Assuming the JSON has been parsed and you need `file.name` hereafter
              if (fileRef.current) {
                // Access the current file from the ref
                saveAnalysisResult(fileRef.current.name, json.data);
              } else {
                console.error(
                  "File is null when trying to save the analysis result."
                );
              }
              setLoading(false); // Stop loading once the final message is received
              setProgress(0);
              break;
            case "Error":
              console.error("Error from worker:", json.data);
              break;
            default:
              console.log("Unhandled message type:", json.type);
          }
        } catch (error) {
          console.error("Failed to parse JSON message:", message, error);
        }
      } else {
        appendMessage(message);
      }
    };

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (event) => {
    fileRef.current = event.target.files[0]; // Set the file in the ref
    setMessages([]);
    setProgress(0);
  };

  const handleProcessFile = () => {
    setPlayerStats({});
    if (!fileRef.current) {
      appendMessage("No file selected.");
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      workerRef.current.postMessage({ data: uint8Array });
    };
    reader.readAsArrayBuffer(fileRef.current);
  };

  const appendMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const getMessageStyle = (message) => {
    if (message.startsWith("Eco Kill")) {
      return styles.messageEcoKill;
    } else if (message.startsWith("Light Buy Kill")) {
      return styles.messageLightBuyKill;
    }
    return ""; // Default style or leave as is if no prefix matches
  };

  const containerStyle = {
    backgroundColor: darkMode ? "" : "#f0f0f0", // Adjust colors as needed
  };

  const messageStyle = {
    background: darkMode ? "" : "#b8b6b6", // Adjust colors as needed
  };

  return (
    <>
      <div className={styles.container} style={containerStyle}>
        <input
          type="file"
          className={styles.fileInput}
          onChange={handleFileChange}
          accept=".dem"
        />
        <Button
          variant="primary"
          disabled={isLoading}
          onClick={!isLoading ? handleProcessFile : null}
        >
          {isLoading ? "Processing…" : "Start Processing"}
        </Button>
        <ProgressBar
          animated
          now={progress}
          label={`${progress.toFixed(0)}%`}
          className={styles.progressBar}
        />
        <div className={styles.messages} style={messageStyle}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.messageItem} ${getMessageStyle(msg)}`}
              style={messageStyle}
            >
              {msg}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Invisible element to scroll to */}
        </div>
        {Object.keys(playerStats).length > 0 && (
          <PlayerStatsTable playerStats={playerStats} />
        )}
      </div>
    </>
  );
}

export default FileInput;
