import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, Send, Star, Zap, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { useUserLevel } from '../contexts/LevelContext';
import { analyzeGrammarWithAI, GrammarError } from '../lib/grammarAI';
import { getCurrentUser } from '../utils/supabase/client';
import { useDailyChallenges } from '../hooks/useDailyChallenges';
import { generateGrammarChallenges } from '../lib/challengeGenerator';
import { motion, AnimatePresence } from 'framer-motion';

export function GrammarChallengePage() {
    const navigate = useNavigate();
    const { userLevel } = useUserLevel();
    const [userId, setUserId] = useState<string | null>(null);
    const { completeQuest } = useDailyChallenges(userId);

    const [challenges, setChallenges] = useState<{ instruction: string; hint: string; example?: string }[]>([]);
    const [isLoadingChallenges, setIsLoadingChallenges] = useState(true);

    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [input, setInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errors, setErrors] = useState<GrammarError[] | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        getCurrentUser().then(user => {
            if (user) setUserId(user.id);
        });
    }, []);

    // Get mode from URL
    const [searchParams] = useSearchParams();
    const mode = (searchParams.get('mode') as 'daily' | 'weekly' | 'monthly') || 'daily';

    // Fetch dynamic challenges
    useEffect(() => {
        const fetchChallenges = async () => {
            setIsLoadingChallenges(true);
            try {
                const level = userLevel?.toLowerCase() || 'beginner';
                // Generates challenges based on mode
                // Base count is 10 for daily, but generator handles weekly/monthly overrides
                const data = await generateGrammarChallenges(level, 10, mode);
                setChallenges(data);
                setCurrentPromptIndex(0);
                setInput('');
                setErrors(null);
                setIsCorrect(false);
            } catch (error) {
                console.error("Failed to load challenges", error);
                toast.error("Failed to load challenges. Please refresh or try again.");
            } finally {
                setIsLoadingChallenges(false);
            }
        };

        fetchChallenges();
    }, [userLevel]);

    const currentPrompt = challenges[currentPromptIndex];
    const totalPrompts = challenges.length;

    // Reset when moving to next prompt
    const nextPrompt = async () => {
        if (currentPromptIndex < totalPrompts - 1) {
            setCurrentPromptIndex(prev => prev + 1);
            setInput('');
            setErrors(null);
            setIsCorrect(false);
        } else {
            // Finish quest
            await completeQuest('Grammar', mode);
            toast.success("All grammar challenges completed! XP Earned!");
            setTimeout(() => navigate('/challenge'), 2000);
        }
    };

    const handleCheck = async () => {
        if (!input.trim()) return;
        if (input.trim().split(' ').length < 3) {
            toast.error("Please write a complete sentence (at least 3 words).");
            return;
        }

        setIsAnalyzing(true);
        setErrors(null);

        try {
            const results = await analyzeGrammarWithAI(input);
            setErrors(results);

            if (results.length === 0) {
                setIsCorrect(true);
                toast.success("Perfect! No grammar errors found.");
            } else {
                setIsCorrect(false);
                toast.info(`Found ${results.length} issue(s). Check the feedback.`);
            }
        } catch (error) {
            toast.error("Failed to analyze grammar. Try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isLoadingChallenges) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"
                />
                <p className="text-slate-600 font-medium">Generating grammar challenges for {userLevel} level...</p>
                <p className="text-slate-400 text-sm mt-2">Powered by AI</p>
            </div>
        );
    }

    if (!currentPrompt) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
                <p className="text-slate-600 mb-4">No challenges available.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans flex flex-col items-center">
            {/* Header */}
            <div className="max-w-3xl w-full mb-8 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => navigate('/challenge')} className="hover:bg-white/50">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Button>

                <div className="flex flex-col items-center">
                    <h1 className="font-bold text-xl text-slate-900 tracking-tight">Grammar Challenge</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{mode} • {userLevel}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-xs text-slate-500 font-medium">Question {currentPromptIndex + 1} of {totalPrompts}</span>
                    </div>
                </div>

                <div className="w-10" />
            </div>

            <motion.div
                key={currentPromptIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-3xl w-full"
            >
                <Card className="shadow-xl shadow-slate-200/50 border-white/60 bg-white/80 backdrop-blur-xl overflow-hidden rounded-3xl">
                    {/* New Clean Header */}
                    <div className="p-8 pb-6 border-b border-slate-100/50">
                        <div className="flex items-start gap-5">
                            <div className="bg-indigo-600 p-3.5 rounded-2xl shadow-lg shadow-indigo-200 rotate-3 transition-transform hover:rotate-0 duration-300">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                                    Write a sentence...
                                </h2>
                                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                    {currentPrompt.instruction}
                                </p>
                            </div>
                        </div>

                        {currentPrompt.hint && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-6 flex flex-col gap-3"
                            >
                                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-amber-50 text-amber-900/80 text-sm font-medium rounded-xl border border-amber-100/50 w-fit">
                                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <span>Tip: {currentPrompt.hint}</span>
                                </div>

                                {currentPrompt.example && (
                                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-50 text-blue-900/80 text-sm font-medium rounded-xl border border-blue-100/50 w-fit">
                                        <Star className="w-4 h-4 text-blue-500" />
                                        <span>Example: "{currentPrompt.example}"</span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    <CardContent className="p-8 pt-6 space-y-6">
                        <div className="relative">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your sentence here..."
                                className="min-h-[160px] text-lg p-5 resize-none bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all duration-200 leading-relaxed placeholder:text-slate-400"
                                disabled={isCorrect || isAnalyzing}
                                spellCheck={false}
                            />

                            <AnimatePresence>
                                {isCorrect && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg shadow-green-200"
                                    >
                                        <CheckCircle2 className="w-6 h-6" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Feedback Area */}

                        <AnimatePresence>
                            {errors && errors.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 space-y-4">
                                        <div className="flex items-center gap-2 text-red-700 font-bold">
                                            <AlertCircle className="w-5 h-5" />
                                            <span>Feedback & Suggestions</span>
                                        </div>
                                        <div className="grid gap-3">
                                            {errors.map((err, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="bg-white p-4 rounded-xl border border-red-100 shadow-sm text-sm"
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-md uppercase">{err.type}</span>
                                                    </div>
                                                    <p className="text-slate-600 text-base mb-1">{err.message}</p>
                                                    <div className="text-slate-500 text-sm bg-slate-50 p-2 rounded-lg inline-block">
                                                        Try: <span className="font-bold text-green-600">{err.suggestion}</span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {isCorrect && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50/80 border border-green-100 rounded-2xl p-6 text-center"
                                >
                                    <h3 className="text-green-800 font-bold text-xl mb-1 flex items-center justify-center gap-2">
                                        <Star className="w-5 h-5 text-green-600" />
                                        Excellent Work!
                                    </h3>
                                    <p className="text-green-700 font-medium">Your sentence is grammatically correct.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>

                    <CardFooter className="p-8 pt-2 bg-transparent">
                        {!isCorrect ? (
                            <Button
                                className="w-full h-14 text-lg font-black bg-amber-400 hover:bg-amber-500 shadow-xl shadow-amber-100 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 border-b-4 border-amber-600 active:border-b-0"
                                style={{ color: '#0f172a' }} // Explicit Slate-900 hex
                                onClick={handleCheck}
                                disabled={!input.trim() || isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
                                        <span style={{ color: '#0f172a' }}>Analyzing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span style={{ color: '#0f172a' }}>Check My Grammar</span>
                                        <Send className="w-5 h-5 text-slate-900" />
                                    </div>
                                )}
                            </Button>
                        ) : (
                            <Button
                                className="w-full h-14 text-lg font-black bg-emerald-400 hover:bg-emerald-500 shadow-xl shadow-emerald-100 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 border-b-4 border-emerald-600 active:border-b-0"
                                style={{ color: '#0f172a' }} // Explicit Slate-900 hex
                                onClick={nextPrompt}
                            >
                                <div className="flex items-center gap-2">
                                    <span style={{ color: '#0f172a' }}>Next Challenge</span>
                                    <ArrowRight className="w-5 h-5 text-slate-900" />
                                </div>
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
