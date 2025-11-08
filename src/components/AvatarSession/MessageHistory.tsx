import React, { useEffect, useRef } from "react";

import { useMessageHistory, MessageSender } from "../logic";

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
      className="w-full overflow-y-auto flex flex-col gap-3 px-4 py-3 self-center max-h-[200px] bg-gray-50 rounded-xl border border-gray-200"
    >
      {messages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-1 max-w-[80%] ${
              message.sender === MessageSender.CLIENT
                ? "self-end items-end"
                : "self-start items-start"
            }`}
          >
            <p className="text-xs font-medium text-gray-600 px-2">
              {message.sender === MessageSender.AVATAR ? "🤖 Avatar" : "👤 You"}
            </p>
            <div
              className={`rounded-2xl px-4 py-3 ${
                message.sender === MessageSender.CLIENT
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-white text-gray-800 border border-gray-300 shadow-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};