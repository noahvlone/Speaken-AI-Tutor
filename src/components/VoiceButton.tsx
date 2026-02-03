import { Mic, Square } from 'lucide-react';
import { useState } from 'react';

interface VoiceButtonProps {
  onVoiceInput: (transcript: string) => void;
}

export function VoiceButton({ onVoiceInput }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);

  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // Simulate voice input (in real app, this would be actual speech recognition)
      onVoiceInput('Contoh input suara dari pengguna');
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  return (
    <button
      onClick={handleToggleRecording}
      className={`p-4 rounded-full shadow-md transition-all hover:shadow-lg active:scale-95 ${
        isRecording
          ? 'bg-destructive text-destructive-foreground animate-pulse'
          : 'bg-primary text-primary-foreground'
      }`}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? (
        <Square className="w-6 h-6" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </button>
  );
}
