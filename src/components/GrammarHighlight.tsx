import { AlertCircle, Sparkles, CheckCircle2, Info, XCircle, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GrammarError {
  offset: number;
  length: number;
  message: string;
  suggestion: string;
  type: 'grammar' | 'spelling' | 'style' | 'pronunciation';
  category?: string;
}

interface GrammarHighlightProps {
  text: string;
  errors: GrammarError[];
  onErrorClick: (error: GrammarError) => void;
}

export function GrammarHighlight({ text, errors, onErrorClick }: GrammarHighlightProps) {
  if (errors.length === 0) {
    return <p className="whitespace-pre-wrap leading-relaxed font-medium text-slate-700">{text}</p>;
  }

  const segments: Array<{ text: string; error?: GrammarError }> = [];
  let lastIndex = 0;

  // Sort errors by offset to process them in order
  const sortedErrors = [...errors].sort((a, b) => a.offset - b.offset);

  sortedErrors.forEach((error) => {
    // Add text before error
    if (error.offset > lastIndex) {
      segments.push({ text: text.slice(lastIndex, error.offset) });
    }
    // Add error text
    segments.push({
      text: text.slice(error.offset, error.offset + error.length),
      error,
    });
    lastIndex = error.offset + error.length;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return (
    <p className="whitespace-pre-wrap leading-relaxed font-medium text-slate-700">
      {segments.map((segment, index) => {
        if (segment.error) {
          const isPronunciation = segment.error.type === 'pronunciation';
          const styles =
            segment.error.type === 'grammar'
              ? 'bg-rose-100/80 text-rose-700 border-rose-200 shadow-sm shadow-rose-100/50'
              : segment.error.type === 'spelling'
                ? 'bg-amber-100/80 text-amber-700 border-amber-200 shadow-sm shadow-amber-100/50'
                : segment.error.type === 'pronunciation'
                  ? 'bg-indigo-100/80 text-indigo-700 border-indigo-200 shadow-sm shadow-indigo-100/50'
                  : 'bg-blue-100/80 text-blue-700 border-blue-200 shadow-sm shadow-blue-100/50';

          return (
            <motion.span
              key={index}
              whileHover={{ scale: 1.05, y: -1 }}
              className={`${styles} cursor-help transition-all rounded-full px-2.5 py-0.5 border inline-block font-bold text-[0.95em] mx-1 decoration-skip-ink-none`}
              onClick={(e) => {
                e.stopPropagation();
                onErrorClick(segment.error!);
              }}
              title={segment.error.message}
            >
              {segment.text}
            </motion.span>
          );
        }
        return <span key={index}>{segment.text}</span>;
      })}
    </p>
  );
}

interface GrammarFeedbackProps {
  error: GrammarError;
  onClose: () => void;
}

export function GrammarFeedback({ error, onClose }: GrammarFeedbackProps) {
  const config =
    error.type === 'grammar'
      ? { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', accent: 'bg-rose-500' }
      : error.type === 'spelling'
        ? { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', accent: 'bg-amber-500' }
        : error.type === 'pronunciation'
          ? { icon: Mic, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100', accent: 'bg-indigo-500' }
          : { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', accent: 'bg-blue-500' };

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden ${config.bg} border ${config.border} rounded-2xl p-5 shadow-sm mb-4 group`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.accent} opacity-70`} />

      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-xl bg-white shadow-sm ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-800">{error.type} Found</h4>
            <span className="text-[10px] font-bold text-slate-400">#SPE-AI</span>
          </div>
          <p className="text-slate-600 text-sm font-medium leading-relaxed mb-4">{error.message}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              <Sparkles className="w-3 h-3" /> Enhanced Suggestion
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white shadow-inner">
              <p className="text-blue-700 font-bold text-sm italic">"{error.suggestion}"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-white transition-colors"
        >
          Got it
        </button>
        <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white shadow-sm border border-slate-100 text-blue-600 hover:shadow-md transition-all flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Apply
        </button>
      </div>
    </motion.div>
  );
}
