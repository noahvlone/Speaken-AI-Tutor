import { useCallback } from "react";
import { toast } from "sonner";

import { useStreamingAvatarContext } from "./context";

export const useVoiceChat = () => {
  const {
    avatarRef,
    isMuted,
    setIsMuted,
    isVoiceChatActive,
    setIsVoiceChatActive,
    isVoiceChatLoading,
    setIsVoiceChatLoading,
  } = useStreamingAvatarContext();

  const startVoiceChat = useCallback(
    async (isInputAudioMuted?: boolean) => {
      if (!avatarRef.current || isVoiceChatLoading || isVoiceChatActive) return;

      setIsVoiceChatLoading(true);
      try {
        await avatarRef.current.startVoiceChat({
          isInputAudioMuted,
        });
        setIsVoiceChatActive(true);
        setIsMuted(!!isInputAudioMuted);
      } catch (error) {
        console.error("Failed to start voice chat:", error);
        toast.error("Could not activate voice mode. Check perms/network.");
      } finally {
        setIsVoiceChatLoading(false);
      }
    },
    [avatarRef, isVoiceChatLoading, isVoiceChatActive, setIsMuted, setIsVoiceChatActive, setIsVoiceChatLoading],
  );

  const stopVoiceChat = useCallback(async () => {
    if (!avatarRef.current) return;

    // Guard: If we think we're not active, try to close anyway but expect it might be 400
    // Actually, relying on isVoiceChatActive to skip is safer for reducing 400s
    if (!isVoiceChatActive) return;

    try {
      await avatarRef.current.closeVoiceChat();
    } catch (error) {
      console.warn("Failed to close voice chat (likely already closed):", error);
    }
    setIsVoiceChatActive(false);
    setIsMuted(true);
  }, [avatarRef, isVoiceChatActive, setIsMuted, setIsVoiceChatActive]);

  const muteInputAudio = useCallback(() => {
    if (!avatarRef.current || !isVoiceChatActive) return;
    try {
      avatarRef.current.muteInputAudio();
      setIsMuted(true);
    } catch (e) {
      console.warn("Mute error:", e);
    }
  }, [avatarRef, isVoiceChatActive, setIsMuted]);

  const unmuteInputAudio = useCallback(() => {
    if (!avatarRef.current || !isVoiceChatActive) return;
    try {
      avatarRef.current.unmuteInputAudio();
      setIsMuted(false);
    } catch (e) {
      console.warn("Unmute error:", e);
    }
  }, [avatarRef, isVoiceChatActive, setIsMuted]);

  return {
    startVoiceChat,
    stopVoiceChat,
    muteInputAudio,
    unmuteInputAudio,
    isMuted,
    isVoiceChatActive,
    isVoiceChatLoading,
  };
};
