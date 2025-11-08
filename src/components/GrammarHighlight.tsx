import { AlertCircle } from 'lucide-react';

interface GrammarError {
  start: number;
  end: number;
  message: string;
  suggestion: string;
  type: 'grammar' | 'spelling' | 'style';
}

interface GrammarHighlightProps {
  text: string;
  errors: GrammarError[];
  onErrorClick: (error: GrammarError) => void;
}

export function GrammarHighlight({ text, errors, onErrorClick }: GrammarHighlightProps) {
  if (errors.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  const segments: Array<{ text: string; error?: GrammarError }> = [];
  let lastIndex = 0;

  // Sort errors by start position
  const sortedErrors = [...errors].sort((a, b) => a.start - b.start);

  sortedErrors.forEach((error) => {
    // Add text before error
    if (error.start > lastIndex) {
      segments.push({ text: text.slice(lastIndex, error.start) });
    }
    // Add error text
    segments.push({
      text: text.slice(error.start, error.end),
      error,
    });
    lastIndex = error.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return (
    <p className="whitespace-pre-wrap">
      {segments.map((segment, index) => {
        if (segment.error) {
          const colorClass =
            segment.error.type === 'grammar'
              ? 'bg-red-100 text-red-900 border-b-2 border-red-500'
              : segment.error.type === 'spelling'
              ? 'bg-orange-100 text-orange-900 border-b-2 border-orange-500'
              : 'bg-blue-100 text-blue-900 border-b-2 border-blue-500';

          return (
            <span
              key={index}
              className={`${colorClass} cursor-pointer hover:opacity-80 transition-opacity rounded px-0.5`}
              onClick={() => onErrorClick(segment.error!)}
              title={segment.error.message}
            >
              {segment.text}
            </span>
          );
        }
        return <span key={index}>{segment.text}</span>;
      })}
    </p>
  );
}

interface GrammarFeedbackProps {
  error: GrammarError;
  onClose: () => void;
}

export function GrammarFeedback({ error, onClose }: GrammarFeedbackProps) {
  const colorClass =
    error.type === 'grammar'
      ? 'border-red-500 bg-red-50'
      : error.type === 'spelling'
      ? 'border-orange-500 bg-orange-50'
      : 'border-blue-500 bg-blue-50';

  return (
    <div className={`${colorClass} border-l-4 rounded-xl p-6 shadow-sm mb-4`}>
      <div className="flex items-start gap-3 mb-3">
        <AlertCircle className="w-5 h-5 mt-0.5 text-destructive" />
        <div className="flex-1">
          <h4 className="mb-1 capitalize">{error.type} Error</h4>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      </div>
      <div className="ml-8">
        <p className="mb-1">Suggestion:</p>
        <p className="bg-white rounded-lg px-4 py-2 border border-border">{error.suggestion}</p>
      </div>
    </div>
  );
}
