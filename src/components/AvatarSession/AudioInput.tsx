import React from "react";

import { useVoiceChat } from "../logic/useVoiceChat";
import { Button } from "../Button";
import { LoadingIcon, MicIcon, MicOffIcon } from "../Icons";
import { useConversationState } from "../logic/useConversationState";

export const AudioInput: React.FC = () => {
  const { muteInputAudio, unmuteInputAudio, isMuted, isVoiceChatLoading } =
    useVoiceChat();
  const { isUserTalking } = useConversationState();

  const handleMuteClick = () => {
    if (isMuted) {
      unmuteInputAudio();
    } else {
      muteInputAudio();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className={`absolute -inset-4 bg-gradient-to-br ${isMuted ? 'from-rose-500/20 to-orange-500/20' : 'from-emerald-500/20 to-blue-500/20'} rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <Button
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl p-0 ${isMuted
              ? "bg-rose-500 shadow-rose-200 hover:bg-rose-600"
              : "bg-gradient-to-br from-emerald-500 to-blue-600 shadow-emerald-200"
            } ${isVoiceChatLoading ? "opacity-50 cursor-not-allowed scale-95" : "hover:scale-105 active:scale-95"}`}
          disabled={isVoiceChatLoading}
          onClick={handleMuteClick}
        >
          <div
            className={`absolute inset-0 rounded-full border-4 ${isUserTalking && !isMuted
                ? "border-emerald-300 animate-ping opacity-75"
                : "border-white/20"
              }`}
          />

          {isVoiceChatLoading ? (
            <LoadingIcon className="animate-spin text-white" size={32} />
          ) : isMuted ? (
            <MicOffIcon className="text-white" size={32} />
          ) : (
            <MicIcon className="text-white" size={32} />
          )}
        </Button>
      </div>

      <div className="bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/80 shadow-sm">
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isMuted ? "text-rose-500" : "text-emerald-600"}`}>
          {isMuted ? "Audio Offline" : "Mic Monitoring..."}
        </span>
      </div>
    </div>
  );
};