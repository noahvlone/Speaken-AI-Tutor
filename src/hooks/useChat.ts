
import { useCallback, useMemo, useRef, useState } from "react";
import { chatOpenRouter, OpenRouterMessage } from "../lib/openrouter";

export type ChatItem = { id: string; role: "user" | "assistant"; content: string };

const uid = () => Math.random().toString(36).slice(2);

export function useChat(opts?: {
  apiKey?: string;
  system?: string;
  model?: string;
  onError?: (err: any) => void;
}) {
  const { apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string, system, model, onError } = opts || {};
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const user: ChatItem = { id: uid(), role: "user", content: text };
    setMessages((m) => [...m, user]);
    setInput("");
    setIsLoading(true);

    const convo: OpenRouterMessage[] = [...messages, user].map(m => ({ role: m.role, content: m.content } as OpenRouterMessage));

    try {
      const client = await chatOpenRouter(apiKey, convo, {
        system,
        model: "moonshotai/kimi-k2:free",
        temperature: 0.6,
        stream: true,
      });

      // Streaming append
      const assistantId = uid();
      setMessages((m) => [...m, { id: assistantId, role: "assistant", content: "" }]);

      if ("stream" in client && client.stream) {
        let acc = "";
        for await (const token of client.stream()) {
          acc += token;
          setMessages((m) => m.map(x => x.id === assistantId ? { ...x, content: acc } : x));
        }
      } else if ("text" in client) {
        setMessages((m) => m.map(x => x.id === assistantId ? { ...x, content: client.text } : x));
      }
    } catch (err) {
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, system, model, messages, onError]);

  const clear = useCallback(() => setMessages([]), []);

  return { messages, input, setInput, send, clear, isLoading };
}
