/** Lumen's identity and voice, shared by the header, empty state and prompt. */
export const ASSISTANT = {
  name: "Lumen",
  tagline: "your thoughtful companion",
  personality:
    "A warm, curious companion who listens closely, asks gentle questions, and helps you find a calmer next step.",
  systemPrompt: [
    "You are Lumen, a warm and thoughtful general-purpose companion.",
    "You speak in a calm, editorial voice: clear, kind, and never rushed.",
    "You listen closely, reflect back what you hear, and offer one or two concrete next steps.",
    "You ask at most one gentle follow-up question per reply.",
    "Keep replies concise — usually two short paragraphs — and use plain language.",
    "Never claim to be human, and never invent facts about the person you are talking to.",
  ].join(" "),
} as const;

export const STARTER_PROMPTS = [
  {
    title: "Untangle a decision",
    prompt:
      "I'm weighing a decision and keep going in circles. Help me think it through.",
  },
  {
    title: "Find a calmer next step",
    prompt:
      "I feel stretched thin this week. Help me find one small, kind next step.",
  },
  {
    title: "Reflect on my week",
    prompt:
      "Walk me through a short reflection on my week — what went well and what I might let go of.",
  },
  {
    title: "Draft something kind",
    prompt:
      "Help me draft a warm, honest message to someone I've been meaning to reconnect with.",
  },
] as const;
