import React, { useEffect, useRef } from "react";
import { useMessageHistory, MessageSender } from "../logic";
import { AnalysisResult } from "../../lib/grammarService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

// Helper to highlight text
const HighlightText = ({ text, feedback }: { text: string; feedback?: AnalysisResult }) => {
  if (!feedback || !feedback.items || feedback.items.length === 0) {
    return <span>{text}</span>;
  }

  // Strategy: Find all occurrences and highlight them.
  // Note: This matches simple substrings. Multiple occurrences of the same word will all be highlighted.

  let parts: React.ReactNode[] = [text];

  feedback.items.forEach((item, idx) => {
    const newParts: React.ReactNode[] = [];
    parts.forEach((part) => {
      if (typeof part === 'string') {
        // Escape special regex chars if any
        const escapedOriginal = item.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const split = part.split(new RegExp(`(${escapedOriginal})`, 'i'));

        if (split.length > 1) {
          split.forEach((s, k) => {
            if (s.toLowerCase() === item.original.toLowerCase()) {
              // This part matches the error/suggestion
              newParts.push(
                <TooltipProvider key={`${idx}-${k}`}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span className={`cursor-help border-b-2 ${item.type === 'grammar' ? 'border-red-500 bg-red-100/50' : 'border-blue-500 bg-blue-100/50'}`}>
                        {s}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white p-3 shadow-xl border rounded-lg text-xs max-w-[240px] z-50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${item.type === 'grammar' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-gray-900 font-semibold text-sm mb-1">
                        {item.suggestion}
                      </p>
                      {item.explanation && <p className="text-gray-500 italic leading-snug">{item.explanation}</p>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            } else {
              newParts.push(s);
            }
          });
        } else {
          newParts.push(part);
        }
      } else {
        newParts.push(part);
      }
    });
    parts = newParts;
  });

  return <>{parts}</>;
};

export const MessageHistory: React.FC = () => {
  const { messages } = useMessageHistory();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || messages.length === 0) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-y-auto flex flex-col gap-3 px-4 py-3 self-center h-[500px] bg-gray-50/50 rounded-xl border border-gray-200 scroll-smooth"
    >
      {messages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-1 max-w-[85%] ${message.sender === MessageSender.CLIENT
              ? "self-end items-end"
              : "self-start items-start"
              }`}
          >
            <p className="text-xs font-medium text-gray-600 px-2">
              {message.sender === MessageSender.AVATAR ? "🤖 AI Tutor" : "👤 You"}
            </p>
            <div
              className={`rounded-2xl px-4 py-3 ${message.sender === MessageSender.CLIENT
                ? "bg-white text-gray-800 border border-blue-200 shadow-sm"
                : "bg-white text-gray-800 border border-gray-300 shadow-sm"
                }`}
            >
              <p className="text-sm leading-relaxed">
                {message.sender === MessageSender.CLIENT ? (
                  <HighlightText text={message.content} feedback={message.feedback} />
                ) : (
                  message.content
                )}
              </p>
            </div>

            {message.sender === MessageSender.CLIENT && message.feedback && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs w-full shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">

                {message.feedback.generalFeedback && (
                  <p className="text-gray-600 italic mb-2">"{message.feedback.generalFeedback}"</p>
                )}

                {message.feedback.pronunciationTips && message.feedback.pronunciationTips.length > 0 && (
                  <div className="flex gap-2 items-start mt-1">
                    <span className="shrink-0 text-purple-600 font-bold">🗣️ Tips:</span>
                    <ul className="text-purple-700 space-y-0.5 list-disc pl-4">
                      {message.feedback.pronunciationTips.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};