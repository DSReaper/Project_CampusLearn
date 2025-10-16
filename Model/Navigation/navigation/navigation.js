// Only these pages are navigable via AI:
const ROUTES = {
  student_dashboard: { href: "/student/dashboard", label: "Student Dashboard" },
  settings:          { href: "/profile/settings",  label: "Profile & Settings" },
};

// Common phrases → keys above
const ALIASES = new Map([
  ["dashboard", "student_dashboard"],
  ["student dashboard", "student_dashboard"],
  ["my dashboard", "student_dashboard"],
  ["home dashboard", "student_dashboard"],

  ["settings", "settings"],
  ["profile", "settings"],
  ["account", "settings"],
  ["profile settings", "settings"],
  ["my profile", "settings"],
]);

function resolveTarget(raw = "") {
  const t = String(raw).trim().toLowerCase();
  const key = ROUTES[t] ? t : (ALIASES.get(t) || null);
  return key ? ROUTES[key] : null;
}

module.exports = { resolveTarget, ROUTES };
