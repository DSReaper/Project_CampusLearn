document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetForm");
  const email = document.getElementById("email");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const successMsg = document.getElementById("resetSuccess");
  const errorMsg = document.getElementById("resetError");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    successMsg.style.display = "none";
    errorMsg.style.display = "none";

    if (newPassword.value !== confirmPassword.value) {
      errorMsg.textContent = "Passwords do not match.";
      errorMsg.style.display = "block";
      return;
    }

    try {
      const res = await fetch("/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.value.trim().toLowerCase(),
          newPassword: newPassword.value,
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        successMsg.style.display = "block";
        form.reset();
      } else {
        errorMsg.textContent = data.message || "Failed to reset password.";
        errorMsg.style.display = "block";
      }
    } catch (err) {
      console.error(err);
      errorMsg.textContent = "Server error. Please try again.";
      errorMsg.style.display = "block";
    }
  });
});
