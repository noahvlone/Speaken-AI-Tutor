import { chatOpenRouter } from '../lib/openrouter';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, RefreshCw, Save, ArrowLeft, BrainCircuit, Zap, Sparkles, Target, Clock, MessageSquare, PenTool, LayoutList, Link as LinkIcon, BookOpen, Settings, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useUserProgress } from '../hooks/useUserProgress';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getCurrentUser } from '../utils/supabase/client';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { GrammarError } from './GrammarHighlight';
import { evaluateWritingPerformance } from '../utils/scoringSystem';

interface MistakeDetail {
    mistake: string;
    explanation: string;
    correction: string;
}

interface ChatSessionResult {
    grammar: number;
    vocabulary: number;
    clarity: number;
    coherence: number;
    feedbackSummary: string;
    commonMistakes: MistakeDetail[];
    aiSuggestions: string[];
    transcript: string;
    duration: string;
    totalScore: number;
    chatHistory?: any[];
    grammarErrors?: Record<string, GrammarError[]>;
}

export function ChatResultPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const incomingData = location.state?.sessionData;

    const [data, setData] = useState<ChatSessionResult>({
        // Default initial state matching new structure
        scores: {
            taskAchievement: 0,
            coherence: 0,
            lexical: 0,
            grammar: 0,
            mechanics: 0
        },
        feedbackSummary: "Connect to AI to analyze your session.",
        commonMistakes: [],
        aiSuggestions: [],
        transcript: incomingData?.transcript || "",
        duration: incomingData?.duration || "00:00",
        totalScore: 0,
        chatHistory: incomingData?.chatHistory || [],
        grammarErrors: incomingData?.grammarErrors || {}
    });

    // ... (keep effects, replacing the scoring call processing)

    // Calculate score on mount if not provided
    useEffect(() => {
        if (incomingData?.chatHistory) {
            // We need to call evaluateWritingPerformance here
            const result = evaluateWritingPerformance(incomingData.chatHistory, incomingData.grammarErrors || {});
            setData(prev => ({
                ...prev,
                scores: result.scores,
                totalScore: result.finalScore,
                commonMistakes: result.mistakes,
                // feedbackSummary: result.feedback[0] // Or keep existing logic
            }));
            setIsAIAnalyzing(false);
        }
    }, [incomingData]);

    const metrics = [
        { label: "Task Achievement", score: data.scores?.taskAchievement, icon: Target, style: "icon-gradient-sky" },
        { label: "Coherence", score: data.scores?.coherence, icon: BrainCircuit, style: "icon-gradient-purple" },
        { label: "Lexical Resource", score: data.scores?.lexical, icon: BookOpen, style: "icon-gradient-blue" },
        { label: "Grammar", score: data.scores?.grammar, icon: CheckCircle2, style: "icon-gradient-emerald" },
        { label: "Mechanics", score: data.scores?.mechanics, icon: PenTool, style: "icon-gradient-amber" },
    ];

    const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
    const hasAnalyzedRef = useRef(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    useEffect(() => {
        const total = Math.round((
            (data.grammar || 0) +
            (data.vocabulary || 0) +
            (data.clarity || 0) +
            (data.coherence || 0)
        ) / 4);

        if (total > 0 && total !== data.totalScore) {
            setData(prev => ({ ...prev, totalScore: total }));
        }
    }, [data.vocabulary, data.grammar, data.clarity, data.coherence]);

    useEffect(() => {
        getCurrentUser().then(user => {
            if (user) setUserId(user.id);
        });
    }, []);

    const { saveProgressSession } = useUserProgress(userId);
    const { updateUserScore, updateStreak } = useLeaderboard(userId);

    const analyzeWithAI = useCallback((transcript: string) => {
        if (!transcript || transcript === "No speech detected.") {
            setIsAIAnalyzing(false);
            return;
        }

        if (isAIAnalyzing || hasAnalyzedRef.current) return;

        setIsAIAnalyzing(true);
        hasAnalyzedRef.current = true;

        // Use Deterministic Scoring System (User Request)
        // No GenAI here.
        setTimeout(() => {
            const evaluation = evaluateWritingPerformance(
                data.chatHistory || [],
                data.grammarErrors || {}
            );

            const resultData = {
                grammar: evaluation.scores.grammar,
                vocabulary: evaluation.scores.vocabulary,
                clarity: evaluation.scores.clarity,
                coherence: evaluation.scores.coherence,
                feedbackSummary: evaluation.feedback[0] || "Good effort! Keep practicing.",
                commonMistakes: evaluation.mistakes,
                aiSuggestions: evaluation.feedback,
                transcript: data.transcript,
                duration: data.duration,
            };

            setData(prev => ({ ...prev, ...resultData }));

            const sessionKey = `chat_result_${data.transcript?.substring(0, 30) || 'default'}`;
            sessionStorage.setItem(sessionKey, JSON.stringify({
                ...resultData,
                chatHistory: data.chatHistory,
                grammarErrors: data.grammarErrors,
            }));

            setIsAIAnalyzing(false);
            toast.success("Analysis complete!");
        }, 1500); // Simulate processing delay for UX

    }, [isAIAnalyzing, data.transcript, data.chatHistory, data.grammarErrors]);

    useEffect(() => {
        if (incomingData?.hasInteraction && data.totalScore === 0 && !hasAnalyzedRef.current) {
            analyzeWithAI(incomingData.transcript);
        }
    }, []);

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
            await saveProgressSession({
                pronunciation: 0,
                fluency: 0,
                accuracy: data.grammar || 0,
                prosody: 0,
                duration: durationMinutes,
                transcript: data.transcript,
                common_mistakes: data.commonMistakes || [],
                ai_suggestions: data.aiSuggestions || [],
                feedback_summary: data.feedbackSummary || "Chat practice completed.",
                session_type: 'chat'
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



    const chatHistory = data.chatHistory || incomingData?.chatHistory || [];
    const grammarErrors = data.grammarErrors || incomingData?.grammarErrors || {};

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>

                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-white">
                            <PenTool className="w-3 h-3 mr-1" /> Writing Analysis
                        </Badge>
                        {isAIAnalyzing && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 pt-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`card-glass p-8 flex flex-col items-center justify-center text-center`}>
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${grade.border} ${grade.bg} mb-4 shadow-sm`}>
                            <span className={`text-6xl font-black ${grade.color}`}>{isAIAnalyzing ? '?' : grade.label}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{isAIAnalyzing ? '--' : data.totalScore}</h2>
                        <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">Total Score</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 flex flex-col gap-6">
                        <div className="card-glass p-8 flex-1 flex flex-col justify-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-3">
                                {isAIAnalyzing ? "Analyzing results..." : (data.feedbackSummary || "Session Completed")}
                            </h1>
                            <div className="flex gap-3">
                                <div className="badge-pill bg-slate-100"><Clock className="w-4 h-4" /> {data.duration}</div>
                                <div className="badge-pill bg-amber-50 text-amber-700"><Zap className="w-4 h-4" /> +{incomingData?.xpEarned} XP</div>
                            </div>
                            <div className="flex gap-3">
                                {data.commonMistakes.length === 0 ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                        <CheckCircle className="w-3 h-3" /> Excellent
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                                        <AlertCircle className="w-3 h-3" /> {data.commonMistakes.length} Issues Found
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                    Final Score: {data.totalScore}/100
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => navigate('/chat')} className="btn-secondary py-4 flex justify-center gap-2"><RefreshCw className="w-4 h-4" /> New Session</button>
                            <button onClick={handleSaveResult} disabled={isSaving} className="btn-primary py-4 flex justify-center gap-2">{isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Progress</>}</button>
                        </div>
                    </motion.div>
                </div>

                {/* 5-Column Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {metrics.map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * i }}
                            className="stats-card flex flex-col items-center text-center p-6"
                        >
                            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${metric.style}`}>
                                <metric.icon className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{metric.label}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-slate-800">
                                    {isAIAnalyzing ? '--' : (metric.score || 0)}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">/5</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-500" /> Full Transcript</h3>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                                {chatHistory && chatHistory.length > 0 ? (
                                    chatHistory.map((msg) => {
                                        const isUser = msg.role === 'user';
                                        const errors = isUser && grammarErrors ? grammarErrors[msg.id] : undefined;

                                        return (
                                            <div key={msg.id} className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex max-w-[80%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                                                    {/* AI Avatar (Only renders if !isUser) */}
                                                    {!isUser && (
                                                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0">
                                                            <Sparkles className="w-4 h-4" />
                                                        </div>
                                                    )}

                                                    {/* Message Content */}
                                                    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                                                        <span className={`text-[10px] text-slate-400 mb-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                                                            {isUser ? 'You' : 'Speaken AI'}
                                                        </span>
                                                        <div className={`
                                                            px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
                                                            ${isUser
                                                                ? 'bg-blue-50 border border-blue-100 text-slate-800 rounded-tr-none'
                                                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}
                                                        `}>
                                                            <HighlightedText text={msg.content} errors={errors} isUser={isUser} />
                                                        </div>
                                                    </div>

                                                    {/* User Avatar (Only renders if isUser) */}
                                                    {isUser && (
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                                            <div className="text-xs font-bold">YOU</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-slate-400 py-10">No transcription available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-orange-500" /> Improvements</h3>
                            <div className="space-y-3">
                                {isAIAnalyzing ? (
                                    [1, 2].map(i => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)
                                ) : data.commonMistakes.length > 0 ? (
                                    data.commonMistakes.map((item, i) => <MistakeAccordion key={i} item={item} index={i} />)
                                ) : (
                                    <div className="p-6 bg-white rounded-xl border border-dashed border-slate-200 text-center text-slate-500 text-sm">No major mistakes found.</div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-500" /> Suggestions</h3>
                            <div className="space-y-3">
                                {data.aiSuggestions.map((s, i) => (
                                    <div key={i} className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm text-indigo-900 flex gap-3">
                                        <Target className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showSaveModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><CheckCircle2 className="w-8 h-8" /></div>
                            <h2 className="text-2xl font-bold mb-2">Saved!</h2>
                            <p className="text-slate-500 mb-6">Your progress has been updated.</p>
                            <button onClick={() => navigate('/home')} className="btn-primary w-full py-3">Continue</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function BookOpen(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
    );
}

function HighlightedText({ text, errors, isUser }: { text: string, errors?: GrammarError[], isUser: boolean }) {
    if (!errors || errors.length === 0) return <>{text}</>;

    const sortedErrors = [...errors].sort((a, b) => a.start - b.start);
    const fragments: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedErrors.forEach((err, i) => {
        if (err.start > lastIndex) {
            fragments.push(text.substring(lastIndex, err.start));
        }

        const errorText = text.substring(err.start, err.end);
        fragments.push(
            <span key={i} className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded-lg border border-red-200 font-bold mx-0.5" title={err.message}>
                {errorText}
            </span>
        );
        lastIndex = err.end;
    });

    if (lastIndex < text.length) {
        fragments.push(text.substring(lastIndex));
    }

    return <>{fragments}</>;
}

function MistakeAccordion({ item, index }: { item: MistakeDetail, index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                    </div>
                    <span className="font-medium text-slate-800 text-left line-clamp-1">{item.mistake}</span>
                </div>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-slate-100 bg-white space-y-3">
                    <p className="text-sm text-slate-600"><strong className="text-slate-900">Correction:</strong> {item.correction}</p>
                    <p className="text-sm text-slate-500 italic">{item.explanation}</p>
                </div>
            )}
        </div>
    );
}
