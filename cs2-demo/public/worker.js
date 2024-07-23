// This will remain mostly the same, but ensure paths to other assets like wasm_exec.js are correct
importScripts('wasm_exec.js');  // Assuming wasm_exec.js is also in the public directory

const go = new Go();

fetch("main.wasm").then((response) =>
  response.arrayBuffer()
).then((bytes) =>
  WebAssembly.instantiate(bytes, go.importObject)
).then((result) => {
  go.run(result.instance);
  postMessage("WebAssembly instantiated");
}).catch((err) => {
  postMessage("Failed to load WASM: " + err.message);
});

onmessage = function (event) {
  const { data, attackerThreshold, victimThreshold } = event.data;
  postMessage("Data received in worker");

  if (typeof analyzeDemo === "function") {
    analyzeDemo(data, attackerThreshold, victimThreshold);
  } else {
    postMessage("analyzeDemo function is not defined.");
  }
};
