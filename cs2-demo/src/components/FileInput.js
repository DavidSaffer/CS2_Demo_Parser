import React, { useState, useRef, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import styles from "./FileInput.module.css";
import PlayerStatsTable from "./player-stats/PlayerStatsTable";
import 'bootstrap/dist/css/bootstrap.min.css';

function FileInput() {
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null); // Holds the selected file
  const [progress, setProgress] = useState(0);
  const [isLoading, setLoading] = useState(false); // Manage loading state for the button
  const [playerStats, setPlayerStats] = useState({});
  const workerRef = useRef(null);
  const messagesEndRef = useRef(null);

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
    setFile(event.target.files[0]); // Just store the file
    setMessages([]); // Clear messages upon new file selection
    setProgress(0); // Reset progress
  };

  const handleProcessFile = () => {
    setPlayerStats({});
    if (!file) {
      appendMessage("No file selected.");
      return;
    }
    setLoading(true); // Start loading
    const attackerThreshold = parseInt(
      document.getElementById("attackerThreshold").value,
      10
    );
    const victimThreshold = parseInt(
      document.getElementById("victimThreshold").value,
      10
    );

    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      workerRef.current.postMessage({
        data: uint8Array,
        attackerThreshold: attackerThreshold,
        victimThreshold: victimThreshold,
      });
    };
    reader.readAsArrayBuffer(file);
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

  return (
    <>
      <div className={styles.container}>
        <input
          type="file"
          className={styles.fileInput}
          onChange={handleFileChange}
          accept=".dem"
        />
        <div className={styles.thresholdsContainer}>
          <div>
            <label htmlFor="attackerThreshold" className={styles.label}>
              Attacker Threshold
            </label>
            <label htmlFor="attackerThreshold" className={styles.label}>
              (Equipment Value {">"})
            </label>
            <input
              type="number"
              id="attackerThreshold"
              defaultValue="2000"
              className={styles.inputNumber}
            />
          </div>
          <div>
            <label htmlFor="victimThreshold" className={styles.label}>
              Victim Threshold
            </label>
            <label htmlFor="victimThreshold" className={styles.label}>
              (Equipment Value {"<"})
            </label>
            <input
              type="number"
              id="victimThreshold"
              defaultValue="2000"
              className={styles.inputNumber}
            />
          </div>
        </div>
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
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.messageItem} ${getMessageStyle(msg)}`}
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
