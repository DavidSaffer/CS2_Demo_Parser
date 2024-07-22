importScripts("wasm_exec.js");

const go = new Go();

WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject)
  .then((result) => {
    postMessage("WebAssembly instantiated");
    go.run(result.instance);
  })
  .catch((err) => {
    postMessage("Failed to load WASM: " + err);
  });

onmessage = function (event) {
  const data = event.data;
  postMessage("Data received in worker");
  analyzeDemo(data); // This function is exposed by your Go code
};
