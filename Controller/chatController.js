const { askCampusLearn } = require("../Services/openaiClient");

const SYSTEM_PROMPT = `
You are CampusLearn Chatbot for IT students.
Give step-by-step, practical answers. Provide small runnable code snippets when relevant.
Also help politely with non-technical academic questions.
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
    const trimmed = history.slice(-8);
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...trimmed,
      { role: "user", content: message },
    ];
    const reply = await askCampusLearn(messages);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed." });
  }
}

module.exports = { renderChat, chatAPI };
