import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface Mistake {
    mistake: string;
    explanation: string;
    correction: string;
}

interface TranscriptHighlighterProps {
    transcript: string;
    mistakes: Mistake[];
    className?: string;
}

export function TranscriptHighlighter({ transcript, mistakes, className }: TranscriptHighlighterProps) {
    const defaultClasses = "whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-700";
    const finalClass = className || defaultClasses;

    if (!transcript) return null;
    if (!mistakes || mistakes.length === 0) {
        return <div className={finalClass}>{transcript}</div>;
    }

    // Helper to escape regex special characters
    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // We process the transcript line by line to preserve structure, or just as a whole.
    // Processing as a whole allows multiline matches if necessary, but lines usually suffice.
    // Let's process as whole string to be safe.

    // We need to iterate over mistakes and tokenize the string.
    // Since highlights might overlap (unlikely) or be distinct.
    // A simple way is to build a regex that matches ANY of the mistakes.

    // Sort mistakes by length (descending) to match longest phrase first if there are subsets.
    const sortedMistakes = [...mistakes].sort((a, b) => b.mistake.length - a.mistake.length);

    // Filter out empty mistakes
    const validMistakes = sortedMistakes.filter(m => m.mistake && m.mistake.trim().length > 0);

    if (validMistakes.length === 0) {
        return <div className={finalClass}>{transcript}</div>;
    }

    // Create a regex that matches any of the mistake strings
    // We capture the matched group to know WHICH one it was
    const pattern = new RegExp(`(${validMistakes.map(m => escapeRegExp(m.mistake)).join('|')})`, 'gi');

    const parts = transcript.split(pattern);

    return (
        <div className={finalClass}>
            {parts.map((part, index) => {
                // Check if this part matches one of our mistakes (case insensitive)
                const matchedMistake = validMistakes.find(m => m.mistake.toLowerCase() === part.toLowerCase());

                if (matchedMistake) {
                    return (
                        <TooltipProvider key={index}>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <span className="cursor-help border-b-2 border-red-500 bg-red-100/50 text-red-900 px-0.5 rounded transition-colors hover:bg-red-200">
                                        {part}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white p-3 shadow-xl border border-red-100 rounded-lg text-xs max-w-[280px] z-50 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-red-100 text-red-700">
                                            Correction Needed
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-slate-600 italic">"{matchedMistake.mistake}"</p>
                                        <p className="text-emerald-600 font-bold">➔ {matchedMistake.correction}</p>
                                        <p className="text-slate-500 text-[10px] leading-snug pt-1 border-t border-slate-100 mt-1">
                                            {matchedMistake.explanation}
                                        </p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
}
