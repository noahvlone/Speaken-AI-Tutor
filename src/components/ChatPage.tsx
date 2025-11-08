import { Send, BookOpen } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GrammarHighlight, GrammarFeedback } from "./GrammarHighlight";
import { ChatMessage } from "./ChatMessage";
import { MarkdownMessage } from "./MarkdownMessage";
import { chatOpenRouter } from "../lib/openrouter";
import { supabase } from "../lib/supabaseClient";
import { useSupabaseChat } from "../hooks/useSupabaseChat";

type Sender = "user" | "ai";

interface GrammarError {
  start: number;
  end: number;
  message: string;
  suggestion: string;
  type: "grammar" | "spelling" | "style";
}

interface DisplayMessage {
  id: string;
  message: string;
  sender: Sender;
  timestamp: string;
  errors?: GrammarError[];
}

const nowStr = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

// --- local grammar highlighter for user bubbles
function analyzeGrammar(text: string): GrammarError[] {
  const errors: GrammarError[] = [];

  if (text.includes("dont")) {
    const i = text.indexOf("dont");
    errors.push({
      start: i,
      end: i + 4,
      message: "Missing apostrophe in contraction",
      suggestion: "don't",
      type: "grammar",
    });
  }
  const m1 = text.match(/\bi is\b/i);
  if (m1?.index !== undefined) {
    errors.push({
      start: m1.index,
      end: m1.index + m1[0].length,
      message: "Subject-verb agreement error",
      suggestion: "I am",
      type: "grammar",
    });
  }
  const m2 = text.match(/\bhe go\b|\bshe go\b/i);
  if (m2?.index !== undefined) {
    const subj = m2[0].split(" ")[0];
    errors.push({
      start: m2.index,
      end: m2.index + m2[0].length,
      message: "Missing verb conjugation",
      suggestion: `${subj} goes`,
      type: "grammar",
    });
  }
  if (text.match(/\bthere\b.*\bthere\b/i) && text.includes("their")) {
    const idx = text.lastIndexOf("there");
    if (text.includes("own") || text.includes("house")) {
      errors.push({
        start: idx,
        end: idx + 5,
        message: "Incorrect homophone usage",
        suggestion: "their",
        type: "spelling",
      });
    }
  }

  return errors;
}

export function ChatPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedError, setSelectedError] = useState<GrammarError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ===== Auth state =====
  useEffect(() => {
    supabase
      .auth
      .getUser()
      .then(({ data }) => setUserId(data.user?.id ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => {
      try {
        data.subscription.unsubscribe();
      } catch {
        /* noop */
      }
    };
  }, []);

  // ===== Supabase chat hook =====
  const {
    sessions,
    active,
    activeId,
    setActiveId,
    createSession,
    renameSession,
    deleteSession,
    messages, // DB messages
    appendMessage,
    updateMessage,
  } = useSupabaseChat(userId);

  // ===== Ensure session + seed welcome =====
  useEffect(() => {
    (async () => {
      if (!userId) return;
      if (!activeId) {
        const sid = await createSession("Welcome");
        if (!sid) return;
        await appendMessage(
          sid,
          "assistant",
          "Hello! I'm your AI English Tutor. Type your message and I’ll give grammar feedback and concise explanations."
        );
        setActiveId(sid);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, activeId]);

  // ===== Auto-scroll =====
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // ===== Map DB -> UI =====
  const displayMessages: DisplayMessage[] = useMemo(() => {
    return (messages ?? []).map((m) => ({
      id: m.id,
      message: m.content,
      sender: (m.role === "user" ? "user" : "ai") as Sender,
      timestamp: nowStr(),
      errors: m.role === "user" ? analyzeGrammar(m.content) : undefined,
    }));
  }, [messages]);

  // ===== OpenRouter streaming (persist ke Supabase) =====
  const sendToOpenRouter = useCallback(
    async (userText: string, aiMsgId: string, sessionId: string) => {
      const history = messages
        .concat([
          {
            id: "temp",
            session_id: sessionId,
            role: "user" as const,
            content: userText,
            created_at: new Date().toISOString(),
          },
        ])
        .map((m) => ({ role: m.role, content: m.content }));

      const apiKey = (import.meta as any).env?.VITE_OPENROUTER_API_KEY || "";

      const candidateModels = [
        "openai/gpt-oss-20b:free",
        "meta-llama/llama-3.1-8b-instruct:free",
        "nousresearch/hermes-3-llama-3.1-8b:free",
      ];

      const system =
        "Kamu adalah “Esther”, tutor Bahasa Inggris AI yang teliti, adaptif, dan suportif. Tugasmu: mengajarkan seluruh materi English (CEFR A1–C2)—grammar, vocabulary, pronunciation (IPA), reading, writing, listening, speaking, idioms/phrasal verbs/collocations, hingga academic & business English—serta mengoreksi tulisan/ucapan pengguna secara akurat dengan penjelasan singkat yang mudah dipahami. Jelaskan konsep utama dalam Bahasa Indonesia agar jelas, namun berikan contoh kalimat dan latihan dalam Bahasa Inggris (terjemahan hanya bila diminta atau frasa sukar). Jaga nada ringkas, ramah, dan to-the-point; ajarkan dengan scaffolding: inti konsep → aturan/pola singkat → 3 contoh → latihan kecil → umpan balik → ringkasan satu kalimat. Bersikap adaptif pada level (A1–C2), fokus (grammar/vocab/speaking/writing/listening/reading/exam-prep/business), topik (mis. job interview, research presentation), serta target ujian (IELTS/TOEFL/TOEIC/Cambridge). Jika pengguna mengirim teks, masuk ke mode Koreksi: ringkas kesalahan (grammar/spelling/style), berikan revisi yang disarankan (tulis ulang yang benar), jelaskan aturan inti secara singkat, beri 1–3 contoh tambahan, tambahkan 2–3 latihan cepat, dan jika relevan sertakan /IPA/ + tip artikulasi. Jika pengguna meminta materi/topik, masuk ke mode Pengajaran: paparkan definisi singkat dan kapan dipakai, bullet aturan inti (≤5), 3 contoh, kesalahan umum (2–3), 3 latihan cepat, lalu ringkasan satu baris. Untuk vocabulary, berikan 5–10 kata kunci dengan kolokasi dan contoh, bedakan sinonim yang mirip, tambahkan idiom yang relevan, dan latihan singkat. Untuk speaking/pronunciation, berikan prompt percakapan bertahap, model answer ringkas (≈B2), fokus 3 kata rawan dengan /IPA/ dan tip artikulasi, lalu minta pengguna mencoba ulang. Untuk exam-prep, jelaskan kriteria penilaian ringkas, berikan mini-task, model jawaban, dan feedback berbasis rubrik. Konsisten gunakan heading pendek & bullet, batasi jawaban ±150–300 kata, jangan mengada-ada aturan (ikuti Cambridge/Oxford). Akhiri dengan evaluasi singkat (skor + 1 kekuatan + 1 prioritas perbaikan + 1 langkah berikutnya) dan pertanyaan tindak lanjut. Gunakan Bahasa Indonesia saat menjelaskan.";

      let acc = "";
      let lastFlush = 0;
      const FLUSH_MS = 150;

      const flush = async () => {
        await updateMessage(aiMsgId, { content: acc });
        lastFlush = Date.now();
      };

      let sent = false;
      for (const model of candidateModels) {
        try {
          const client = await chatOpenRouter(
            apiKey,
            [{ role: "system", content: system }, ...history],
            { model, temperature: 0.8, stream: true }
          );

          if ("stream" in client && typeof client.stream === "function") {
            for await (const token of client.stream()) {
              acc += token;
              const now = Date.now();
              if (now - lastFlush >= FLUSH_MS) {
                await flush();
              }
            }
            if (acc) await flush();
          } else if ("text" in client) {
            acc = (client as any).text ?? "";
            await flush();
          }
          sent = true;
          break;
        } catch (e: any) {
          if (!String(e?.message || "").includes("404")) {
            acc =
              "Sorry, I couldn't reach the AI service.\n" +
              (e?.message || "Unknown error");
            await flush();
            break;
          }
          // kalau 404, coba model berikutnya
        }
      }

      if (!sent && !acc) {
        acc =
          "Sorry, I couldn't reach the AI service.\nTip: enable at least one provider/model on your OpenRouter key or try :free models.";
        await flush();
      }
    },
    [messages, updateMessage]
  );

  const handleSendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || !userId) return;

    let sid = activeId;
    if (!sid) sid = await createSession("New chat");
    if (!sid) return;

    setInputValue("");
    setIsLoading(true);

    // 1) simpan user message
    await appendMessage(sid, "user", text);

    // 2) seed AI message kosong
    const aiMsgId = await appendMessage(sid, "assistant", "");
    if (!aiMsgId) {
      setIsLoading(false);
      return;
    }

    // 3) stream dari OpenRouter dan update DB
    await sendToOpenRouter(text, aiMsgId, sid);

    // 4) auto-rename session berdasar first user message
    if (!active || active.title === "New chat" || active.title === "Welcome") {
      await renameSession(sid, text.slice(0, 40) || "New chat");
    }

    setIsLoading(false);
  }, [
    inputValue,
    userId,
    activeId,
    active,
    createSession,
    appendMessage,
    sendToOpenRouter,
    renameSession,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const sessionSelectValue = activeId ?? "";
  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const v = e.target.value;
      setActiveId(v || null);
    },
    [setActiveId]
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2>Chat Mode – Grammar Practice</h2>
              <p className="text-gray-500">
                Type your message. AI bakal kasih feedback singkat.
              </p>
            </div>
          </div>

          {/* Sessions switcher */}
          <div className="flex items-center gap-2">
            <select
              className="border border-gray-300 rounded-lg text-sm px-2 py-1 bg-white"
              value={sessionSelectValue}
              onChange={handleSelectChange}
            >
              <option value="">Select session…</option>
              {(sessions ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title || "Untitled"}
                </option>
              ))}
            </select>
            <button
              className="text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white hover:bg-gray-50"
              onClick={() => createSession("New chat")}
            >
              + New
            </button>
            {activeId && (
              <button
                className="text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white hover:bg-gray-50"
                onClick={() => deleteSession(activeId)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div ref={scrollRef} className="h-full overflow-y-auto px-6 py-8">
          <div className="max-w-4xl mx-auto pb-32 md:pb-8">
            {displayMessages.map((msg) => (
              <div key={msg.id} className="mb-6">
                {msg.sender === "user" && msg.errors?.length ? (
                  <>
                    <div className="flex gap-4 flex-row-reverse">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        You
                      </div>
                      <div className="flex flex-col items-end max-w-[75%] md:max-w-[65%]">
                        <div className="px-6 py-4 rounded-2xl shadow-sm bg-blue-600 text-white">
                          <GrammarHighlight
                            text={msg.message}
                            errors={msg.errors}
                            onErrorClick={setSelectedError}
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-2 px-2">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                    {selectedError && (
                      <div className="mt-4 ml-14">
                        <GrammarFeedback
                          error={selectedError}
                          onClose={() => setSelectedError(null)}
                        />
                      </div>
                    )}
                  </>
                ) : msg.sender === "ai" ? (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      AI
                    </div>
                    <div className="flex flex-col max-w-[75%] md:max-w-[65%]">
                      <div className="px-6 py-4 rounded-2xl shadow-sm bg-white border border-gray-200">
                        <MarkdownMessage text={msg.message} />
                      </div>
                      <span className="text-xs text-gray-500 mt-2 px-2">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ) : (
                  <ChatMessage
                    message={msg.message}
                    sender={msg.sender}
                    timestamp={msg.timestamp}
                  />
                )}
              </div>
            ))}

            {isLoading && (
              <p className="text-xs text-gray-500 mt-2 px-2">Streaming response…</p>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 shadow-lg px-6 py-6 pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-gray-100 rounded-2xl px-6 py-4 shadow-sm">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message in English..."
                className="w-full bg-transparent resize-none outline-none max-h-32"
                rows={1}
              />
            </div>

            {/* Send */}
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !activeId}
              className="p-4 rounded-full bg-blue-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              title="Send"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Tip: Tekan Enter untuk kirim (Shift+Enter untuk baris baru).
          </p>
        </div>
      </div>
    </div>
  );
}
