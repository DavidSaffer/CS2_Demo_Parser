const worker = new Worker("worker.js");

document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    appendMessage("No file selected.");
    return;
  }

  const attackerThreshold = parseInt(
    document.getElementById("attackerThreshold").value,
    10
  );
  const victimThreshold = parseInt(
    document.getElementById("victimThreshold").value,
    10
  );

  const reader = new FileReader();
  reader.onload = function () {
    const arrayBuffer = reader.result;
    const uint8Array = new Uint8Array(arrayBuffer);
    worker.postMessage({
      data: uint8Array,
      attackerThreshold: attackerThreshold,
      victimThreshold: victimThreshold,
    });
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
