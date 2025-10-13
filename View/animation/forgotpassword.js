document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('forgotForm');
  const success = document.getElementById('forgotSuccess');
  const card = document.querySelector('.card');

  if (!form || !card) return;

  // Animate the card fading in on page load
  card.style.opacity = 0;
  card.style.transform = 'translateY(40px)';
  requestAnimationFrame(() => {
    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    card.style.opacity = 1;
    card.style.transform = 'translateY(0)';
  });

  // When form is submitted — fade out, show success message, pulse background
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Create a gentle pulse animation
    card.animate(
      [
        { boxShadow: '0 0 0px rgba(255, 0, 51, 0.0)' },
        { boxShadow: '0 0 20px rgba(255, 0, 51, 0.5)' },
        { boxShadow: '0 0 0px rgba(255, 0, 51, 0.0)' }
      ],
      { duration: 1000, iterations: 3 }
    );

    // Show confirmation text with a fade effect
    if (success) {
      success.style.display = 'block';
      success.style.opacity = 0;
      success.style.transition = 'opacity 1s ease';
      setTimeout(() => (success.style.opacity = 1), 50);
    }

    // Optional: reset the form after animation
    form.reset();
  });

  // Bonus: slight glow when focusing on the email input
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('focus', () => {
      emailInput.animate(
        [
          { boxShadow: '0 0 0px rgba(255, 0, 51, 0.0)' },
          { boxShadow: '0 0 12px rgba(255, 0, 51, 0.5)' }
        ],
        { duration: 400, fill: 'forwards' }
      );
    });
  }
});
