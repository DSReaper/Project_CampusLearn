document.addEventListener("DOMContentLoaded", () => {
  const chatroomCards = document.querySelectorAll('.chatroom-card');

  chatroomCards.forEach(card => {
    card.addEventListener('click', () => {
      const chatroomId = card.dataset.id;
      console.log("Card clicked, chatroomId:", chatroomId);

      // Navigate to chatroom page
      window.location.href = `/chatroom/open/${chatroomId}`;
    });
  });
});
