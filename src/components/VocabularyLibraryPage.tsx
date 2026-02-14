import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, BookOpen, ChevronRight, PlayCircle, Sun, Briefcase, Utensils, Plane, Smile, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { vocabularyCategories, VocabularyCategory } from '../lib/vocabularyData';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Map icon strings to components
const IconMap: { [key: string]: React.ElementType } = {
    'Sun': Sun,
    'Briefcase': Briefcase,
    'Utensils': Utensils,
    'Plane': Plane,
    'Smile': Smile,
    'MessageCircle': MessageCircle
};

export function VocabularyLibraryPage() {
    const navigate = useNavigate();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(vocabularyCategories[0].id);
    const [isPlaying, setIsPlaying] = useState<string | null>(null);

    const selectedCategory = vocabularyCategories.find(c => c.id === selectedCategoryId) || vocabularyCategories[0];

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
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        Vocab Topics
                    </h1>
                </div>

                <div className="p-4 space-y-1">
                    {vocabularyCategories.map((category) => {
                        const Icon = IconMap[category.icon] || BookOpen;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategoryId(category.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${selectedCategoryId === category.id
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-4 h-4 ${selectedCategoryId === category.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    <span className="text-sm">{category.title}</span>
                                </div>
                                {selectedCategoryId === category.id && (
                                    <ChevronRight className="w-4 h-4 text-indigo-500" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 md:h-screen md:overflow-y-auto">
                <motion.div
                    key={selectedCategory.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    {/* Header */}
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedCategory.title}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">{selectedCategory.description}</p>
                    </div>

                    {/* Word List */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                        {selectedCategory.words.map((item, idx) => (
                            <Card key={idx} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 group">
                                <CardContent className="p-6 space-y-4">
                                    {/* Top Row: Word & Audio */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-800 capitalize">{item.word}</h3>
                                            <p className="text-slate-500 font-mono text-sm mt-1">{item.phonetic}</p>
                                        </div>
                                        <Button
                                            size="icon"
                                            className={`rounded-full ${isPlaying === item.word ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600'}`}
                                            onClick={() => playAudio(item.word)}
                                        >
                                            {isPlaying === item.word ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
                                        </Button>
                                    </div>

                                    {/* Definition */}
                                    <div>
                                        <p className="text-slate-700 font-medium leading-relaxed">
                                            {item.definition}
                                        </p>
                                    </div>

                                    {/* Example */}
                                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100/50 flex flex-col gap-2">
                                        <div className="flex items-start gap-2">
                                            <p className="text-amber-800 italic text-sm flex-1 leading-relaxed">"{item.example}"</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => playAudio(item.example)}
                                                className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 uppercase tracking-wide"
                                            >
                                                <PlayCircle className="w-3 h-3" /> Listen
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
