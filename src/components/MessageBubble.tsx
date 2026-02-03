import { useState } from 'react';
import { Copy, Check, User, Sparkles, MessageSquare, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MarkdownMessage } from './MarkdownMessage';
import { GrammarHighlight, GrammarError } from './GrammarHighlight';

interface MessageBubbleProps {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: string;
    errors?: GrammarError[];
    isAnalyzing?: boolean;
    onErrorClick?: (error: GrammarError) => void;
}

export function MessageBubble({
    id,
    content,
    sender,
    timestamp,
    errors,
    isAnalyzing,
    onErrorClick,
}: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);
    const isUser = sender === 'user';

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} group relative`}
        >
            {/* Avatar with Glow */}
            <div className="flex-shrink-0 relative">
                <div className={`absolute -inset-1 rounded-full blur-md opacity-20 transition-opacity group-hover:opacity-40 ${isUser ? 'bg-blue-600' : 'bg-purple-600'
                    }`} />
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center relative z-10 shadow-xl transition-transform duration-500 group-hover:scale-105 ${isUser
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
                    : 'bg-white text-blue-600 border border-slate-100'
                    }`}>
                    {isUser ? <User className="w-5.5 h-5.5" /> : <Sparkles className="w-5.5 h-5.5" />}
                </div>
            </div>

            {/* Message Content Area */}
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                {/* Name & Time */}
                <div className={`flex items-center gap-2 mb-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {isUser ? 'You' : 'Esther AI'}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <Clock className="w-3 h-3" />
                        {timestamp}
                    </div>
                </div>

                {/* Main Bubble */}
                <div className="relative">
                    <div
                        className={`relative px-6 py-4 rounded-3xl shadow-xl transition-all duration-500 ${isUser
                            ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-blue-200/50'
                            : 'bg-white border border-slate-100 text-slate-800 hover:shadow-2xl shadow-slate-200/30'
                            } ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                    >
                        {/* Interactive Tools */}
                        <div className={`absolute top-3 ${isUser ? 'left-3' : 'right-3'} flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                            <button
                                onClick={handleCopy}
                                className={`p-1.5 rounded-xl transition-all ${isUser ? 'hover:bg-white/20 text-white/70' : 'hover:bg-slate-100 text-slate-400'
                                    }`}
                                title="Copy"
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="mt-0.5">
                            {isUser && errors && errors.length > 0 ? (
                                <GrammarHighlight text={content} errors={errors} onErrorClick={onErrorClick!} />
                            ) : isUser ? (
                                <p className="text-white leading-relaxed font-medium">{content}</p>
                            ) : (
                                <div className="prose prose-sm max-w-none prose-slate prose-p:text-slate-700 prose-p:font-medium prose-p:leading-relaxed prose-strong:text-blue-600 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:rounded prose-code:text-indigo-600 prose-headings:text-slate-900">
                                    <MarkdownMessage text={content} />
                                </div>
                            )}
                        </div>

                        {/* Analysis Status */}
                        <AnimatePresence>
                            {isAnalyzing && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 flex items-center gap-2 pt-3 border-t border-white/10"
                                >
                                    <div className="flex gap-1">
                                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Refining grammar...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Summary Widget */}
                        {isUser && errors && errors.length > 0 && !isAnalyzing && (
                            <button
                                onClick={() => onErrorClick && onErrorClick(errors[0])}
                                className="mt-4 w-full flex items-center justify-between gap-3 px-3 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/20 transition-all border border-white/10"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-amber-400 rounded-lg flex items-center justify-center text-slate-900 shadow-sm">
                                        <Sparkles className="w-3 h-3" />
                                    </div>
                                    <span>{errors.length} Optimization Suggs</span>
                                </div>
                                <Check className="w-3 h-3 opacity-50" />
                            </button>
                        )}
                    </div>

                    {/* Visual Tail Indicator (Optional premium touch) */}
                    <div className={`absolute top-0 w-4 h-4 overflow-hidden ${isUser ? '-right-2' : '-left-2'}`}>
                        <div className={`w-3 h-3 rotate-45 transform origin-top ${isUser ? 'bg-indigo-800' : 'bg-white border-l border-t border-slate-100'
                            }`} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default MessageBubble;
