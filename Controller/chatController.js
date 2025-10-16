// Controller/chatController.js
const {
  askCampusLearnWithNavigation,
} = require("../Services/openaiClient");

const SYSTEM_PROMPT = `
You are CampusLearn Chatbot for IT students.
Give step-by-step, practical answers. Provide small runnable code snippets when relevant.
Also help politely with non-technical academic questions.

If the user asks to go/open/navigate to a page, call the "navigate" tool with one of:
- "student_dashboard"  → Student Dashboard
- "settings"           → Profile & Settings
Do not invent other targets.
`;

function renderChat(req, res) {
  res.render("chat", { title: "CampusLearn Chatbot" });
}

async function chatAPI(req, res) {
  try {
    const { message, history = [] } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing message" });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-8),
      { role: "user", content: message },
    ];

    // Use the function-calling path in the client
    const result = await askCampusLearnWithNavigation(messages);

    // If navigation action present, send it so the frontend redirects
    if (result.action?.type === "navigate" && result.action.href) {
      return res.json({ reply: result.reply, action: result.action });
    }

    // Otherwise just return the text reply
    return res.json({ reply: result.reply || "No response." });

  } catch (err) {
    console.error("chatAPI error:", err);
    res.status(500).json({ error: "Chat failed." });
  }
}

module.exports = { renderChat, chatAPI };
