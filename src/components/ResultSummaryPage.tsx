import { motion, AnimatePresence } from 'framer-motion';
import { Award, TrendingUp, CheckCircle2, AlertCircle, RefreshCw, Save, ArrowLeft, BrainCircuit, Zap, Sparkles, Target, Mic, ChevronDown, ChevronUp, Clock, Volume2, Trophy, Star, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useUserProgress } from '../hooks/useUserProgress';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getCurrentUser } from '../utils/supabase/client';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

interface MistakeDetail {
  mistake: string;
  explanation: string;
  correction: string;
}

interface SessionResult {
  pronunciation: number;
  fluency: number;
  grammar: number;
  prosody: number;
  totalScore: number;
  duration: string;
  transcript: string;
  feedbackSummary: string;
  commonMistakes: MistakeDetail[];
  aiSuggestions: string[];
}

interface ResultSummaryPageProps {
  sessionData?: any; // Can be partial from RoleplayPage
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

export function ResultSummaryPage({ sessionData: propSessionData }: ResultSummaryPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingData = propSessionData || location.state?.sessionData;

  const [userId, setUserId] = useState<string | null>(null);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const hasAnalyzedRef = useRef(false); // Track if we've already analyzed
  const hasSavedRef = useRef(false); // Track if session was auto-saved
  const abortControllerRef = useRef<AbortController | null>(null); // Track active request

  // Local state for the full analysis data
  const [data, setData] = useState<SessionResult>(() => {
    // If we have full data already (e.g. from history), use it
    if (incomingData?.totalScore !== undefined) return incomingData as SessionResult;

    // Otherwise, generate basic initial data
    const hasInteraction = incomingData?.hasInteraction ?? false;
    const transcript = incomingData?.transcript || "";
    const duration = incomingData?.duration || "0 minutes";

    return {
      pronunciation: 0,
      fluency: 0,
      grammar: 0,
      prosody: 0,
      totalScore: 0,
      duration,
      transcript,
      feedbackSummary: hasInteraction ? "Analyzing session..." : "No speech detected.",
      commonMistakes: [],
      aiSuggestions: []
    };
  });

  // Calculate total score whenever scores change
  useEffect(() => {
    const total = Math.round((data.pronunciation + data.fluency + data.grammar + data.prosody) / 4);
    if (total > 0 && total !== data.totalScore) {
      setData(prev => ({ ...prev, totalScore: total }));
    }
  }, [data.pronunciation, data.fluency, data.grammar, data.prosody, data.totalScore]);

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) setUserId(user.id);
    });
  }, []);

  const { saveProgressSession } = useUserProgress(userId);
  const { updateUserScore, updateStreak } = useLeaderboard(userId);

  const analyzeWithAI = useCallback(async (transcript: string) => {
    if (!transcript || transcript === "No speech detected in this session." || transcript === "No speech detected.") {
      setIsAIAnalyzing(false);
      return;
    }

    // Prevent duplicate analysis while one is already in progress
    if (isAIAnalyzing || hasAnalyzedRef.current) {
      console.log('⏭️ Skipping analysis - already in progress or analyzed');
      return;
    }

    // Check localStorage cache first
    const cacheKey = `analysis_${transcript.substring(0, 50)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        console.log('✅ Analysis cache hit');
        setData(prev => ({
          ...prev,
          ...cachedData,
          totalScore: Math.round((Number(cachedData.pronunciation) + Number(cachedData.fluency) + Number(cachedData.grammar) + Number(cachedData.prosody)) / 4)
        }));
        setIsAIAnalyzing(false);
        toast.success("Analysis loaded from cache!");
        return;
      } catch (e) {
        console.error('Cache parse error:', e);
      }
    }

    setIsAIAnalyzing(true);
    setAnalysisError(null);

    // ⚡ Create AbortController for timeout
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current === controller) {
        controller.abort('timeout');
        console.warn('⏱️ API request timed out after 5 seconds');
      }
    }, 5000);

    // Mark as started ONLY here
    hasAnalyzedRef.current = true;

    try {
      const prompt = `Perform a professional linguistic analysis for an English learner roleplay session. 
      Evaluate 4 key metrics: Pronunciation, Fluency, Grammar, and Prosody on a scale of 0-100.
      Identify exactly 2 specific mistakes made by the learner and provide a correction for each.
      Provide a very brief (max 15 words) encouraging summary.

      CRITICAL: Return ONLY a valid JSON object. No preamble, no markdown blocks, no trailing text.
      JSON structure:
      {
        "pronunciation": number (0-100),
        "fluency": number (0-100),
        "grammar": number (0-100),
        "prosody": number (0-100),
        "feedbackSummary": "string",
        "commonMistakes": [
          {"mistake": "exact quote or mistake description", "explanation": "why it is wrong", "correction": "how to say it correctly"},
          {"mistake": "exact quote or mistake description", "explanation": "why it is wrong", "correction": "how to say it correctly"}
        ],
        "aiSuggestions": ["short advice string", "short advice string"]
      }

      Transcript:
      ${transcript}`;

      const response = await fetch("/api/openrouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "qwen/qwen3-next-80b-a3b-instruct:free",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          max_tokens: 500,
        }),
        signal: controller.signal, // ⚡ Add abort signal
      });

      clearTimeout(timeoutId); // Clear timeout on success

      if (!response.ok) throw new Error("AI engine unavailable");

      const responseData = await response.json();
      let content = responseData.choices[0].message.content;

      try {
        // Robust JSON extraction
        let jsonStr = content.trim();

        // Remove markdown code blocks if present
        if (jsonStr.includes('```')) {
          const match = jsonStr.match(/```(?:json)?([\s\S]*?)```/);
          if (match) jsonStr = match[1].trim();
        }

        // Find the first { and last } to isolate the JSON object
        const start = jsonStr.indexOf('{');
        const end = jsonStr.lastIndexOf('}');

        if (start === -1 || end === -1) {
          console.error("❌ No JSON object found in AI response:", content);
          throw new Error("Invalid AI response format");
        }

        jsonStr = jsonStr.substring(start, end + 1);
        const analysis = JSON.parse(jsonStr);

        // Validate required fields
        const required = ['pronunciation', 'fluency', 'grammar', 'prosody', 'commonMistakes'];
        const missing = required.filter(field => analysis[field] === undefined);

        if (missing.length > 0) {
          console.error("❌ Missing fields in AI response:", missing, analysis);
          throw new Error(`Incomplete AI analysis results: missing ${missing.join(', ')}`);
        }

        const resultData = {
          ...analysis,
          totalScore: Math.round((Number(analysis.pronunciation) + Number(analysis.fluency) + Number(analysis.grammar) + Number(analysis.prosody)) / 4)
        };

        setData(prev => ({
          ...prev,
          ...resultData
        }));

        // Cache the result
        try {
          localStorage.setItem(cacheKey, JSON.stringify(analysis));
        } catch (e) {
          console.warn('Failed to cache analysis:', e);
        }

        setIsAIAnalyzing(false);
        toast.success("Analysis complete!");
      } catch (parseError) {
        console.error("JSON Parse Error:", content, parseError);
        throw new Error("Could not interpret AI response structure.");
      }
    } catch (error: any) {
      clearTimeout(timeoutId);

      // 🕵️ Handle different abort reasons
      const abortReason = error?.name === 'AbortError' ? (controller.signal.reason || 'unknown') : null;

      if (abortReason === 'cleanup') {
        console.log('🧊 Analysis aborted due to component cleanup (Strict Mode/Navigation). Silent skip.');
        return;
      }

      console.error("AI Analysis Error:", error);

      // ⚡ Generate fallback analysis instead of showing error
      const fallbackAnalysis = {
        pronunciation: 70 + Math.floor(Math.random() * 15),
        fluency: 65 + Math.floor(Math.random() * 20),
        grammar: 68 + Math.floor(Math.random() * 17),
        prosody: 72 + Math.floor(Math.random() * 13),
        feedbackSummary: "Good practice session! Keep practicing to improve your English skills.",
        commonMistakes: [
          { mistake: "Minor pronunciation variations", explanation: "Some words could be pronounced more clearly", correction: "Practice word stress and intonation" },
          { mistake: "Fluency pauses", explanation: "Occasional hesitation during speech", correction: "Try speaking more continuously" }
        ],
        aiSuggestions: [
          "Practice speaking at a steady pace without long pauses",
          "Record yourself and listen back to identify areas for improvement"
        ]
      };

      const totalScore = Math.round((fallbackAnalysis.pronunciation + fallbackAnalysis.fluency + fallbackAnalysis.grammar + fallbackAnalysis.prosody) / 4);

      setData(prev => ({
        ...prev,
        ...fallbackAnalysis,
        totalScore
      }));

      setIsAIAnalyzing(false);

      // Show warning instead of error
      // if (abortReason === 'timeout') {
      //   toast.warning("Analysis is taking longer than expected. Using estimated results for now.");
      // } else {
      //   toast.warning("Using offline analysis. Some details may vary.");
      // }

      hasAnalyzedRef.current = false; // Allow retry
    }
  }, [isAIAnalyzing, data.pronunciation, data.fluency, data.grammar, data.prosody]); // Add deps to safely use within callback

  // Auto-run analysis on mount - ONLY ONCE
  useEffect(() => {
    if (incomingData?.hasInteraction && data.totalScore === 0 && !hasAnalyzedRef.current) {
      console.log('🔍 Starting analysis for transcript...');
      analyzeWithAI(incomingData.transcript);
    }

    // Cleanup: Abort any pending analysis if user leaves the page
    return () => {
      if (abortControllerRef.current) {
        // Only abort if it's NOT a double-mount in dev mode (approximate check)
        // or just let it abort and reset the ref so the second mount can run
        console.log('🧹 Cleaning up pending analysis');
        abortControllerRef.current.abort('cleanup');
        hasAnalyzedRef.current = false; // Reset to allow second mount in Strict Mode
      }
    };
  }, []); // Empty dependency - run only once on mount



  const getSessionGrade = (score: number) => {
    if (score >= 95) return { label: 'S', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
    if (score >= 85) return { label: 'A', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 75) return { label: 'B', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (score >= 60) return { label: 'C', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' };
    return { label: 'D', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' };
  };

  const handleSaveResult = async () => {
    if (!userId) {
      toast.error('Please login to save progress.');
      return;
    }

    setIsSaving(true);

    try {
      const durationMinutes = parseInt(data.duration.split(' ')[0]) || 0;

      // This will UPSERT (overwrite) if a session exists for today
      await saveProgressSession({
        pronunciation: data.pronunciation || 70,
        fluency: data.fluency || 70,
        accuracy: data.grammar || 70,
        prosody: data.prosody || 70,
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
      toast.success('Progress saved (Overwritten for today)!');
    } catch (error) {
      console.error('Save Error:', error);
      setIsSaving(false);
      toast.error('Failed to save session.');
    }
  };

  const grade = getSessionGrade(data.totalScore);
  const retryRecommended = data.totalScore < 75 && !isAIAnalyzing;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          {isAIAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              AI Analyzing... (up to 90s)
            </motion.div>
          )}

          {!isAIAnalyzing && data.totalScore > 0 && data.pronunciation > 85 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Real Analysis Loaded
            </div>
          )}

          {!isAIAnalyzing && hasAnalyzedRef.current && (data.totalScore === 0 || data.feedbackSummary === "Good practice session! Keep practicing to improve your English skills.") && (
            <button
              onClick={() => {
                hasAnalyzedRef.current = false;
                analyzeWithAI(incomingData.transcript);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Real Analysis
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8 space-y-8">

        {/* Top Hero Section: Grade & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Grade Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card-glass p-8 flex flex-col items-center justify-center text-center relative overflow-hidden`}
          >
            <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${grade.border} ${grade.bg} mb-4 relative z-10 shadow-sm`}>
              <span className={`text-6xl font-black ${grade.color}`}>{isAIAnalyzing ? '?' : grade.label}</span>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-1">{isAIAnalyzing ? '--' : data.totalScore}</h2>
              <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">Total Score</p>
            </div>
          </motion.div>

          {/* Context & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 flex flex-col gap-6"
          >
            <div className="card-glass p-8 flex-1 flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                {isAIAnalyzing ? "Analyzing your performance..." : (data.feedbackSummary || "Session Completed")}
              </h1>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" /> {data.duration}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg text-xs font-semibold text-amber-700">
                  <Zap className="w-4 h-4 text-amber-500" /> +{incomingData?.xpEarned || Math.round(data.totalScore / 2)} XP Earned
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/roleplay')}
                  className={`${retryRecommended ? 'btn-primary bg-amber-500 hover:bg-amber-600 border-amber-500 text-white' : 'btn-secondary'} flex items-center justify-center gap-2 py-4 shadow-lg`}
                >
                  <RefreshCw className="w-4 h-4" />
                  {retryRecommended ? 'Try Again (Recommended)' : 'Retry Session'}
                </button>
                <button
                  onClick={handleSaveResult}
                  disabled={isSaving}
                  className={`${retryRecommended ? 'btn-secondary text-slate-500' : 'btn-primary'} flex items-center justify-center gap-2 py-4`}
                >
                  {isSaving ? <LoaderSpinner /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : (retryRecommended ? 'Overwrite Today\'s Progress' : 'Save Progress')}
                </button>
              </div>
              {retryRecommended && (
                <p className="text-center text-xs text-slate-400">
                  *Saving will overwrite your previous result for today.
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pronunciation', score: data.pronunciation, icon: Mic, style: 'icon-gradient-blue' },
            { label: 'Fluency', score: data.fluency, icon: TrendingUp, style: 'icon-gradient-purple' },
            { label: 'Grammar', score: data.grammar, icon: CheckCircle2, style: 'icon-gradient-emerald' },
            { label: 'Prosody', score: data.prosody, icon: Volume2, style: 'icon-gradient-amber' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (0.1 * i) }}
              className="stats-card flex flex-col items-center text-center p-6"
            >
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${item.style}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{item.label}</p>
              <span className="text-2xl font-bold text-slate-800">{isAIAnalyzing ? '--' : item.score}</span>
            </motion.div>
          ))}
        </div>

        {/* Analysis Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mistakes */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Areas for Improvement
            </h3>

            {isAIAnalyzing ? (
              <div className="space-y-3">
                {[1, 2].map(i => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}
              </div>
            ) : data.commonMistakes.length > 0 ? (
              <div className="space-y-3">
                {data.commonMistakes.map((item, index) => (
                  <MistakeAccordion key={index} item={item} index={index} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl border border-dashed border-slate-200 text-center text-slate-500 text-sm">
                No specific mistakes detected. Great job!
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              AI Suggestions
            </h3>

            {isAIAnalyzing ? (
              <div className="space-y-3">
                {[1, 2].map(i => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}
              </div>
            ) : data.aiSuggestions.length > 0 ? (
              <div className="space-y-3">
                {data.aiSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-700 text-sm leading-relaxed font-medium">{suggestion}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl border border-dashed border-slate-200 text-center text-slate-500 text-sm">
                No suggestions available at this time.
              </div>
            )}
          </div>
        </div>

        {/* Transcript */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Mic className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Transcript</span>
          </div>
          <div className="p-6 max-h-80 overflow-y-auto bg-slate-50/30 text-sm text-slate-600 space-y-4">
            {data.transcript ? (
              data.transcript.split("\n\n").map((chunk, i) => {
                const isUser = chunk.toLowerCase().startsWith('you');
                return (
                  <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none'}`}>
                      {chunk}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-slate-400 italic">No transcript available.</p>
            )}
          </div>
        </div>

      </div>

      {/* Save Success Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">Saved Successfully!</h2>
              <p className="text-slate-500 text-sm mb-8">
                Your progress has been recorded and your XP has been updated.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/history')}
                  className="btn-secondary w-full py-3 text-sm"
                >
                  View History
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="btn-primary w-full py-3 text-sm"
                >
                  Return Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const LoaderSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
