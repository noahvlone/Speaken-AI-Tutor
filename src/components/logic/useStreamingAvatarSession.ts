import StreamingAvatar, {
  ConnectionQuality,
  StartAvatarRequest,
  StreamingEvents,
} from "@heygen/streaming-avatar";
import { useCallback } from "react";

import {
  StreamingAvatarSessionState,
  useStreamingAvatarContext,
} from "./context";
import { useVoiceChat } from "./useVoiceChat";
import { useMessageHistory } from "./useMessageHistory";

export const useStreamingAvatarSession = () => {
  const {
    avatarRef,
    basePath,
    sessionState,
    setSessionState,
    stream,
    setStream,
    setIsListening,
    setIsUserTalking,
    setIsAvatarTalking,
    setConnectionQuality,
    handleUserTalkingMessage,
    handleStreamingTalkingMessage,
    handleEndMessage,
    clearMessages,
  } = useStreamingAvatarContext();
  const { stopVoiceChat } = useVoiceChat();

  useMessageHistory();

  const init = useCallback(
    (token: string) => {
      avatarRef.current = new StreamingAvatar({
        token,
        basePath: basePath,
      });

      return avatarRef.current;
    },
    [basePath, avatarRef],
  );

  const handleStream = useCallback(
    ({ detail }: { detail: MediaStream }) => {
      setStream(detail);
      setSessionState(StreamingAvatarSessionState.CONNECTED);
    },
    [setSessionState, setStream],
  );

  const stop = useCallback(async () => {
    const avatar = avatarRef.current;
    if (!avatar) return;

    // Clear all event listeners to prevent any callbacks during/after cleanup
    try {
      if (typeof (avatar as any).removeAllListeners === 'function') {
        (avatar as any).removeAllListeners();
      }
    } catch (e) {
      console.warn("Could not remove all listeners:", e);
    }

    await stopVoiceChat();
    setIsListening(false);
    setIsUserTalking(false);
    setIsAvatarTalking(false);
    setStream(null);

    // Nullify early to prevent re-entry
    avatarRef.current = null;

    try {
      await avatar.stopAvatar();
    } catch (e) {
      console.warn("HeyGen stopAvatar error (can usually be ignored):", e);
    }
    setSessionState(StreamingAvatarSessionState.INACTIVE);
  }, [
    setSessionState,
    setStream,
    avatarRef,
    setIsListening,
    stopVoiceChat,
    setIsUserTalking,
    setIsAvatarTalking,
  ]);

  const start = useCallback(
    async (config: StartAvatarRequest, token?: string) => {
      if (sessionState !== StreamingAvatarSessionState.INACTIVE) {
        throw new Error("There is already an active session");
      }

      if (!avatarRef.current) {
        if (!token) {
          throw new Error("Token is required");
        }
        init(token);
      }

      const avatar = avatarRef.current;
      if (!avatar) {
        throw new Error("Avatar is not initialized");
      }

      clearMessages(); // Clear messages when STARTING a new session
      setSessionState(StreamingAvatarSessionState.CONNECTING);

      avatar.on(StreamingEvents.STREAM_READY, handleStream);
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, stop);
      avatar.on(
        StreamingEvents.CONNECTION_QUALITY_CHANGED,
        ({ detail }: { detail: ConnectionQuality }) =>
          setConnectionQuality(detail),
      );
      avatar.on(StreamingEvents.USER_START, () => {
        setIsUserTalking(true);
      });
      avatar.on(StreamingEvents.USER_STOP, () => {
        setIsUserTalking(false);
      });
      avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
        setIsAvatarTalking(true);
      });
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        setIsAvatarTalking(false);
      });
      avatar.on(
        StreamingEvents.USER_TALKING_MESSAGE,
        handleUserTalkingMessage,
      );
      avatar.on(
        StreamingEvents.AVATAR_TALKING_MESSAGE,
        handleStreamingTalkingMessage,
      );
      avatar.on(StreamingEvents.USER_END_MESSAGE, handleEndMessage);
      avatar.on(
        StreamingEvents.AVATAR_END_MESSAGE,
        handleEndMessage,
      );

      await avatar.createStartAvatar(config);

      return avatar;
    },
    [
      init,
      handleStream,
      stop,
      setSessionState,
      avatarRef,
      sessionState,
      setConnectionQuality,
      setIsUserTalking,
      handleUserTalkingMessage,
      handleStreamingTalkingMessage,
      handleEndMessage,
      setIsAvatarTalking,
      clearMessages,
    ],
  );

  return {
    avatarRef,
    sessionState,
    stream,
    initAvatar: init,
    startAvatar: start,
    stopAvatar: stop,
  };
};
