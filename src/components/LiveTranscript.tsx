import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare } from 'lucide-react';

interface LiveTranscriptProps {
  text: string;
  isActive: boolean;
}

export function LiveTranscript({ text, isActive }: LiveTranscriptProps) {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const words = text.split(' ');

  useEffect(() => {
    if (!isActive) {
      setDisplayedWords([]);
      return;
    }

    setDisplayedWords([]);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedWords((prev) => [...prev, words[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 200); // Word appears every 200ms

    return () => clearInterval(interval);
  }, [text, isActive]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/20">
        <MessageSquare className="w-5 h-5 text-cyan-400" />
        <h3 className="text-white">Live Transcript</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-1">
        {displayedWords.length === 0 ? (
          <div className="text-white/50 text-center py-12">
            <p>Start speaking to see live transcription...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {displayedWords.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block mr-2 text-white text-lg"
                >
                  {word}
                </motion.span>
              ))}
            </AnimatePresence>

            {isActive && displayedWords.length > 0 && (
              <motion.span
                className="inline-block w-1 h-5 bg-cyan-400 ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
