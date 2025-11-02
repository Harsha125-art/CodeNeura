// script.js

const inputBox = document.querySelector(".chat-input input");
const sendBtn = document.querySelector(".chat-input button");
const chatContainer = document.querySelector(".chat-container");

// Function to add a message to chat
function addMessage(message, sender = "bot") {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
  msgDiv.classList.add("p-4", "rounded-xl", "shadow", "max-w-xs");
  if (sender === "user") msgDiv.classList.add("bg-indigo-100", "text-indigo-900");
  else msgDiv.classList.add("bg-white", "text-indigo-800");
  msgDiv.textContent = message;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight; // auto-scroll
}

// Function to send input to backend
async function sendMessage() {
  const text = inputBox.value.trim();
  if (!text) return;

  // Show user message
  addMessage(text, "user");
  inputBox.value = "";

  // Show placeholder bot message
  const placeholder = addMessage("Analyzing...", "bot");

  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    // Remove placeholder
    chatContainer.lastChild.remove();

    // Show actual bot response
    const reply = `Score: ${data.score}\nCategory: ${data.category}\nKeywords: ${data.keywords.join(", ")}`;
    addMessage(reply, "bot");

  } catch (error) {
    chatContainer.lastChild.remove();
    addMessage("Error: Could not reach server.", "bot");
    console.error(error);
  }
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
inputBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
