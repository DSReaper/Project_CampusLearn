// Services/openaiClient.js
const OpenAI = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const { navigateToolDef, executeNavigate } = require("../Model/Navigation/navigationData/tools.navigate");

const apiKey = process.env.OPENAI_API_KEY;
const client = new OpenAI({ apiKey });

// Your existing model for plain chat
const CHAT_MODEL = process.env.OPENAI_MODEL || "gpt-4";
// A lighter / cheaper model is fine for tool-calling; override if you want
const TOOL_MODEL = process.env.OPENAI_TOOL_MODEL || "gpt-4";

/**
 * Plain conversational response (your original function, unchanged usage)
 */
async function askCampusLearn(messages) {
  if (!apiKey) return "Server missing OpenAI key.";
  const res = await client.responses.create({
    model: CHAT_MODEL,
    input: messages.map(m => ({ role: m.role, content: m.content })),
    temperature: 0.3,
  });
  return (res.output_text || "").trim();
}

/**
 * Function-calling path (navigation to allow-listed pages)
 * Returns:
 *   { reply, action?: { type: 'navigate', href: string } }
 */
async function askCampusLearnWithNavigation(messages) {
  if (!apiKey) return { reply: "Server missing OpenAI key." };

  // Try tool-calling via Chat Completions (needed for tools)
  const toolResponse = await client.chat.completions.create({
    model: TOOL_MODEL,
    messages,
    tools: [navigateToolDef],
    tool_choice: "auto",
  });

  const msg = toolResponse.choices?.[0]?.message;
  const toolCalls = msg?.tool_calls || [];

  // If the model requested navigation, resolve & return an action
  if (toolCalls.length > 0) {
    const call = toolCalls[0];
    if (call.function?.name === "navigate") {
      let args = {};
      try { args = JSON.parse(call.function.arguments || "{}"); } catch {}
      const result = await executeNavigate(args);

      if (result?.href) {
        return {
          reply: `Opening ${result.label}…`,
          action: { type: "navigate", href: result.href },
        };
      }
      return { reply: "Sorry, I can’t navigate there." };
    }
  }

  // If no tool call but the model gave text, return it
  const direct = (msg?.content || "").trim();
  if (direct) return { reply: direct };

  // Fallback to your existing Responses API
  const reply = await askCampusLearn(messages);
  return { reply };
}

module.exports = {
  askCampusLearn,
  askCampusLearnWithNavigation,
};
