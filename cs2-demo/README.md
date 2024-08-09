# Eco Frags

## Libraries
- Styled Components
- Redux

## Design
### Contexts
<details>
    <summary><span>DemoWorker Context</span></summary>
<p>

**Purpose**:  Handles interactions with a web worker, which performs tasks in a background thread to prevent blocking the main UI thread

**Key Functionality**:
- ```postMessage(data: ArrayBuffer)```: Sends binary data to the worker for processing
  
</p>
</details>

<details>
    <summary><span>File Context</span></summary>
<p>

**Purpose**: Track a file that the user uploads and make it accessabel to any component

**Key Functionality**:
- ```file```: Holds the current file object
- ```setFile(file: File | null)```: Updates the file state, allowing new files to be set or the current file to be cleared
  
</p>
</details>

### Redux Store

<details>
  <summary><strong>Redux Slices</strong></summary>
  <p>

**DemoParse Slice**

- Purpose: Manages the state related to parsing data returned from the web worker.
- 
Actions:
- ```setProgress(progress: number)```: Updates the parsing progress.
- ```setFinalData(data: any)```: Stores the final parsed data.
- ```setError(error: string)```: Records any errors that occur during parsing.

**Navigation Slice**: Manages navigation-related state, such as the current active page

**Theme Slice**: Stores UI theming preferences and allows dynamic theme switching

</p>
</details>

