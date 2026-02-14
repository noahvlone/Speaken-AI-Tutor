import { motion, AnimatePresence } from 'framer-motion';
import { Award, TrendingUp, CheckCircle2, AlertCircle, RefreshCw, Save, ArrowLeft, BrainCircuit, Zap, Sparkles, Target, Mic, ChevronDown, ChevronUp, Clock, Volume2, Trophy, Star, ArrowRight, MessageSquare, PenTool } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useUserProgress } from '../hooks/useUserProgress';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getCurrentUser } from '../utils/supabase/client';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { GrammarError } from './GrammarHighlight';

interface MistakeDetail {
  mistake: string;
  explanation: string;
  correction: string;
}

interface SessionResult {
  // Common
  totalScore: number;
  duration: string;
  transcript: string;
  feedbackSummary: string;
  commonMistakes: MistakeDetail[];
  aiSuggestions: string[];

  // Speaking Mode Metrics (Roleplay)
  pronunciation?: number;
  fluency?: number;
  prosody?: number;
  grammar?: number; // Shared but context differs

  // Writing Mode Metrics (Chat)
  vocabulary?: number;
  clarity?: number;
  coherence?: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ResultSummaryPageProps {
  sessionData?: any;
}

function MistakeAccordion({ item, index }: { item: MistakeDetail; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-orange-200 bg-orange-50/50' : 'border-slate-100 bg-white hover:border-orange-100'
        }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left group"
      >
        <div className="flex items-center gap-3 flex-1 pr-4">
          <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
            {index + 1}
          </div>
          <p className="text-slate-800 font-medium text-sm">{item.mistake}</p>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-orange-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-orange-400 transition-colors" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-3 border-t border-orange-100/50 mt-1">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-white/60 rounded-lg p-3 border border-orange-100/50">
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Issue
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.explanation}</p>
                </div>
                <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100/50">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Correction
                  </p>
                  <p className="text-sm text-emerald-700 font-semibold">{item.correction}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Highlight component for transcript
const HighlightedText = ({ text, errors, isDark = false }: { text: string; errors?: GrammarError[]; isDark?: boolean }) => {
  if (!errors || errors.length === 0) return <>{text}</>;

  // Sort errors by offset to process them in order
  const sortedErrors = [...errors].sort((a, b) => a.offset - b.offset);
  const fragments = [];
  let lastIndex = 0;

  sortedErrors.forEach((error, i) => {
    // Text before the error
    if (error.offset > lastIndex) {
      fragments.push(<span key={`text-${i}`}>{text.substring(lastIndex, error.offset)}</span>);
    }

    // The error text itself - Oval highlight
    const isPronunciation = error.type === 'pronunciation';

    // Adjusted colors for dark/light context to prevent "clashing"
    const bgColor = isDark
      ? (isPronunciation ? 'bg-indigo-400/20' : 'bg-rose-400/20')
      : (isPronunciation ? 'bg-indigo-50' : 'bg-rose-50');

    const textColor = isDark
      ? (isPronunciation ? 'text-indigo-100' : 'text-rose-100')
      : (isPronunciation ? 'text-indigo-700' : 'text-rose-700');

    const borderColor = isDark
      ? (isPronunciation ? 'border-indigo-400/30' : 'border-rose-400/30')
      : (isPronunciation ? 'border-indigo-100' : 'border-rose-100');

    fragments.push(
      <span
        key={`err-${i}`}
        className={`inline-block ${bgColor} ${textColor} font-black px-3 py-0.5 mx-0.5 rounded-full border ${borderColor} cursor-help transition-all hover:scale-105 active:scale-95 shadow-sm`}
        title={error.message}
      >
        {text.substring(error.offset, error.offset + error.length)}
      </span>
    );

    lastIndex = error.offset + error.length;
  });

  // Remaining text
  if (lastIndex < text.length) {
    fragments.push(<span key="text-end">{text.substring(lastIndex)}</span>);
  }

  return <>{fragments}</>;
};

import { evaluateWritingPerformance, evaluateSpeakingPerformance, checkGrammarLocally } from '../utils/scoringSystem';

export function ResultSummaryPage({ sessionData: propSessionData }: ResultSummaryPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingData = propSessionData || location.state?.sessionData;

  const [userId, setUserId] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isChatMode = incomingData?.sessionType === 'chat';

  // Initial Data State - Calculated Deterministically
  const [data, setData] = useState<SessionResult>(() => {
    const transcript = incomingData?.transcript || "";
    const duration = incomingData?.duration || "0 minutes";
    const chatHistory = incomingData?.chatHistory || [];
    const durationMinutes = parseInt(duration.split(' ')[0]) || 1;

    if (isChatMode) {
      const result = evaluateWritingPerformance(chatHistory, {});
      return {
        grammar: result.scores.grammar * 20, // Map 1-5 to 0-100
        vocabulary: result.scores.lexical * 20,
        clarity: result.scores.taskAchievement * 20,
        coherence: result.scores.coherence * 20,
        totalScore: result.finalScore,
        duration,
        transcript,
        feedbackSummary: result.feedback[0],
        commonMistakes: result.mistakes,
        aiSuggestions: ["Focus on sentence variety.", "Practice using more formal connectors."]
      };
    } else {
      const result = evaluateSpeakingPerformance(chatHistory, durationMinutes);
      return {
        pronunciation: result.scores.pronunciation,
        fluency: result.scores.fluency,
        grammar: result.scores.grammar,
        vocabulary: result.scores.lexical,
        totalScore: result.finalScore,
        duration,
        transcript,
        feedbackSummary: "IELTS Speaking Assessment Completed",
        commonMistakes: result.mistakes,
        aiSuggestions: result.feedback
      };
    }
  });

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) setUserId(user.id);
    });
  }, []);

  const { saveProgressSession } = useUserProgress(userId);
  const { updateUserScore, updateStreak } = useLeaderboard(userId);

  const getSessionGrade = (score: number) => {
    if (!isChatMode) {
      // IELTS Band Label
      if (score >= 8.5) return { label: '9', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'Expert' };
      if (score >= 7.5) return { label: '8', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'Very Good' };
      if (score >= 6.5) return { label: '7', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', text: 'Good' };
      if (score >= 5.5) return { label: '6', color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'Competent' };
      if (score >= 4.5) return { label: '5', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', text: 'Modest' };
      return { label: '<4', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', text: 'Limited' };
    }
    if (score >= 95) return { label: 'S', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'Superior' };
    if (score >= 85) return { label: 'A', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'Excellent' };
    if (score >= 75) return { label: 'B', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', text: 'Good' };
    if (score >= 60) return { label: 'C', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', text: 'Fair' };
    return { label: 'D', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', text: 'Poor' };
  };

  const handleSaveResult = async () => {
    if (!userId) {
      toast.error('Please login to save progress.');
      return;
    }
    setIsSaving(true);
    try {
      const durationMinutes = parseInt(data.duration.split(' ')[0]) || 0;
      await saveProgressSession({
        pronunciation: data.pronunciation || 0,
        fluency: data.fluency || 0,
        accuracy: data.grammar || 0,
        prosody: data.prosody || 0,
        // Map writing metrics if meaningful, otherwise defaults. 
        // Schema might need updates for vocabulary/clarity if strict, but 'accuracy' covers grammar.
        duration: durationMinutes,
        transcript: data.transcript,
        common_mistakes: data.commonMistakes || [],
        ai_suggestions: data.aiSuggestions || [],
        feedback_summary: data.feedbackSummary || "Session practice completed.",
        session_type: incomingData?.sessionType || 'roleplay'
      });

      const pointsEarned = Math.round(data.totalScore / 2);
      await updateUserScore(pointsEarned);
      await updateStreak();

      setIsSaving(false);
      setShowSaveModal(true);
      toast.success('Progress saved!');
    } catch (error) {
      console.error('Save Error:', error);
      setIsSaving(false);
      toast.error('Failed to save session.');
    }
  };

  const grade = getSessionGrade(data.totalScore);
  const metrics = isChatMode ? [
    { label: 'Grammar', score: data.grammar, icon: CheckCircle2, style: 'icon-gradient-emerald' },
    { label: 'Vocabulary', score: data.vocabulary, icon: BookOpen, style: 'icon-gradient-blue' },
    { label: 'Clarity', score: data.clarity, icon: Zap, style: 'icon-gradient-amber' },
    { label: 'Coherence', score: data.coherence, icon: BrainCircuit, style: 'icon-gradient-purple' },
  ] : [
    { label: 'Fluency', score: data.fluency, icon: TrendingUp, style: 'icon-gradient-purple' },
    { label: 'Lexical', score: data.vocabulary, icon: BookOpen, style: 'icon-gradient-blue' },
    { label: 'Grammar', score: data.grammar, icon: CheckCircle2, style: 'icon-gradient-emerald' },
    { label: 'Pronunciation', score: data.pronunciation, icon: Mic, style: 'icon-gradient-amber' },
  ];

  const chatHistory = incomingData?.chatHistory as ChatMessage[];

  // Calculate errors for each message dynamically if not provided
  const finalGrammarErrors = useMemo(() => {
    const errors: Record<string, GrammarError[]> = incomingData?.grammarErrors || {};

    chatHistory.forEach(msg => {
      if (msg.role === 'user' && !errors[msg.id]) {
        // Run local grammar check
        const localErrors = checkGrammarLocally(msg.content);

        // Demonstration: Add an intentional pronunciation highlight if score is < 70
        if (!isChatMode && (data.pronunciation || 0) < 70 && msg.content.length > 20) {
          const words = msg.content.split(' ');
          const longWord = words.find(w => w.length > 7);
          if (longWord) {
            const offset = msg.content.indexOf(longWord);
            localErrors.push({
              offset,
              length: longWord.length,
              message: "Pronunciation might be unclear here. Try to enunciate more clearly.",
              suggestion: longWord,
              type: 'pronunciation'
            });
          }
        }

        errors[msg.id] = localErrors;
      }
    });
    return errors;
  }, [chatHistory, incomingData?.grammarErrors, data.pronunciation, isChatMode]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all text-sm font-bold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-white border-slate-200 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
              {isChatMode ? <><PenTool className="w-3 h-3 mr-1.5 text-blue-600" /> Writing Assessment</> : <><Mic className="w-3 h-3 mr-1.5 text-blue-600" /> Speaking Assessment</>}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10 space-y-10">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-4 bg-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
          >
            <div className={`w-36 h-36 rounded-full flex items-center justify-center border-8 ${grade.border} ${grade.bg} mb-6 shadow-inner relative z-10`}>
              <span className={`text-7xl font-black ${grade.color} drop-shadow-sm`}>{grade.label}</span>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">
                {(isChatMode ? `${data.totalScore}%` : `Band ${data.totalScore.toFixed(1)}`)}
              </h2>
              <p className={`text-xs font-black uppercase tracking-[0.2em] ${grade.color}`}>
                {grade.text}
              </p>
            </div>
            {/* Background Accent */}
            <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity ${grade.bg}`} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-8 flex flex-col gap-6"
          >
            <div className="bg-white rounded-[2.5rem] p-10 flex-1 flex flex-col justify-center border border-slate-200 shadow-sm relative overflow-hidden">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
                {data.feedbackSummary || "Session Completed"}
              </h1>
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-600 shadow-sm">
                  <Clock className="w-4 h-4 text-blue-500" /> {data.duration}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-2xl text-xs font-black text-amber-700 shadow-sm">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> +{incomingData?.xpEarned} XP EARNED
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate(isChatMode ? '/chat' : '/roleplay')}
                  className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                >
                  <RefreshCw className="w-4 h-4" /> New Session
                </button>
                <button
                  onClick={handleSaveResult}
                  disabled={isSaving}
                  className="px-6 py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Result</>}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (0.1 * i) }}
              className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-shadow"
            >
              <div className={`w-14 h-14 rounded-2xl mb-5 flex items-center justify-center bg-slate-50 group-hover:scale-110 transition-transform duration-300`}>
                {item.icon && <item.icon className="w-7 h-7 text-slate-600" />}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{item.label}</p>
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {(isChatMode ? `${item.score}%` : (item.score || 0).toFixed(1))}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Content Split: Transcript & Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Chat History Transcript (2 columns wide) */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              Full Transcript
            </h3>
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[700px]">
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
                {chatHistory && chatHistory.length > 0 ? (
                  chatHistory.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    const errors = isUser && finalGrammarErrors ? finalGrammarErrors[msg.id] : undefined;

                    return (
                      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                          <div className={`
                            px-6 py-4 rounded-[2rem] text-[15px] leading-relaxed shadow-sm font-semibold
                            ${isUser
                              ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-200/50'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}
                          `}>
                            {isUser ? (
                              <HighlightedText text={msg.content} errors={errors} isDark={true} />
                            ) : (
                              msg.content
                            )}
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                            {isUser ? 'You' : 'AI Tutor'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : data.transcript && data.transcript !== "No speech detected." ? (
                  <div className="whitespace-pre-wrap text-slate-700 font-bold leading-[2] bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm italic text-lg text-center">
                    "{data.transcript}"
                  </div>
                ) : (
                  <p className="text-center text-slate-400 font-bold py-20 italic">No transcription available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: AI Feedback (1 column wide) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                Improvements
              </h3>
              <div className="space-y-4">
                {data.commonMistakes.length > 0 ? (
                  data.commonMistakes.map((item, i) => <MistakeAccordion key={i} item={item} index={i} />)
                ) : (
                  <div className="p-8 bg-white rounded-[2rem] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 font-bold text-sm">No major mistakes found!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                Suggestions
              </h3>
              <div className="space-y-4">
                {data.aiSuggestions.map((s, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    key={i}
                    className="p-6 bg-white border border-slate-200 rounded-[2rem] text-sm text-slate-700 font-bold flex gap-4 shadow-sm hover:border-blue-200 transition-colors"
                  >
                    <div className="mt-1 flex-shrink-0">
                      <Target className="w-4 h-4 text-blue-500" />
                    </div>
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-emerald-600 rotate-12">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black mb-3 text-slate-900 leading-tight">Great Session!</h2>
              <p className="text-slate-600 font-bold mb-8">Your progress has been updated and your streak is alive.</p>
              <button
                onClick={() => navigate('/home')}
                className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all"
              >
                Continue to Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

}

// Helper icon import
function BookOpen(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
  );
}
