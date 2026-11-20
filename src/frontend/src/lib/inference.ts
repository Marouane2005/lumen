export type InferenceCredentials = {
  baseUrl: string;
  apiKey: string;
  expiresAt: string;
};
export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * One streaming inference client per signed-in session. The key lives in
 * memory only and is re-minted when the gateway answers 401.
 */
export function createInferenceChat(
  getCredentials: () => Promise<InferenceCredentials>,
) {
  let current: Promise<InferenceCredentials> | null = null;
  const credentials = (renew: boolean) => {
    if (renew || !current) {
      current = getCredentials();
      current.catch(() => {
        current = null;
      });
    }
    return current;
  };

  return async function chat(
    messages: ChatMessage[],
    onDelta?: (text: string) => void,
  ): Promise<string> {
    for (let attempt = 0; ; attempt++) {
      const { baseUrl, apiKey } = await credentials(attempt > 0);
      const response = await fetch(
        `${baseUrl.replace(/\/+$/, "")}/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ model: "router", messages, stream: true }),
        },
      );
      if (response.status === 401 && attempt === 0) continue;
      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error?.message ?? `Inference failed: HTTP ${response.status}`,
        );
      }
      let text = "";
      let buffer = "";
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.startsWith("data:") ? line.slice(5).trim() : "";
          if (!data || data === "[DONE]") continue;
          const delta = JSON.parse(data).choices?.[0]?.delta?.content;
          if (delta) {
            text += delta;
            onDelta?.(delta);
          }
        }
      }
      if (!text) throw new Error("Inference returned no text");
      return text;
    }
  };
}
