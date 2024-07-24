importScripts('wasm_exec.js');  // Assuming wasm_exec.js is also in the public directory
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.11/pako.min.js');

const go = new Go();

fetch("main.wasm.gz").then((response) => {
  if (!response.ok) {
    throw new Error(`Failed to fetch WASM: ${response.statusText}`);
  }
  return response.arrayBuffer();
}).then((compressedBytes) => {
  // Decompress the gzipped content using a library like pako
  const decompressedBytes = pako.ungzip(new Uint8Array(compressedBytes)).buffer;
  return WebAssembly.instantiate(decompressedBytes, go.importObject);
}).then((result) => {
  go.run(result.instance);
  postMessage("WebAssembly instantiated");
}).catch((err) => {
  postMessage("Failed to load WASM: " + err);
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
