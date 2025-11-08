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
    <div className="flex justify-center">
      <Button
        className={`!p-4 relative rounded-full ${
          isMuted 
            ? "bg-red-500 hover:bg-red-600" 
            : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500"
        } text-white transition-all duration-300`}
        disabled={isVoiceChatLoading}
        onClick={handleMuteClick}
      >
        <div
          className={`absolute inset-0 rounded-full border-4 ${
            isUserTalking 
              ? "border-[#00ff88] animate-ping" 
              : "border-transparent"
          }`}
        />
        {isVoiceChatLoading ? (
          <LoadingIcon className="animate-spin" size={24} />
        ) : isMuted ? (
          <MicOffIcon size={24} />
        ) : (
          <MicIcon size={24} />
        )}
      </Button>
      
      <div className="absolute -bottom-6 text-xs text-zinc-400">
        {isMuted ? "Microphone muted" : "Click to mute"}
      </div>
    </div>
  );
};