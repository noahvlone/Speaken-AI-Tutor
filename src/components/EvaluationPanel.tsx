import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Progress } from './ui/progress';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

export interface EvaluationScore {
  pronunciation: number;
  fluency: number;
  accuracy: number;
  prosody: number;
}

export interface PhonemeError {
  phoneme: string;
  expected: string;
  actual: string;
  position: number;
}

export interface EvaluationData {
  scores: EvaluationScore;
  transcript: string;
  duration: number;
  wordsPerMinute: number;
  phonemeErrors: PhonemeError[];
  feedback: string[];
}

interface EvaluationPanelProps {
  evaluation: EvaluationData;
  onReplay: () => void;
}

export function EvaluationPanel({ evaluation, onReplay }: EvaluationPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const radarData = [
    { skill: 'Pronunciation', value: evaluation.scores.pronunciation },
    { skill: 'Fluency', value: evaluation.scores.fluency },
    { skill: 'Accuracy', value: evaluation.scores.accuracy },
    { skill: 'Prosody', value: evaluation.scores.prosody },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Overall Scores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-muted-foreground mb-2">Pronunciation</p>
          <div className={`text-3xl ${getScoreColor(evaluation.scores.pronunciation)} mb-2`}>
            {evaluation.scores.pronunciation}
          </div>
          <Progress value={evaluation.scores.pronunciation} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {getScoreLabel(evaluation.scores.pronunciation)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-muted-foreground mb-2">Fluency</p>
          <div className={`text-3xl ${getScoreColor(evaluation.scores.fluency)} mb-2`}>
            {evaluation.scores.fluency}
          </div>
          <Progress value={evaluation.scores.fluency} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {getScoreLabel(evaluation.scores.fluency)}
          </p>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h4 className="mb-4">Performance Overview</h4>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#030213"
              fill="#030213"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Transcript */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4>Transcript</h4>
          <button
            onClick={onReplay}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:shadow-md transition-all"
          >
            Replay Audio
          </button>
        </div>
        <p className="bg-secondary rounded-xl p-4">{evaluation.transcript}</p>
      </div>

      {/* Speech Metrics */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h4 className="mb-4">Speech Metrics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground mb-1">Duration</p>
            <p>{evaluation.duration}s</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Speaking Rate</p>
            <p>{evaluation.wordsPerMinute} WPM</p>
          </div>
        </div>
      </div>

      {/* Phoneme Errors */}
      {evaluation.phonemeErrors.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h4 className="mb-4">Pronunciation Issues</h4>
          <div className="space-y-3">
            {evaluation.phonemeErrors.map((error, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div>
                  <p>
                    Phoneme: <span className="font-mono">/{error.phoneme}/</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expected: {error.expected} → You said: {error.actual}
                  </p>
                </div>
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h4 className="mb-4">Detailed Feedback</h4>
        <ul className="space-y-3">
          {evaluation.feedback.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-blue-600">{index + 1}</span>
              </div>
              <p className="text-muted-foreground">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
