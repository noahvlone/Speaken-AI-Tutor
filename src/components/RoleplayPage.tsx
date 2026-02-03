import {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
} from "@heygen/streaming-avatar";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  Mic,
  Settings as SettingsIcon,
  Zap,
  Volume2,
  CheckCircle2,
  X,
  RefreshCw
} from "lucide-react";
import { useMemoizedFn, useUnmount } from "ahooks";
import { useNavigate } from "react-router-dom";

import { Button } from "./Button";
import { AvatarConfig } from "./AvatarConfig";
import { AvatarVideo } from "./AvatarSession/AvatarVideo";
import { useStreamingAvatarSession } from "./logic/useStreamingAvatarSession";
import { AvatarControls } from "./AvatarSession/AvatarControls";
import { useVoiceChat } from "./logic/useVoiceChat";
import { useStreamingAvatarContext, MessageSender } from "./logic/context";
import { StreamingAvatarProvider, StreamingAvatarSessionState } from "./logic";
import { LoadingIcon } from "./Icons";
import { MessageHistory } from "./AvatarSession/MessageHistory";

import { AVATARS } from "../app/lib/constants";
import { useLevelSystem } from "../hooks/useLevelSystem";
import { getCurrentUser } from "../utils/supabase/client";

const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.Low,
  avatarName: AVATARS[0].avatar_id,
  // voice: {
  //   rate: 1.5,
  //   emotion: VoiceEmotion.EXCITED,
  // },
  language: "en",
  voiceChatTransport: VoiceChatTransport.WEBSOCKET,
};

function InteractiveAvatar() {
  const navigate = useNavigate();
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } =
    useStreamingAvatarSession();
  const { startVoiceChat } = useVoiceChat();
  const { messages } = useStreamingAvatarContext();
  const startTimeRef = useRef<number | null>(null);
  const shouldStartVoiceRef = useRef<boolean>(false);

  const [config, setConfig] = useState<StartAvatarRequest>(DEFAULT_CONFIG);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const mediaStream = useRef<HTMLVideoElement>(null);

  const { addXP } = useLevelSystem(userId);

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) setUserId(user.id);
    });
  }, []);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/heygen/token");
      const { token } = await response.json();

      console.log("Access Token:", token);

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }


  const handleEndSession = useMemoizedFn(async () => {
    const capturedMessages = [...messages];

    await stopAvatar();

    // Calculate session stats
    const endTime = Date.now();
    const durationMs = startTimeRef.current ? endTime - startTimeRef.current : 0;
    const sessionDurationMinutes = Math.max(1, Math.round(durationMs / 60000));

    // Include the full conversation in the transcript
    const transcript = capturedMessages
      .map(m => `${m.sender === MessageSender.CLIENT ? 'You' : 'Tutor'}: ${m.content}`)
      .join('\n\n');

    // Prepare basic session data to pass to the next page
    const userMessages = capturedMessages.filter(m => m.sender === MessageSender.CLIENT);
    const hasInteraction = userMessages.length > 0;

    let xpEarned = 0;
    if (hasInteraction && userId) {
      // Award 10 XP per user message, max 100 XP per session
      xpEarned = Math.min(userMessages.length * 10, 100);
      await addXP(xpEarned, 'roleplay');
    }

    const sessionData = {
      duration: `${sessionDurationMinutes} minutes`,
      transcript: transcript || "No speech detected in this session.",
      hasInteraction,
      xpEarned,
      sessionType: 'roleplay'
    };

    navigate('/result-summary', { state: { sessionData } });
  });

  const startSessionV2 = useMemoizedFn(async (isVoiceChat: boolean) => {
    try {
      const newToken = await fetchAccessToken();
      const avatar = initAvatar(newToken);

      avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        console.log("Avatar started talking", e);
      });
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        console.log("Avatar stopped talking", e);
      });
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
      });
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        console.log(">>>>> Stream ready:", event.detail);
        startTimeRef.current = Date.now(); // Track start time
        if (shouldStartVoiceRef.current) {
          shouldStartVoiceRef.current = false;
          // Add 1.5s delay to ensure session is fully ready for voice commands
          setTimeout(() => {
            console.log(">>>>> Auto-starting voice chat (delayed)...");
            startVoiceChat();
          }, 1500);
        }
      });
      avatar.on(StreamingEvents.USER_START, (event) => {
        console.log(">>>>> User started talking:", event);
      });
      avatar.on(StreamingEvents.USER_STOP, (event) => {
        console.log(">>>>> User stopped talking:", event);
      });
      avatar.on(StreamingEvents.USER_END_MESSAGE, (event) => {
        console.log(">>>>> User end message:", event);
      });
      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
        console.log(">>>>> User talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
        console.log(">>>>> Avatar talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
        console.log(">>>>> Avatar end message:", event);
      });

      const sanitizedConfig = { ...config };
      if (!sanitizedConfig.knowledgeId) {
        delete sanitizedConfig.knowledgeId;
      }

      if (isVoiceChat) {
        shouldStartVoiceRef.current = true;
      }

      await startAvatar(sanitizedConfig);
    } catch (error) {
      console.error("Error starting avatar session:", error);
    }
  });

  useUnmount(() => {
    stopAvatar();
  });

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 pb-20 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100"
        >
          <Sparkles className="w-3.5 h-3.5" /> Interactive Practice
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-4">
          AI Tutor Roleplay
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Master your English speaking skills by interacting with an immersive AI avatar.
          Real-time feedback, natural conversation.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Avatar Section */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glass overflow-hidden shadow-2xl relative border-white/40"
          >
            <div className="relative w-full aspect-video overflow-hidden bg-slate-900 shadow-inner">
              {sessionState !== StreamingAvatarSessionState.INACTIVE ? (
                <AvatarVideo ref={mediaStream} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50/50 backdrop-blur-sm">
                  <AvatarConfig config={config} onConfigChange={setConfig} />
                </div>
              )}

              {/* Status Overlay when connected */}
              {sessionState === StreamingAvatarSessionState.CONNECTED && (
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Session
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 items-center justify-center p-8 border-t border-slate-100/50 w-full bg-white/40">
              {sessionState === StreamingAvatarSessionState.CONNECTED ? (
                <div className="flex flex-col gap-8 w-full items-center">
                  <AvatarControls />
                  <button
                    onClick={handleEndSession}
                    className="btn-secondary text-rose-600 border-rose-100 hover:bg-rose-50 px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl hover:shadow-rose-100 transition-all transform hover:-translate-y-1"
                  >
                    <X className="w-5 h-5" /> End & Analyze Session
                  </button>
                </div>
              ) : isAnalyzing ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900 mb-1">Processing Analysis</p>
                    <p className="text-slate-500 text-sm">Our AI is evaluating your linguistic performance...</p>
                  </div>
                </div>
              ) : sessionState === StreamingAvatarSessionState.CONNECTING ? (
                <div className="flex flex-col items-center gap-6 py-6 text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-blue-100/50 rounded-full animate-ping absolute inset-0" />
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg relative z-10">
                      <LoadingIcon className="w-10 h-10 animate-spin text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900 mb-1">Summoning Tutor</p>
                    <p className="text-slate-500 text-sm mb-6">Establishing a high-fidelity semantic link...</p>
                    <button
                      onClick={handleEndSession}
                      className="text-slate-400 hover:text-rose-500 text-xs font-bold uppercase tracking-tighter transition-colors"
                    >
                      Cancel Connection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <button
                    onClick={() => startSessionV2(true)}
                    className="btn-primary min-w-[200px] flex items-center justify-center gap-3 py-4 text-lg"
                  >
                    <Mic className="w-5 h-5" /> Start Voice Chat
                  </button>
                  <button
                    onClick={() => startSessionV2(false)}
                    className="btn-secondary min-w-[200px] flex items-center justify-center gap-3 py-4 text-lg"
                  >
                    <MessageSquare className="w-5 h-5" /> Start Text Chat
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Message History */}
          {sessionState === StreamingAvatarSessionState.CONNECTED && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-glass p-8 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Live Conversation</h3>
              </div>
              <MessageHistory />
            </motion.div>
          )}
        </div>

        {/* Side Panel - Configuration & Status */}
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card-glass p-8 shadow-xl bg-white/60"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Session Config</h3>
            </div>

            {sessionState === StreamingAvatarSessionState.INACTIVE ? (
              <AvatarConfig config={config} onConfigChange={setConfig} />
            ) : (
              <div className="text-center py-10">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-25" />
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center relative z-10">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>
                <p className="text-emerald-700 font-bold text-lg">Active Connection</p>
                <p className="text-slate-500 text-sm mt-2">Configuration locked during session.</p>
              </div>
            )}
          </motion.div>

          {/* Status Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card-glass p-8 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Session Metrics
            </h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">Network State</span>
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${sessionState === StreamingAvatarSessionState.CONNECTED
                  ? "bg-emerald-500/20 text-emerald-400"
                  : sessionState === StreamingAvatarSessionState.INACTIVE
                    ? "bg-white/10 text-slate-400"
                    : "bg-amber-500/20 text-amber-400"
                  }`}>
                  {sessionState}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">Interaction Mode</span>
                <span className="text-white text-sm font-bold flex items-center gap-2">
                  {config.voiceChatTransport === VoiceChatTransport.WEBSOCKET ? <><Mic className="w-3 h-3 text-blue-400" /> Voice</> : <><MessageSquare className="w-3 h-3 text-purple-400" /> Text</>}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">Stream Quality</span>
                <span className="text-white text-sm font-bold uppercase">{config.quality}</span>
              </div>
              <div className="pt-4 flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                <Volume2 className="w-3 h-3" /> VOX_READY_BUFFER_STABLE_V2
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function RoleplayPage() {
  return (
    <StreamingAvatarProvider>
      <InteractiveAvatar />
    </StreamingAvatarProvider>
  );
}

export default RoleplayPage;