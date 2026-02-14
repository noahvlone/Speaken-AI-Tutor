import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, ArrowRight, BookOpen, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { toast } from 'sonner';
import { useUserLevel } from '../contexts/LevelContext';
import { generateVocabularyChallenges, VocabularyChallenge } from '../lib/challengeGenerator';
import { motion, AnimatePresence } from 'framer-motion';

export function VocabularyPage() {
    const navigate = useNavigate();
    const { userLevel } = useUserLevel();

    const [vocabList, setVocabList] = useState<VocabularyChallenge[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        loadVocabulary();
    }, [userLevel]);

    const loadVocabulary = async () => {
        setIsLoading(true);
        try {
            const data = await generateVocabularyChallenges(userLevel || 'beginner', 5);
            setVocabList(data);
            setCurrentIndex(0);
        } catch (error) {
            toast.error("Failed to load vocabulary.");
        } finally {
            setIsLoading(false);
        }
    };

    const currentItem = vocabList[currentIndex];

    const playAudio = (text: string) => {
        if (!window.speechSynthesis) {
            toast.error("Text-to-speech not supported in this browser.");
            return;
        }

        // Cancel any current speaking
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9; // Slightly slower for clarity

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
    };

    const handleNext = () => {
        if (currentIndex < vocabList.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Re-fetch or finish
            toast.info("Loading more words...");
            loadVocabulary();
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"
                />
                <p className="text-slate-600 font-medium">Curating vocabulary for you...</p>
            </div>
        );
    }

    if (!currentItem) return null;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans flex flex-col items-center">
            {/* Header */}
            <div className="max-w-md w-full mb-8 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => navigate('/challenge')} className="hover:bg-white/50">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Button>
                <div className="flex flex-col items-center">
                    <h1 className="font-bold text-xl text-slate-900">Vocabulary Builder</h1>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider mt-1">{userLevel} Level</span>
                </div>
                <div className="w-10" />
            </div>

            <motion.div
                key={currentIndex} // Re-animate on change
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-md w-full"
            >
                <Card className="shadow-xl bg-white border-none overflow-hidden rounded-3xl relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />

                    <CardContent className="p-8 pt-10 flex flex-col items-center text-center space-y-6">

                        {/* Word Section */}
                        <div className="relative">
                            <motion.h2
                                className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                            >
                                {currentItem.word}
                            </motion.h2>
                            <span className="text-sm font-medium text-slate-400 mt-2 block">{currentItem.context}</span>
                        </div>

                        {/* Audio Button */}
                        <Button
                            size="lg"
                            variant="outline"
                            className={`rounded-full w-16 h-16 p-0 border-2 ${isPlaying ? 'border-indigo-400 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'} transition-all duration-300`}
                            onClick={() => playAudio(`${currentItem.word}. ${currentItem.example}`)}
                        >
                            <Volume2 className={`w-8 h-8 ${isPlaying ? 'animate-pulse' : ''}`} />
                        </Button>

                        <div className="w-full h-px bg-slate-100" />

                        {/* Definition & Example */}
                        <div className="space-y-4 w-full text-left">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
                                    <BookOpen className="w-4 h-4 text-blue-500" />
                                    <span>Definition</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed">{currentItem.definition}</p>
                            </div>

                            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                                <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold">
                                    <Sparkles className="w-4 h-4 text-indigo-500" />
                                    <span>Example</span>
                                </div>
                                <p className="text-indigo-800 italic leading-relaxed">"{currentItem.example}"</p>
                            </div>
                        </div>

                    </CardContent>

                    <CardFooter className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between gap-4">
                        <Button variant="ghost" className="text-slate-400 hover:text-slate-600" onClick={loadVocabulary}>
                            <RefreshCw className="w-5 h-5 mr-2" />
                            <span className="hidden sm:inline">Refresh List</span>
                        </Button>
                        <Button
                            className="flex-1 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl h-12 shadow-sm"
                            onClick={handleNext}
                        >
                            Next Word
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>

            <p className="mt-8 text-center text-slate-400 text-sm">
                Tap the speaker icon to hear the pronunciation.
            </p>
        </div>
    );
}
