importScripts("wasm_exec.js"); // Assuming wasm_exec.js is also in the public directory
importScripts("https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.11/pako.min.js");

self.addEventListener('message', (event) => {
  const { data } = event;
  try {
    const decompressed = pako.inflate(data, { to: 'string' });
    postMessage({ success: true, data: decompressed });
  } catch (error) {
    postMessage({ success: false, error: error.message });
  }
});
