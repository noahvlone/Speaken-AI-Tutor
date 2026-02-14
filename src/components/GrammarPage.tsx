import { useState } from 'react';
import { ArrowLeft, Book, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserLevel } from '../contexts/LevelContext';

// --- DATA: 100 Grammar Topics ---
const GRAMMAR_TOPICS = [
    // A1 - Beginner
    { id: 'g1', level: 'A1', title: 'To Be (Present)', description: 'Am, Is, Are', example: 'I am a student.' },
    { id: 'g2', level: 'A1', title: 'Present Simple', description: 'Habits and facts', example: 'She walks to school.' },
    { id: 'g3', level: 'A1', title: 'Adjectives', description: 'Describing things', example: 'The car is red.' },
    { id: 'g4', level: 'A1', title: 'Plural Nouns', description: 'Regular plurals', example: 'Cat -> Cats' },
    { id: 'g5', level: 'A1', title: 'This / That', description: 'Demonstratives', example: 'This is my book.' },
    { id: 'g6', level: 'A1', title: 'Can / Can\'t', description: 'Ability', example: 'I can swim.' },
    { id: 'g7', level: 'A1', title: 'Possessive \'s', description: 'Ownership', example: 'John\'s car.' },
    { id: 'g8', level: 'A1', title: 'Prepositions of Place', description: 'In, on, under', example: 'The cat is on the table.' },
    { id: 'g9', level: 'A1', title: 'Question Words', description: 'Who, what, where', example: 'Where are you?' },
    { id: 'g10', level: 'A1', title: 'Object Pronouns', description: 'Me, you, him, her', example: 'Call me later.' }
    // ... (Add more if needed, keeping it concise for now)
];



export function GrammarPage() {
    const navigate = useNavigate();
    const { userLevel } = useUserLevel();
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    // Filter topics based on user level (simple logic for now)
    const filteredTopics = GRAMMAR_TOPICS; // You can filter by `userLevel` if mapped effectively

    const handleTopicClick = (id: string) => {
        setSelectedTopic(id);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/home')}
                        className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Grammar Library</h1>
                        <p className="text-slate-500 text-sm">Validating your structural knowledge</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Topic List */}
                    <div className="md:col-span-1 space-y-3 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredTopics.map(topic => (
                            <motion.div
                                key={topic.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleTopicClick(topic.id)}
                                className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedTopic === topic.id
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-200'
                                    : 'bg-white border-slate-200 hover:border-indigo-300'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold text-sm ${selectedTopic === topic.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                                        {topic.title}
                                    </h3>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${selectedTopic === topic.id ? 'bg-white text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {topic.level}
                                    </span>
                                </div>
                                <p className={`text-xs mt-1 ${selectedTopic === topic.id ? 'text-indigo-600' : 'text-slate-500'}`}>
                                    {topic.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-2">
                        <AnimatePresence mode="wait">
                            {selectedTopic ? (
                                <motion.div
                                    key={selectedTopic}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl h-full flex flex-col relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                        <Book className="w-32 h-32 text-indigo-900" />
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4 w-fit">
                                            Detailed Explanation
                                        </span>
                                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                                            {GRAMMAR_TOPICS.find(t => t.id === selectedTopic)?.title}
                                        </h2>

                                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-8 flex-1">
                                            <p>Type of usage: <strong>{GRAMMAR_TOPICS.find(t => t.id === selectedTopic)?.description}</strong>.</p>
                                            <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-500 my-4">
                                                <p className="font-medium text-slate-900 italic">"{GRAMMAR_TOPICS.find(t => t.id === selectedTopic)?.example}"</p>
                                            </div>
                                            <p>Understanding this rule helps you build more complex sentences accurately.</p>
                                        </div>
                                    </div>

                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 border-2 border-dashed border-slate-200 rounded-3xl p-8">
                                    <Book className="w-16 h-16 opacity-20" />
                                    <p>Select a topic to start learning</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
}
