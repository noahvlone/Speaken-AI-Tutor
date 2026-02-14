import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Book, ChevronRight, PlayCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { grammarTenses, GrammarTense } from '../lib/grammarData';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function GrammarLibraryPage() {
    const navigate = useNavigate();
    const [selectedTenseId, setSelectedTenseId] = useState<string>(grammarTenses[0].id);
    const [isPlaying, setIsPlaying] = useState<string | null>(null); // Stores the sentence currently playing

    const selectedTense = grammarTenses.find(t => t.id === selectedTenseId) || grammarTenses[0];

    const playAudio = (text: string) => {
        if (!window.speechSynthesis) {
            toast.error("Text-to-speech not supported.");
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.onstart = () => setIsPlaying(text);
        utterance.onend = () => setIsPlaying(null);
        utterance.onerror = () => setIsPlaying(null);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar List */}
            <div className="w-full md:w-80 bg-white border-r border-slate-200 h-auto md:h-screen overflow-y-auto sticky top-0 md:flex flex-col z-20">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/home')} className="-ml-2">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Button>
                    <h1 className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-2">
                        <Book className="w-5 h-5 text-indigo-600" />
                        Grammar Library
                    </h1>
                </div>

                <div className="p-4 space-y-1">
                    {grammarTenses.map((tense) => (
                        <button
                            key={tense.id}
                            onClick={() => setSelectedTenseId(tense.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${selectedTenseId === tense.id
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <span className="text-sm">{tense.name}</span>
                            {selectedTenseId === tense.id && (
                                <ChevronRight className="w-4 h-4 text-indigo-500" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 md:h-screen md:overflow-y-auto">
                <motion.div
                    key={selectedTense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-3xl mx-auto space-y-8"
                >
                    {/* Title & Desc */}
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedTense.name}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">{selectedTense.description}</p>
                    </div>

                    {/* Formula Card */}
                    <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-indigo-900 flex items-center gap-2 text-lg">
                                🏗️ Structure Formula
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                <span className="text-sm font-bold text-green-600 uppercase tracking-wide bg-green-50 px-2 py-1 rounded-md w-fit">Positive</span>
                                <code className="text-slate-800 bg-white px-3 py-2 rounded-lg border border-indigo-100 font-mono text-sm block shadow-sm">
                                    {selectedTense.formula.positive}
                                </code>

                                <span className="text-sm font-bold text-red-500 uppercase tracking-wide bg-red-50 px-2 py-1 rounded-md w-fit">Negative</span>
                                <code className="text-slate-800 bg-white px-3 py-2 rounded-lg border border-indigo-100 font-mono text-sm block shadow-sm">
                                    {selectedTense.formula.negative}
                                </code>

                                <span className="text-sm font-bold text-amber-500 uppercase tracking-wide bg-amber-50 px-2 py-1 rounded-md w-fit">Question</span>
                                <code className="text-slate-800 bg-white px-3 py-2 rounded-lg border border-indigo-100 font-mono text-sm block shadow-sm">
                                    {selectedTense.formula.interrogative}
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Examples Section */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Volume2 className="w-5 h-5 text-indigo-600" />
                            Usage Examples
                        </h3>

                        <div className="grid gap-3">
                            {selectedTense.examples.map((example, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-10 rounded-full ${example.type === 'positive' ? 'bg-green-400' :
                                                example.type === 'negative' ? 'bg-red-400' : 'bg-amber-400'
                                            }`} />
                                        <p className="text-lg text-slate-800 font-medium">{example.sentence}</p>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`rounded-full ${isPlaying === example.sentence ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}`}
                                        onClick={() => playAudio(example.sentence)}
                                    >
                                        {isPlaying === example.sentence ? (
                                            <Volume2 className="w-5 h-5 animate-pulse" />
                                        ) : (
                                            <PlayCircle className="w-5 h-5" />
                                        )}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}
