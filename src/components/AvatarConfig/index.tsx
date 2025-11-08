import React, { useMemo, useState } from "react";
import {
  AvatarQuality,
  ElevenLabsModel,
  STTProvider,
  VoiceEmotion,
  StartAvatarRequest,
  VoiceChatTransport,
} from "@heygen/streaming-avatar";

import { Input } from "../Input";
import { Select } from "../Select";

import { Field } from "./Field";

import { AVATARS, STT_LANGUAGE_LIST } from "../../app/lib/constants";

interface AvatarConfigProps {
  onConfigChange: (config: StartAvatarRequest) => void;
  config: StartAvatarRequest;
}

export const AvatarConfig: React.FC<AvatarConfigProps> = ({
  onConfigChange,
  config,
}) => {
  const onChange = <T extends keyof StartAvatarRequest>(
    key: T,
    value: StartAvatarRequest[T],
  ) => {
    onConfigChange({ ...config, [key]: value });
  };
  const [showMore, setShowMore] = useState<boolean>(false);

  const selectedAvatar = useMemo(() => {
    const avatar = AVATARS.find(
      (avatar) => avatar.avatar_id === config.avatarName,
    );

    if (!avatar) {
      return {
        isCustom: true,
        name: "Custom Avatar ID",
        avatarId: null,
      };
    } else {
      return {
        isCustom: false,
        name: avatar.name,
        avatarId: avatar.avatar_id,
      };
    }
  }, [config.avatarName]);

  return (
    <div className="relative flex flex-col gap-4 w-full py-4 max-h-full overflow-y-auto">
      {/* Main Settings Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
        <h3 className="text-gray-800 font-semibold text-lg mb-4 text-center">Main Settings</h3>
        <div className="space-y-4">
          <Field label="Custom Knowledge Base ID">
            <Input
              placeholder="Enter custom knowledge base ID"
              value={config.knowledgeId}
              onChange={(value) => onChange("knowledgeId", value)}
              className="text-gray-800 bg-white border-blue-300 placeholder:text-gray-500"
            />
          </Field>
          <Field label="Avatar ID">
            <div className="bg-white border border-blue-300 rounded-lg">
              <Select
                isSelected={(option) =>
                  typeof option === "string"
                    ? !!selectedAvatar?.isCustom
                    : option.avatar_id === selectedAvatar?.avatarId
                }
                options={[...AVATARS, "CUSTOM"]}
                placeholder="Select Avatar"
                renderOption={(option) => {
                  return typeof option === "string"
                    ? "Custom Avatar ID"
                    : option.name;
                }}
                value={
                  selectedAvatar?.isCustom ? "Custom Avatar ID" : selectedAvatar?.name
                }
                onSelect={(option) => {
                  if (typeof option === "string") {
                    onChange("avatarName", "");
                  } else {
                    onChange("avatarName", option.avatar_id);
                  }
                }}
              />
            </div>
          </Field>
          {selectedAvatar?.isCustom && (
            <Field label="Custom Avatar ID">
              <Input
                placeholder="Enter custom avatar ID"
                value={config.avatarName}
                onChange={(value) => onChange("avatarName", value)}
                className="text-gray-800 bg-white border-blue-300 placeholder:text-gray-500"
              />
            </Field>
          )}
          <Field label="Language">
            <div className="bg-white border border-blue-300 rounded-lg">
              <Select
                isSelected={(option) => option.value === config.language}
                options={STT_LANGUAGE_LIST}
                renderOption={(option) => option.label}
                value={
                  STT_LANGUAGE_LIST.find((option) => option.value === config.language)
                    ?.label
                }
                onSelect={(option) => onChange("language", option.value)}
              />
            </div>
          </Field>
          <Field label="Avatar Quality">
            <div className="bg-white border border-blue-300 rounded-lg">
              <Select
                isSelected={(option) => option === config.quality}
                options={Object.values(AvatarQuality)}
                renderOption={(option) => option}
                value={config.quality}
                onSelect={(option) => onChange("quality", option)}
              />
            </div>
          </Field>
          <Field label="Voice Chat Transport">
            <div className="bg-white border border-blue-300 rounded-lg">
              <Select
                isSelected={(option) => option === config.voiceChatTransport}
                options={Object.values(VoiceChatTransport)}
                renderOption={(option) => option}
                value={config.voiceChatTransport}
                onSelect={(option) => onChange("voiceChatTransport", option)}
              />
            </div>
          </Field>
        </div>
      </div>

      {showMore && (
        <>
          {/* Voice Settings Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
            <h3 className="text-gray-800 font-semibold text-lg w-full text-center mb-4">
              Voice Settings
            </h3>
            <div className="space-y-4">
              <Field label="Custom Voice ID">
                <Input
                  placeholder="Enter custom voice ID"
                  value={config.voice?.voiceId}
                  onChange={(value) =>
                    onChange("voice", { ...config.voice, voiceId: value })
                  }
                  className="text-gray-800 bg-white border-purple-300 placeholder:text-gray-500"
                />
              </Field>
              <Field label="Emotion">
                <div className="bg-white border border-purple-300 rounded-lg">
                  <Select
                    isSelected={(option) => option === config.voice?.emotion}
                    options={Object.values(VoiceEmotion)}
                    renderOption={(option) => option}
                    value={config.voice?.emotion}
                    onSelect={(option) =>
                      onChange("voice", { ...config.voice, emotion: option })
                    }
                  />
                </div>
              </Field>
              <Field label="ElevenLabs Model">
                <div className="bg-white border border-purple-300 rounded-lg">
                  <Select
                    isSelected={(option) => option === config.voice?.model}
                    options={Object.values(ElevenLabsModel)}
                    renderOption={(option) => option}
                    value={config.voice?.model}
                    onSelect={(option) =>
                      onChange("voice", { ...config.voice, model: option })
                    }
                  />
                </div>
              </Field>
            </div>
          </div>
          
          {/* STT Settings Section */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-xl border border-green-200">
            <h3 className="text-gray-800 font-semibold text-lg w-full text-center mb-4">
              STT Settings
            </h3>
            <div className="space-y-4">
              <Field label="Provider">
                <div className="bg-white border border-green-300 rounded-lg">
                  <Select
                    isSelected={(option) => option === config.sttSettings?.provider}
                    options={Object.values(STTProvider)}
                    renderOption={(option) => option}
                    value={config.sttSettings?.provider}
                    onSelect={(option) =>
                      onChange("sttSettings", {
                        ...config.sttSettings,
                        provider: option,
                      })
                    }
                  />
                </div>
              </Field>
            </div>
          </div>
        </>
      )}
      
      <button
        className="text-gray-700 hover:text-gray-900 text-sm cursor-pointer w-full text-center bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 py-3 rounded-xl border border-gray-300 mt-2 font-medium transition-all duration-200"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Show less" : "Show more settings..."}
      </button>
    </div>
  );
};