## Project Structure
```
.
├── README.MD
├── build-opt-wasm.sh     # Add wasm-opt (optimization)
├── build-wasm.sh         # Compile, Compress, Move to Front-End
├── go.mod                # Go module definitions
├── go.sum                # Go module checksums
│
├── src                
│   ├── analysis.go       # Core demofile analysis
│   ├── main.go           # Main application entry point
│   └── utils.go          # Json & Progress Reader Utilities
└── static
    ├── main.wasm         # Compiled main wasm file
    └── main_opt.wasm     # Optimized wasm file
```
## File Information

<details>
    <summary><span style="font-size: 1.5em; font-weight: bold;">main.go</span><span style="font-size: 1em; font-weight: normal;"> - Entry Point</span></summary>
<p>

**Purpose**: Initializes the WebAssembly environment and sets up JavaScript bindings.

**Key Functionality**:
- `main()`: Maintains the Go runtime, allowing integration with JavaScript through the `analyzeDemo` callable function, which activates the demo analysis process.

</p>
</details>

<details>
<summary><span style="font-size: 1.5em; font-weight: bold;">utils.go</span><span style="font-size: 1em; font-weight: normal;"> - Utility Functions</span></summary>
<p>

**Purpose**: Provides utility functions for data serialization and progress tracking during demo analysis.

**Core Functions**:
- `sendProgressUpdate(message string)`: Updates JavaScript environment about the progress.
- `sendError(errorMessage string)`: Communicates errors in JSON format.
- `sendFinalStats(playerStats map[string]*PlayerStats, roundNum int)`: Sends serialized final statistics to JavaScript.

**Components**:
- `ProgressReader`: Custom reader that enhances data processing with progress feedback.

</p>
</details>

<details>
<summary><span style="font-size: 1.5em; font-weight: bold;">analysis.go</span><span style="font-size: 1em; font-weight: normal;"> - Core Analysis</span></summary>
<p>

**Purpose**: Manages the parsing and analytical processing of demo files.

**Functions Overview**:
- `RegisterEventHandlers(...)`: Sets up listeners for demo-related events.
- `HandleRoundEnd(...)`, `HandleKillEvent(...)`: Update state and player statistics based on game events.
- `getPrimaryWeapon(...)`, `getKillerWeaponInfo(...)`, `getVictimWeaponInfo(...)`: Analyze and classify player equipment.

</p>
</details>