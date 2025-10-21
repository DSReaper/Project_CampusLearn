document.addEventListener('DOMContentLoaded', () => {
  const joinPopup = document.getElementById("joinChatPopup");
  const joinChatLink = document.getElementById("joinChatLink");
  const closeJoinBtn = document.getElementById("closePopupBtn");
  const resultsList = document.getElementById("chatroomResults");
  const joinBtn = document.getElementById("joinChatBtn");
  const searchInput = document.getElementById("chatroomSearch");

  let selectedChatroomId = null;

  // Open popup
  if (joinChatLink) {
    joinChatLink.addEventListener("click", e => {
      e.preventDefault();
      joinPopup.style.display = "flex";
      searchInput.value = "";
      loadPopupChatrooms(); // fill the select with all chatrooms initially
    });
  }

  // Close popup
  if (closeJoinBtn) {
    closeJoinBtn.addEventListener("click", () => {
      joinPopup.style.display = "none";
      searchInput.value = "";
      resultsList.innerHTML = "";
      selectedChatroomId = null;
    });
  }

  // Selecting chatroom in popup
  resultsList.addEventListener("change", () => {
    selectedChatroomId = resultsList.value;
  });

  // Join chatroom
  joinBtn.addEventListener("click", async () => {
    if (!selectedChatroomId) {
      alert("Please select a chatroom first!");
      return;
    }

    try {
      const res = await fetch(`/chatroom/${selectedChatroomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();

      if (data.success) {
        alert("Joined chatroom successfully!");
        joinPopup.style.display = "none";
        searchInput.value = "";
        resultsList.innerHTML = "";
        selectedChatroomId = null;
      } else {
        alert(data.message || "Failed to join chatroom.");
      }
    } catch (err) {
      console.error("Error joining chatroom:", err);
    }
  });

  // Search chatrooms in popup
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    try {
      const res = await fetch(`/chatroom/search?q=${encodeURIComponent(query)}`);
      const chatrooms = await res.json();
      renderPopupList(chatrooms);
    } catch (err) {
      console.error("Error searching chatrooms:", err);
    }
  });

  // Fill popup <select> with chatrooms
  async function loadPopupChatrooms() {
    try {
      const res = await fetch("/chatroom");
      const chatrooms = await res.json();
      renderPopupList(chatrooms);
    } catch (err) {
      console.error("Error loading chatrooms for popup:", err);
    }
  }

  function renderPopupList(chatrooms) {
    resultsList.innerHTML = "";
    if (!chatrooms || chatrooms.length === 0) {
      const option = document.createElement("option");
      option.textContent = "No chatrooms found.";
      option.disabled = true;
      resultsList.appendChild(option);
      return;
    }

    chatrooms.forEach(chatroom => {
      const option = document.createElement("option");
      option.value = chatroom._id; // make sure _id matches your DB
      option.textContent = chatroom.name;
      resultsList.appendChild(option);
    });
  }
});
