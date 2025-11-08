
/**
 * OpenRouter client (fetch-based)
 * NOTE: For production, DO NOT expose your API key in the browser.
 * Use the /server/proxy.ts provided to proxy requests.
 */
export type OpenRouterChatOptions = {
  model?: string;
  temperature?: number;
  system?: string;
  max_tokens?: number;
  stream?: boolean;
  extraHeaders?: Record<string, string>;
};

export type OpenRouterMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function chatOpenRouter(
  apiKey: string,
  messages: OpenRouterMessage[],
  opts: OpenRouterChatOptions = {}
) {
  const {
    model = "moonshotai/kimi-k2:free", // lets OpenRouter route to a good default
    temperature = 0.7,
    system,
    max_tokens,
    stream = true,
    extraHeaders = {},
  } = opts;

  const payload: any = {
    model,
    messages: [...(system ? [{ role: "system", content: system } as OpenRouterMessage] : []), ...messages],
    temperature,
    stream,
  };
  if (max_tokens) payload.max_tokens = max_tokens;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
    // The Referer/Header below helps with rate limits for browser calls.
    // Replace with your domain when deployed.
    "HTTP-Referer": (typeof window !== "undefined" ? window.location.origin : "http://localhost:5173"),
    "X-Title": "Minimalist UI Components - AI Tutor",
    ...extraHeaders,
  };

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  // Streaming response
  if (stream && res.body) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    return {
      async *stream() {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const jsonStr = trimmed.replace(/^data:\s*/, "");
            if (jsonStr === "[DONE]") return;
            try {
              const obj = JSON.parse(jsonStr);
              const token = obj.choices?.[0]?.delta?.content ?? "";
              if (token) yield token as string;
            } catch { /* ignore parse errors for keep-alives */ }
          }
        }
      }
    };
  } else {
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content ?? "";
    return { text: content };
  }
}
