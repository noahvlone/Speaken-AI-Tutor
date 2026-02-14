import {
  Send, Sparkles, Mic, X, ArrowUp, Briefcase, Coffee, Building, Plane, Stethoscope, Users, CheckCircle2, Clock, MessageSquare, AlertCircle
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GrammarFeedback, GrammarError } from "./GrammarHighlight";
import { analyzeGrammarWithAI } from "../lib/grammarAI";
import { chatOpenRouter } from "../lib/openrouter";
import { useSupabaseChat } from "../hooks/useSupabaseChat";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { MarkdownMessage } from "./MarkdownMessage";
import { GrammarHighlight } from "./GrammarHighlight";
import { buildSystemPrompt } from "../lib/aiPrompts";
import { BEGINNER_SCENARIOS, BeginnerScenario } from "./BeginnerScenarios";
import { useLevelSystem } from "../hooks/useLevelSystem";
import { useDailyChallenges } from "../hooks/useDailyChallenges";
import { supabase } from "../lib/supabaseClient";

type Sender = "user" | "ai";

interface DisplayMessage {
  id: string;
  message: string;
  sender: Sender;
  timestamp: string;
  errors?: GrammarError[];
  isAnalyzing?: boolean;
}

// Roleplay Scenarios
interface Scenario {
  id: string;
  title: string;
  description: string;
  role: string;
  userRole: string;
  icon: React.ReactNode;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  systemPrompt: string;
  avatar: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "job-interview",
    title: "Job Interview",
    description: "Practice answering common interview questions for a software engineer position.",
    role: "Interviewer",
    userRole: "Candidate",
    icon: <Briefcase className="w-6 h-6 text-blue-500" />,
    difficulty: "Advanced",
    systemPrompt: "You are a professional hiring manager conducting a job interview for a software engineering role. Ask relevant technical and behavioral questions. Be professional but encouraging. Correct mistakes gently.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher"
  },
  {
    id: "restaurant",
    title: "Ordering at a Restaurant",
    description: "Learn how to order food, ask for recommendations, and pay the bill.",
    role: "Waiter",
    userRole: "Customer",
    icon: <Coffee className="w-6 h-6 text-amber-500" />,
    difficulty: "Beginner",
    systemPrompt: "You are a friendly waiter at a high-end restaurant. Help the customer with the menu, take their order, and handle billing. Use polite restaurant terminology.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brian"
  },
  {
    id: "hotel-checkin",
    title: "Hotel Check-in",
    description: "Navigate the check-in process, ask about amenities, and resolve booking issues.",
    role: "Receptionist",
    userRole: "Guest",
    icon: <Building className="w-6 h-6 text-purple-500" />,
    difficulty: "Intermediate",
    systemPrompt: "You are a hotel receptionist. Assist the guest with checking in, explaining hotel amenities, and answering questions about their stay. Be welcoming and helpful.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria"
  },
  {
    id: "airport",
    title: "Airport & Travel",
    description: "Handle check-in, security, customs, and Asking for directions at an airport.",
    role: "Airport Staff",
    userRole: "Traveler",
    icon: <Plane className="w-6 h-6 text-sky-500" />,
    difficulty: "Intermediate",
    systemPrompt: "You are an airport staff member. Assist the traveler with check-in, directions, or flight information. Use appropriate travel vocabulary.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Avery"
  },
  {
    id: "doctor",
    title: "Doctor's Appointment",
    description: "Describe symptoms, understand diagnosis, and ask about treatments.",
    role: "Doctor",
    userRole: "Patient",
    icon: <Stethoscope className="w-6 h-6 text-rose-500" />,
    difficulty: "Advanced",
    systemPrompt: "You are a compassionate doctor. Listen to the patient's symptoms, ask clarifying questions, and provide a diagnosis/treatment plan in simple English. Avoid overly complex medical jargon unless necessary.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    id: "business-meeting",
    title: "Business Meeting",
    description: "Participate in a meeting, present ideas, and negotiate usage.",
    role: "Colleague",
    userRole: "Presenter",
    icon: <Users className="w-6 h-6 text-emerald-500" />,
    difficulty: "Advanced",
    systemPrompt: "You are a colleague in a business meeting. Listen to the user's presentation or ideas, ask relevant business questions, and provide feedback. Use professional business English.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
  }
];

const nowStr = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

interface TextChatPageProps {
  userId: string | null;
}

export function TextChatPage({ userId }: TextChatPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { scenarioId } = useParams();

  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    if (scenarioId) {
      const found = SCENARIOS.find(s => s.id === scenarioId);
      if (found) setSelectedScenario(found);
    } else {
      setSelectedScenario(null);
    }
  }, [scenarioId]);

  const [selectedBeginnerScenario, setSelectedBeginnerScenario] = useState<BeginnerScenario | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [userLevel, setUserLevel] = useState<string>('intermediate');
  const [messageCount, setMessageCount] = useState(0);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // Fetch User Avatar
  useEffect(() => {
    if (userId) {
      const fetchAvatar = async () => {
        try {
          // Try public_profiles first
          const { data: profile } = await supabase
            .from('public_profiles')
            .select('avatar_url')
            .eq('id', userId)
            .maybeSingle();

          if (profile?.avatar_url) {
            setUserAvatar(profile.avatar_url);
            return;
          }

          // Fallback to auth metadata
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.user_metadata?.avatar_url) {
            setUserAvatar(user.user_metadata.avatar_url);
          }
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      };

      fetchAvatar();
    }
  }, [userId]);

  const [inputValue, setInputValue] = useState("");
  const [selectedError, setSelectedError] = useState<GrammarError | null>(null);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [grammarCache, setGrammarCache] = useState<Record<string, GrammarError[]>>({});
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());

  // Level system for XP
  const { addXP } = useLevelSystem(userId);
  const { completeQuest } = useDailyChallenges(userId);

  // Handle beginner scenario from navigation state
  useEffect(() => {
    const state = location.state as { beginnerScenario?: BeginnerScenario };
    if (state?.beginnerScenario) {
      setSelectedBeginnerScenario(state.beginnerScenario);
      // Clear the state to prevent re-triggering
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Load user level from settings
  useEffect(() => {
    if (userId) {
      supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            console.warn('Could not load user settings:', error.message);
            return;
          }
          // Try english_level first, then current_level (for backwards compat)
          const level = data?.english_level || data?.current_level || 'intermediate';
          setUserLevel(level);
        });
    }
  }, [userId]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    sessions,
    active,
    activeId,
    setActiveId,
    createSession,
    renameSession,
    deleteSession,
    messages,
    appendMessage,
    updateMessage,
  } = useSupabaseChat(userId);

  // Use ref to track analyzed messages and avoid dependency issues
  const analyzedMessagesRef = useRef<Set<string>>(new Set());
  const isAnalyzingRef = useRef(false);

  useEffect(() => {
    const analyzeOutstandingMessages = async () => {
      if (isAnalyzingRef.current) {
        return;
      }

      const userMessages = messages.filter(m => m.role === "user");
      const toAnalyze = userMessages.filter(
        msg => !grammarCache[msg.id] && !analyzingIds.has(msg.id) && !analyzedMessagesRef.current.has(msg.id)
      );

      if (toAnalyze.length === 0) return;

      isAnalyzingRef.current = true;
      const BATCH_SIZE = 3;
      const batch = toAnalyze.slice(0, BATCH_SIZE);

      batch.forEach(msg => {
        setAnalyzingIds(prev => new Set(prev).add(msg.id));
        analyzedMessagesRef.current.add(msg.id);
      });

      const ANALYSIS_TIMEOUT_MS = 3500;

      try {
        const results = await Promise.all(
          batch.map(async (msg) => {
            const timeoutPromise = new Promise<{ id: string; errors: GrammarError[] }>((_, reject) =>
              setTimeout(() => reject(new Error('Grammar analysis timeout')), ANALYSIS_TIMEOUT_MS)
            );

            const analysisPromise = (async () => {
              try {
                const errors = await analyzeGrammarWithAI(msg.content);
                return { id: msg.id, errors };
              } catch (error) {
                return { id: msg.id, errors: [] };
              }
            })();

            try {
              return await Promise.race([analysisPromise, timeoutPromise]);
            } catch (error) {
              return { id: msg.id, errors: [] };
            }
          })
        );

        setGrammarCache(prev => {
          const updated = { ...prev };
          results.forEach(({ id, errors }) => {
            updated[id] = errors;
          });
          return updated;
        });

        setAnalyzingIds(prev => {
          const next = new Set(prev);
          batch.forEach(msg => next.delete(msg.id));
          return next;
        });
      } catch (error) {
        setAnalyzingIds(prev => {
          const next = new Set(prev);
          batch.forEach(msg => next.delete(msg.id));
          return next;
        });
      } finally {
        isAnalyzingRef.current = false;
      }
    };

    analyzeOutstandingMessages();
  }, [messages.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, activeId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const displayMessages: DisplayMessage[] = useMemo(() => {
    // Deduplicate messages by ID to prevent key collisions
    const uniqueMessages = Array.from(new Map(messages.map(m => [m.id, m])).values());

    return uniqueMessages.map((msg) => ({
      id: msg.id,
      message: msg.content,
      sender: msg.role === "user" ? "user" : "ai",
      timestamp: nowStr(),
      errors: msg.role === "user" ? grammarCache[msg.id] : undefined,
      isAnalyzing: msg.role === "user" && analyzingIds.has(msg.id),
    }));
  }, [messages, grammarCache, analyzingIds]);

  const sendToOpenRouter = useCallback(
    async (userText: string, aiMsgId: string) => {
      try {
        const history = messages
          .filter(msg => msg.id !== aiMsgId)
          .map(msg => ({ role: msg.role, content: msg.content }));

        history.push({ role: "user", content: userText });

        const apiKey = (import.meta as any).env?.VITE_OPENROUTER_API_KEY;
        if (!apiKey) {
          await updateMessage(aiMsgId, { content: "⚠️ API Key Missing" });
          return;
        }

        const candidateModels = [
          "openrouter/aurora-alpha",
          "google/gemini-2.0-flash-lite-preview-02-05:free",
          "openrouter/auto",
          "liquid/lfm-2.5-1.2b-instruct:free",
        ];

        const basePrompt = (selectedBeginnerScenario && selectedBeginnerScenario.systemPrompt) ||
          (selectedScenario && selectedScenario.systemPrompt) ||
          `You are "Esther", a premium AI English Tutor. You are sophisticated, patient, and precise. Help the user master English by engaging in natural conversation. Profile: Professional but friendly expert.`;

        const system = buildSystemPrompt(basePrompt, userLevel);

        let acc = "";
        let lastFlush = 0;
        const FLUSH_MS = 1000;

        for (const model of candidateModels) {
          try {
            const client = await chatOpenRouter(
              apiKey,
              [{ role: "system", content: system }, ...history],
              { model, temperature: 0.7, stream: true }
            );

            if ("stream" in client && typeof client.stream === "function") {
              for await (const token of client.stream()) {
                acc += token;
                const now = Date.now();
                if (now - lastFlush >= FLUSH_MS) {
                  await updateMessage(aiMsgId, { content: acc });
                  lastFlush = now;
                }
              }
              await updateMessage(aiMsgId, { content: acc });
              return;
            }
          } catch (e) {
            console.error(`Model ${model} failed: `, e);
          }
        }
        await updateMessage(aiMsgId, { content: "⚠️ System busy. Please try again." });
      } catch (error) {
        await updateMessage(aiMsgId, { content: `❌ Service Error: ${error instanceof Error ? error.message : 'Unknown'} ` });
      }
    },
    [messages, updateMessage, selectedScenario, selectedBeginnerScenario, userLevel]
  );

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setSessionStartTime(Date.now());

    // Optionally auto-start conversation
    // handleSendMessage(`Hello, I'm ready to start the ${scenario.title} roleplay.`);
  };

  const handleEndSession = async () => {
    const userMessages = messages.filter(m => m.role === "user");
    const hasInteraction = userMessages.length > 0;

    // Calculate basic duration if start time exists
    const durationMs = sessionStartTime ? Date.now() - sessionStartTime : 0;
    const durationMinutes = Math.max(1, Math.round(durationMs / 60000));

    const transcript = messages
      .map(m => `${m.role === 'user' ? 'You' : 'Tutor'}: ${m.content}`)
      .join('\n\n');

    // Award XP for chat interaction (5 XP per message, max 50 XP)
    if (hasInteraction && userId) {
      const xpEarned = Math.min(userMessages.length * 5, 50);
      await addXP(xpEarned, selectedScenario ? 'roleplay' : 'chat');

      // Also mark Daily Speaking quest as complete
      if (selectedScenario) {
        await completeQuest('Speaking', 'daily');
      }
    }

    const sessionData = {
      duration: `${durationMinutes} minutes`,
      transcript: transcript || "No conversation detected.",
      hasInteraction,
      sessionType: selectedScenario ? 'roleplay' : 'chat',
      scenarioTitle: selectedScenario?.title || "Free Chat",
      xpEarned: hasInteraction ? Math.min(userMessages.length * 5, 50) : 0,
      chatHistory: messages,
      grammarErrors: grammarCache
    };

    navigate('/result-chat', { state: { sessionData } });
  };

  const handleSendMessage = useCallback(async (textOverride?: string) => {
    const text = textOverride || inputValue.trim();
    if (!text || !userId || isLoading) return;

    let currentActiveId = activeId;
    if (!currentActiveId) {
      const newSid = await createSession("New conversation");
      if (!newSid) return;
      currentActiveId = newSid;
      setActiveId(newSid);
    }

    setInputValue("");
    setIsLoading(true);

    try {
      await appendMessage(currentActiveId, "user", text);
      const aiMsgId = await appendMessage(currentActiveId, "assistant", "");
      if (aiMsgId) {
        await sendToOpenRouter(text, aiMsgId);
      }
      if (active && (active.title === "New chat" || active.title === "New conversation")) {
        await renameSession(currentActiveId, text.slice(0, 35));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, userId, activeId, active, createSession, setActiveId, appendMessage, sendToOpenRouter, renameSession, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleErrorClick = (error: GrammarError) => {
    setSelectedError(error);
    setShowAnalysisPanel(true);
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/30">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground text-lg">Please sign in to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      {/* Main Chat Area - Full Width */}
      <main className="flex-1 flex flex-col relative">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pb-32" ref={scrollRef}>
          <div className="max-w-4xl mx-auto px-4 py-8">
            {!selectedScenario && displayMessages.length === 0 ? (
              /* Scenario Selection Screen */
              <div className="flex flex-col items-center justify-center min-h-[60vh] py-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-10"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl mx-auto">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
                    Choose a Roleplay Scenario
                  </h1>
                  <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
                    Select a scenario to practice real-world conversations. Esther will adapt her role to help you master specific situations.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl px-4">
                  {SCENARIOS.map((scenario, index) => (
                    <motion.button
                      key={scenario.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => startScenario(scenario)}
                      className="group relative flex flex-col text-left bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 overflow-visible"
                    >
                      {/* Spotlight/Glow Effect Layer */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-[26px] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500 -z-10" />

                      <div className="relative z-10 flex flex-col h-full w-full">
                        {/* Decorative Icon Blob */}
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

                        <div className="mb-4 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl w-fit group-hover:bg-white group-hover:border-blue-100 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                          {scenario.icon}
                        </div>

                        <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                          {scenario.title}
                        </h3>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-1 relative z-10">
                          {scenario.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 group-hover:border-blue-100/50 transition-colors">
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${scenario.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            scenario.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                            {scenario.difficulty}
                          </span>
                          <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-1.5 transition-colors bg-white px-2 py-1 rounded-lg group-hover:shadow-sm">
                            Start <ArrowUp className="w-3 h-3 rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message List */
              <>
                {/* Active Scenario Header */}
                {selectedScenario && (
                  <div className="sticky top-0 z-10 mb-6 flex justify-center">
                    <div className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-full px-5 py-2 flex items-center gap-3">
                      <span className="p-1.5 bg-slate-100 rounded-lg">
                        {selectedScenario.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Current Scenario</span>
                        <span className="text-xs text-slate-500 font-medium">{selectedScenario.title} &bull; {selectedScenario.role}</span>
                      </div>
                      <div className="h-6 w-px bg-slate-200 mx-1" />
                      <button
                        onClick={handleEndSession}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
                      >
                        End & Analyze
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  {/* System Welcome Message if no messages yet */}
                  {displayMessages.length === 0 && selectedScenario && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 justify-start"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="max-w-[80%] ml-1">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                          <p className="text-[15px] leading-relaxed text-slate-700">
                            Hello! I am ready to roleplay as the <strong>{selectedScenario.role}</strong>.
                            You are playing the role of <strong>{selectedScenario.userRole}</strong>.
                            Start the conversation whenever you are ready!
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1.5 block">
                            System
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {displayMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 items-end ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      {/* Avatar */}
                      {msg.sender === 'ai' ? (
                        <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-white p-0.5 shadow-md ring-1 ring-slate-100 flex-shrink-0 relative overflow-hidden">
                          <img
                            src={selectedScenario?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Esther"}
                            alt="AI Avatar"
                            className="w-full h-full object-cover rounded-full bg-slate-50"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-white p-0.5 shadow-md ring-1 ring-slate-100 flex-shrink-0 relative overflow-hidden">
                          <img
                            src={userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId || 'User123'}`}
                            alt="User Avatar"
                            className="w-full h-full object-cover rounded-full bg-slate-50"
                          />
                        </div>
                      )}

                      {/* Message bubble */}
                      <div className={`max-w-[80%] ${msg.sender === 'user' ? 'mr-1' : 'ml-1'}`}>
                        {msg.sender === 'user' ? (
                          <div className="bg-white text-slate-800 border border-blue-200 rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
                            {msg.errors && msg.errors.length > 0 ? (
                              <GrammarHighlight
                                text={msg.message}
                                errors={msg.errors}
                                onErrorClick={handleErrorClick}
                              />
                            ) : (
                              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                            )}
                            {msg.isAnalyzing && (
                              <div className="mt-2 flex items-center gap-2 text-xs text-blue-500">
                                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                Checking grammar...
                              </div>
                            )}
                            {msg.errors && msg.errors.length > 0 && !msg.isAnalyzing && (
                              <button
                                onClick={() => handleErrorClick(msg.errors![0])}
                                className="mt-2 text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 transition-colors"
                              >
                                <AlertCircle className="w-3 h-3" />
                                {msg.errors.length} suggestion{msg.errors.length > 1 ? 's' : ''} found
                              </button>
                            )}
                            <span className="text-[10px] text-slate-400 mt-1.5 block text-right font-medium">
                              {msg.timestamp}
                            </span>
                          </div>
                        ) : (
                          <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm group hover:shadow-md transition-shadow">
                            <div className="prose prose-slate prose-sm max-w-none text-slate-700">
                              <MarkdownMessage text={msg.message || (isLoading ? '...' : '')} />
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1.5 block font-medium">
                              {msg.timestamp}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && displayMessages[displayMessages.length - 1]?.sender !== 'ai' && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center gap-1.5 py-4">
                        <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Input Area - Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-6 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-lg focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedScenario ? `Message as ${selectedScenario.userRole}...` : "Message Esther..."}
                className="flex-1 bg-transparent border-none resize-none max-h-[200px] py-2 px-3 text-foreground text-[15px] placeholder:text-muted-foreground focus:outline-none"
                rows={1}
              />

              {/* Mic Button */}
              <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-slate-100 rounded-xl transition-colors">
                <Mic className="w-5 h-5" />
              </button>

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Esther can make mistakes. Check important grammar suggestions.
            </p>
          </div>
        </div>
      </main>

      {/* Grammar Analysis Panel */}
      <AnimatePresence>
        {showAnalysisPanel && selectedError && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-lg">Grammar Feedback</h3>
              <button
                onClick={() => setShowAnalysisPanel(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <GrammarFeedback
                error={selectedError}
                onClose={() => setShowAnalysisPanel(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
