document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: (email.value || "").trim().toLowerCase(),
        password: String(password.value || ""),
      }),
    });

    // Expecting: { role, message } from your controller
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.message === "login") {
      // route by role (student/tutor)
      const target =
        data.role === "tutor" ? "/profile/settings" : "/student/dashboard";
      window.location.assign(target); // <-- redirect here
      return;
    }

    // show error when not logged in
    alert(data.error || data.message || `Login failed (${res.status})`);
  });
});
