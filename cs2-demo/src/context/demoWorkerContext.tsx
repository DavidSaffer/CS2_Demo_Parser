/**
 * This file defines the DemoWorkerContext and provides a React context for managing
 * a web worker that handles background demo-file processing
 *
 * Components use the `useWorker` hook to interact with the web worker, enabling them to send data for processing
 * Components listen to Redux - which this worker updates
 *
 * Key Features:
 * - `postMessage`: Allows sending messages to the worker.
 *
 * Usage:
 * Place the `DemoWorkerProvider` at a high level in your app component tree so that any child component can access the worker via `useWorker`.
 */
import React, { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  setProgress,
  setFinalData,
  setError,
} from "../features/demoParse/demoParseSlice";

// Define the shape of our context
interface DemoWorkerContextType {
  postMessage: (message: any) => void;
}

/**
 * Initializes a new React context for the web worker
 * This gets used as useContext(DemoWorkerContext) inside the useWorker hook
 */
const DemoWorkerContext = createContext<DemoWorkerContextType | null>(null);

/**
 * 1 - Initializes the web worker
 * 2 - Sets up message handler to listen for messages from the worker
 * 3 - Handle cleanup to prevent memory leaks and follow best pratice
 * 4 - provides a method to send messages to the worker
 * 5 - Returns JSX wrapper
 */
export const DemoWorkerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const workerRef = useRef<Worker | null>(null);
  const dispatch = useDispatch();

  //1 - Initializes the web worker
  useEffect(() => {
    workerRef.current = new Worker(`${process.env.PUBLIC_URL}/demoWorker.js`);

    // 2 - Sets up message handler to listen for messages from the worker
    workerRef.current.onmessage = (event) => {
      const message = event.data;
      console.log(message);
      // 2.1 Handle Progress updates
      if (message.startsWith("Progress:")) {
        const progressValue = parseFloat(message.split(":")[1]);
        dispatch(setProgress(progressValue));
      }
      // 2.2 Handle Json Messages
      else if (message.startsWith("{")) {
        try {
          const json = JSON.parse(message);
          switch (json.type) {
            case "PlayerStats":
              dispatch(setFinalData(json.data));
              break;
            default:
              console.log("error");
          }
        } catch (err) {
          console.error("Failed to parse JSON message:", message, err);
          dispatch(setError("Failed to parse JSON message:" + message + err));
        }
      }
      // 2.3 Handle 'unhandled' messages
      else {
        console.error(
          "Message Type Not Handled - src/context/demoWorkerContext.tsx LINE76"
        );
      }
    };

    // 3 - Handle cleanup to prevent memory leaks and follow best pratice
    return () => {
      workerRef.current?.terminate();
    };
  }, [dispatch]);

  // 4 - provides a method to send messages to the worker
  const postMessage = (message: any) => {
    workerRef.current?.postMessage(message);
  };

  // 5 - Return JSX provider
  return (
    <DemoWorkerContext.Provider value={{ postMessage }}>
      {children}
    </DemoWorkerContext.Provider>
  );
};

/**
 * Hook that allows components to access the context
 *
 * Usage:
 *
 * ```const { postMessage } = useWorker();```
 *
 *
 * @throws {Error} If used outside of the DemoWorkerProvider.
 */
export const useWorker = (): DemoWorkerContextType => {
  const context = useContext(DemoWorkerContext);
  if (!context) {
    throw new Error("useWorker must be used within a WorkerProvider");
  }
  return context;
};
