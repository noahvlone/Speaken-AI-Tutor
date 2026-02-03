import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ChatMessageProps {
  message: string;
  sender: 'user' | 'ai';
  timestamp: string;
  avatarUrl?: string;
}

export function ChatMessage({ message, sender, timestamp, avatarUrl }: ChatMessageProps) {
  const isUser = sender === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}>
      <Avatar className="w-10 h-10 ring-2 ring-border">
        <AvatarImage src={avatarUrl} alt={sender} />
        <AvatarFallback>{isUser ? 'U' : 'AI'}</AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%] md:max-w-[65%]`}>
        <div
          className={`px-6 py-4 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-white border border-border'
          }`}
        >
          <p className="whitespace-pre-wrap">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-2 px-2">{timestamp}</span>
      </div>
    </div>
  );
}
