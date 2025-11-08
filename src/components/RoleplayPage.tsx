import {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
} from "@heygen/streaming-avatar";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, useUnmount } from "ahooks";

import { Button } from "./Button";
import { AvatarConfig } from "./AvatarConfig";
import { AvatarVideo } from "./AvatarSession/AvatarVideo";
import { useStreamingAvatarSession } from "./logic/useStreamingAvatarSession";
import { AvatarControls } from "./AvatarSession/AvatarControls";
import { useVoiceChat } from "./logic/useVoiceChat";
import { StreamingAvatarProvider, StreamingAvatarSessionState } from "./logic";
import { LoadingIcon } from "./Icons";
import { MessageHistory } from "./AvatarSession/MessageHistory";

import { AVATARS } from "../app/lib/constants";

const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.Low,
  avatarName: AVATARS[0].avatar_id,
  knowledgeId: undefined,
  voice: {
    rate: 1.5,
    emotion: VoiceEmotion.EXCITED,
    model: ElevenLabsModel.eleven_flash_v2_5,
  },
  language: "en",
  voiceChatTransport: VoiceChatTransport.WEBSOCKET,
  sttSettings: {
    provider: STTProvider.DEEPGRAM,
  },
};

function InteractiveAvatar() {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } =
    useStreamingAvatarSession();
  const { startVoiceChat } = useVoiceChat();

  const [config, setConfig] = useState<StartAvatarRequest>(DEFAULT_CONFIG);

  const mediaStream = useRef<HTMLVideoElement>(null);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/heygen/token");
      const { token } = await response.json();

      console.log("Access Token:", token);

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }

  const startSessionV2 = useMemoizedFn(async (isVoiceChat: boolean) => {
    try {
      const newToken = await fetchAccessToken();
      const avatar = initAvatar(newToken);

      avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        console.log("Avatar started talking", e);
      });
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        console.log("Avatar stopped talking", e);
      });
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
      });
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        console.log(">>>>> Stream ready:", event.detail);
      });
      avatar.on(StreamingEvents.USER_START, (event) => {
        console.log(">>>>> User started talking:", event);
      });
      avatar.on(StreamingEvents.USER_STOP, (event) => {
        console.log(">>>>> User stopped talking:", event);
      });
      avatar.on(StreamingEvents.USER_END_MESSAGE, (event) => {
        console.log(">>>>> User end message:", event);
      });
      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
        console.log(">>>>> User talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
        console.log(">>>>> Avatar talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
        console.log(">>>>> Avatar end message:", event);
      });

      await startAvatar(config);

      if (isVoiceChat) {
        await startVoiceChat();
      }
    } catch (error) {
      console.error("Error starting avatar session:", error);
    }
  });

  useUnmount(() => {
    stopAvatar();
  });

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  // Dalam komponen InteractiveAvatar, ganti bagian return-nya dengan:
return (
  <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-6 bg-white">
    {/* Header Section */}
    <div className="text-center">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        AI Tutor Roleplay
      </h1>
      <p className="text-gray-600 mt-2">
        Interact with your AI tutor through voice or text
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Avatar Section */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 overflow-hidden shadow-lg">
          <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
            {sessionState !== StreamingAvatarSessionState.INACTIVE ? (
              <AvatarVideo ref={mediaStream} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <AvatarConfig config={config} onConfigChange={setConfig} />
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-4 items-center justify-center p-6 border-t border-gray-200 w-full bg-white">
            {sessionState === StreamingAvatarSessionState.CONNECTED ? (
              <AvatarControls />
            ) : sessionState === StreamingAvatarSessionState.INACTIVE ? (
              <div className="flex flex-row gap-4">
                <Button 
                  onClick={() => startSessionV2(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  🎤 Start Voice Chat
                </Button>
                <Button 
                  onClick={() => startSessionV2(false)}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  ⌨️ Start Text Chat
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <LoadingIcon className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-gray-600">Connecting to avatar...</p>
              </div>
            )}
          </div>
        </div>

        {/* Message History */}
        {sessionState === StreamingAvatarSessionState.CONNECTED && (
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversation</h3>
            <MessageHistory />
          </div>
        )}
      </div>

      {/* Side Panel - Configuration & Status */}
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Avatar Settings</h3>
          {sessionState === StreamingAvatarSessionState.INACTIVE && (
            <AvatarConfig config={config} onConfigChange={setConfig} />
          )}
          {sessionState !== StreamingAvatarSessionState.INACTIVE && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-green-600 font-medium">Avatar Connected</p>
              <p className="text-gray-600 text-sm mt-1">Session is active</p>
            </div>
          )}
        </div>

        {/* Status Panel */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Connection:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                sessionState === StreamingAvatarSessionState.CONNECTED 
                  ? "bg-green-100 text-green-700" 
                  : sessionState === StreamingAvatarSessionState.INACTIVE
                  ? "bg-gray-100 text-gray-600"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {sessionState}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mode:</span>
              <span className="text-gray-800 text-sm font-medium">
                {config.voiceChatTransport === VoiceChatTransport.WEBSOCKET ? "Voice Chat" : "Text Chat"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quality:</span>
              <span className="text-gray-800 text-sm font-medium">{config.quality}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export function RoleplayPage() {
  return (
    <StreamingAvatarProvider>
      <InteractiveAvatar />
    </StreamingAvatarProvider>
  );
}

export default RoleplayPage;