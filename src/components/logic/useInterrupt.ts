import { useCallback } from "react";

import { useStreamingAvatarContext } from "./context";

export const useInterrupt = () => {
  const { avatarRef } = useStreamingAvatarContext();

  const interrupt = useCallback(() => {
    if (!avatarRef.current) return;
    try {
      avatarRef.current.interrupt();
    } catch (e) {
      console.warn("Interrupt failed or not active:", e);
    }
  }, [avatarRef]);

  return { interrupt };
};
