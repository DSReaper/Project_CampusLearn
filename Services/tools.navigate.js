const { resolveTarget } = require("./navigation");

const navigateToolDef = {
  type: "function",
  function: {
    name: "navigate",
    description:
      "Route the user to a specific page in the CampusLearn app when they ask to go/open/navigate.",
    parameters: {
      type: "object",
      properties: {
        target: {
          type: "string",
          description:
            "One of: student_dashboard, settings. Pick the best match based on the user's words."
        }
      },
      required: ["target"],
      additionalProperties: false
    }
  }
};

async function executeNavigate(args) {
  const page = resolveTarget(args?.target);
  if (!page) return { error: "Unknown or disallowed target", target: args?.target || null };
  return { href: page.href, label: page.label };
}

module.exports = { navigateToolDef, executeNavigate };
