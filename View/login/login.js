// View/login/login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const errorText = document.getElementById("loginError");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorText.style.display = "none";
    errorText.textContent = "";

    const emailVal = email.value.trim().toLowerCase();
    const passwordVal = password.value.trim();

    if (!emailVal || !passwordVal) {
      errorText.textContent = "Please enter both email and password.";
      errorText.style.display = "block";
      return;
    }

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Accept": "application/json" 
        },
        body: JSON.stringify({ email: emailVal, password: passwordVal }),
        credentials: "include" // ✅ IMPORTANT: This sends cookies/session
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        console.log("✅ Login successful, redirecting to:", data.redirect);
        
        // Redirect to the URL provided by the server
        window.location.href = data.redirect;
      } else {
        errorText.textContent = data.error || data.message || "Invalid email or password.";
        errorText.style.display = "block";
      }
    } catch (err) {
      console.error("Login error:", err);
      errorText.textContent = "Server error. Please try again later.";
      errorText.style.display = "block";
    }
  });

  // Password toggle
  const toggle = document.getElementById("togglePassword");
  if (toggle && password) {
    toggle.addEventListener("click", () => {
      password.type = password.type === "password" ? "text" : "password";
    });
  }
});