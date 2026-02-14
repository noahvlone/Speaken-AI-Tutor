import { MessageSquare, Drama } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function ChatSelectionPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/30 px-4">
            <div className="max-w-4xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl mx-auto">
                        <MessageSquare className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Choose Your Learning Mode
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                        Select how you want to practice English with Esther today
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Free Chat Option */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => navigate('/chat/free')}
                        className="group relative overflow-hidden bg-white border-2 border-slate-200 rounded-3xl p-8 hover:border-blue-500 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                <MessageSquare className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                💬 Free Chat
                            </h2>

                            <p className="text-slate-600 leading-relaxed mb-6">
                                Have a casual conversation with Esther. Practice everyday English in a natural, relaxed environment.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                    Flexible Topics
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    All Levels
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                    Grammar Check
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className="text-sm font-medium text-slate-500">Start chatting now</span>
                                <span className="text-blue-600 group-hover:translate-x-2 transition-transform">→</span>
                            </div>
                        </div>
                    </motion.button>

                    {/* Roleplay Option */}
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => navigate('/chat/roleplay')}
                        className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-purple-600 rounded-3xl p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                <Drama className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">
                                🎭 Roleplay Mode
                            </h2>

                            <p className="text-purple-100 leading-relaxed mb-6">
                                Practice real-world scenarios with structured conversations. Perfect for specific situations like interviews or travel.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                                    6 Scenarios
                                </span>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                                    Structured
                                </span>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                                    Goal-Oriented
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                <span className="text-sm font-medium text-purple-100">Choose a scenario</span>
                                <span className="text-white group-hover:translate-x-2 transition-transform">→</span>
                            </div>
                        </div>
                    </motion.button>
                </div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 text-center"
                >
                    <p className="text-sm text-muted-foreground mb-4">Both modes include:</p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-slate-600">Real-time Grammar Analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="text-slate-600">AI-Powered Feedback</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span className="text-slate-600">XP Rewards</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
