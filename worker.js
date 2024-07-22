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
  const data = event.data.data;
  const attackerThreshold = event.data.attackerThreshold;
  const victimThreshold = event.data.victimThreshold;
  postMessage("Data received in worker");

  if (typeof analyzeDemo === "function") {
    analyzeDemo(data, attackerThreshold, victimThreshold);
  } else {
    postMessage("analyzeDemo function is not defined.");
  }
};
