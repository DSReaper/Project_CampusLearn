document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.querySelector("#sendBtn");
  const messageInput = document.querySelector("#messageInput");
  const chatroomWrap = document.querySelector("#chatroomWrap");
  const chatroomId = chatroomWrap.dataset.chatroomId;
  const userId = chatroomWrap.dataset.userId;
  const msgsContainer = document.querySelector("#msgs");

  async function sendMessage() {
    const body = messageInput.value.trim();
    if (!body) return;

    try {
      const res = await fetch(`/chatroom/${chatroomId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body })
      });

      const data = await res.json();
      console.log("Message sent:", data);

      if (data.success) {
        // 🟢 Create a new message bubble dynamically
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("msg", "user");

        const bubble = document.createElement("div");
        bubble.classList.add("bubble");
        bubble.textContent = body;

        msgDiv.appendChild(bubble);
        msgsContainer.appendChild(msgDiv);

        // Scroll to bottom
        msgsContainer.scrollTop = msgsContainer.scrollHeight;

        // Clear input
        messageInput.value = "";
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  sendBtn.addEventListener("click", sendMessage);

  // Optional: send message with Enter key
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
});
