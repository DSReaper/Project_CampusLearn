const OpenAI = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const client = new OpenAI({ apiKey });
const CHAT_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

async function askCampusLearn(messages) {
  if (!apiKey) return "Server missing OpenAI key.";
  const res = await client.responses.create({
    model: CHAT_MODEL,
    input: messages.map(m => ({ role: m.role, content: m.content })),
    temperature: 0.3,
  });
  return (res.output_text || "").trim();
}

module.exports = { askCampusLearn };
