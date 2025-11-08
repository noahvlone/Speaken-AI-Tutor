import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import React from "react";

import { useVoiceChat } from "../logic/useVoiceChat";
import { Button } from "../Button";
import { useInterrupt } from "../logic/useInterrupt";

import { AudioInput } from "./AudioInput";
import { TextInput } from "./TextInput";

export const AvatarControls: React.FC = () => {
  const {
    isVoiceChatLoading,
    isVoiceChatActive,
    startVoiceChat,
    stopVoiceChat,
  } = useVoiceChat();
  const { interrupt } = useInterrupt();

  return (
    <div className="flex flex-col gap-4 relative w-full items-center">
      <div className="flex flex-row items-center gap-4 w-full justify-center">
        <ToggleGroup
          className={`bg-gray-100 rounded-xl p-1 border border-gray-300 ${
            isVoiceChatLoading ? "opacity-50" : ""
          }`}
          disabled={isVoiceChatLoading}
          type="single"
          value={isVoiceChatActive || isVoiceChatLoading ? "voice" : "text"}
          onValueChange={(value) => {
            if (value === "voice" && !isVoiceChatActive && !isVoiceChatLoading) {
              startVoiceChat();
            } else if (
              value === "text" &&
              isVoiceChatActive &&
              !isVoiceChatLoading
            ) {
              stopVoiceChat();
            }
          }}
        >
          <ToggleGroupItem
            className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-blue-500 data-[state=on]:to-blue-600 data-[state=on]:text-white rounded-lg p-3 text-sm w-[100px] text-center text-gray-700 hover:text-gray-900 transition-all"
            value="voice"
          >
            🎤 Voice
          </ToggleGroupItem>
          <ToggleGroupItem
            className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-purple-500 data-[state=on]:to-purple-600 data-[state=on]:text-white rounded-lg p-3 text-sm w-[100px] text-center text-gray-700 hover:text-gray-900 transition-all"
            value="text"
          >
            ⌨️ Text
          </ToggleGroupItem>
        </ToggleGroup>

        <Button 
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white px-4 py-2 rounded-xl font-semibold transition-all"
          onClick={interrupt}
        >
          ⚡ Interrupt
        </Button>
      </div>

      <div className="w-full max-w-2xl">
        {isVoiceChatActive || isVoiceChatLoading ? <AudioInput /> : <TextInput />}
      </div>
    </div>
  );
};