const worker = new Worker("worker.js");

document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    const arrayBuffer = reader.result;
    const uint8Array = new Uint8Array(arrayBuffer);
    worker.postMessage(uint8Array, [uint8Array.buffer]);
  };
  reader.readAsArrayBuffer(file);
});

worker.onmessage = function (event) {
  appendMessage("Processed data received: " + event.data);
};

function appendMessage(message) {
  const container = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  container.appendChild(messageElement);
}
