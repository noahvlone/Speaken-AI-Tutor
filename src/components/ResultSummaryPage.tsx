import { motion } from 'motion/react';
import { Award, TrendingUp, CheckCircle2, AlertCircle, RefreshCw, Save, X, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

interface SessionResult {
  pronunciation: number;
  fluency: number;
  grammar: number;
  totalScore: number;
  duration: string;
  transcript: string;
  commonMistakes: string[];
  aiSuggestions: string[];
}

interface ResultSummaryPageProps {
  onTryAgain: () => void;
  onBackToDashboard: () => void;
  sessionData?: SessionResult;
}

export function ResultSummaryPage({ onTryAgain, onBackToDashboard, sessionData }: ResultSummaryPageProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data if no session data provided
  const defaultData: SessionResult = {
    pronunciation: 87,
    fluency: 82,
    grammar: 90,
    totalScore: 86,
    duration: '8 minutes',
    transcript: "Hello, my name is Sarah and I'm practicing my English pronunciation today. I want to improve my speaking skills and become more fluent in everyday conversations.",
    commonMistakes: [
      'Pronunciation of "th" sound in "the" - try placing tongue between teeth',
      'Speaking pace was too fast in the middle section',
      'Minor article usage: "the everyday conversations" instead of "everyday conversations"'
    ],
    aiSuggestions: [
      'Practice minimal pairs: "think" vs "sink", "thank" vs "tank"',
      'Try to maintain consistent speaking pace throughout',
      'Review articles (a, an, the) usage in common phrases',
      'Great job on sentence structure and vocabulary choice!',
      'Continue practicing daily for best results'
    ]
  };

  const data = sessionData || defaultData;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getOverallFeedback = (score: number) => {
    if (score >= 90) return { emoji: '🏆', text: 'Outstanding!', color: 'text-green-500' };
    if (score >= 80) return { emoji: '🎯', text: 'Excellent!', color: 'text-green-500' };
    if (score >= 70) return { emoji: '👍', text: 'Good Job!', color: 'text-blue-500' };
    if (score >= 60) return { emoji: '💪', text: 'Keep Going!', color: 'text-orange-500' };
    return { emoji: '📚', text: 'Keep Practicing!', color: 'text-orange-600' };
  };

  const handleSaveResult = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      setShowSaveModal(true);
    }, 1500);
  };

  const handleCloseModal = () => {
    setShowSaveModal(false);
    onBackToDashboard();
  };

  const feedback = getOverallFeedback(data.totalScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl mb-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/40">
                <span className="text-6xl">{feedback.emoji}</span>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-2"
            >
              {feedback.text}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-white/90"
            >
              <Award className="w-5 h-5" />
              <span>Session completed in {data.duration}</span>
            </motion.div>
          </div>

          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="text-7xl mb-2">{data.totalScore}</div>
            <div className="text-white/80 text-lg">Overall Score</div>
          </motion.div>
        </motion.div>

        {/* Individual Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Pronunciation */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3>Pronunciation</h3>
              <div className={`text-2xl ${getScoreColor(data.pronunciation)}`}>
                {data.pronunciation}
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={getScoreBgColor(data.pronunciation)}
                initial={{ width: 0 }}
                animate={{ width: `${data.pronunciation}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ height: '100%' }}
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              {data.pronunciation >= 80 ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Excellent
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Room to grow
                </Badge>
              )}
            </div>
          </div>

          {/* Fluency */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3>Fluency</h3>
              <div className={`text-2xl ${getScoreColor(data.fluency)}`}>
                {data.fluency}
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={getScoreBgColor(data.fluency)}
                initial={{ width: 0 }}
                animate={{ width: `${data.fluency}%` }}
                transition={{ duration: 1, delay: 0.6 }}
                style={{ height: '100%' }}
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              {data.fluency >= 80 ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Excellent
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Room to grow
                </Badge>
              )}
            </div>
          </div>

          {/* Grammar */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3>Grammar</h3>
              <div className={`text-2xl ${getScoreColor(data.grammar)}`}>
                {data.grammar}
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={getScoreBgColor(data.grammar)}
                initial={{ width: 0 }}
                animate={{ width: `${data.grammar}%` }}
                transition={{ duration: 1, delay: 0.7 }}
                style={{ height: '100%' }}
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              {data.grammar >= 80 ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Excellent
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Room to grow
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Your Speech Transcript */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-border mb-8"
        >
          <h2 className="mb-4">Your Speech Transcript</h2>
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <p className="text-foreground/80 leading-relaxed italic">
              "{data.transcript}"
            </p>
          </div>
        </motion.div>

        {/* Common Mistakes */}
        {data.commonMistakes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-border mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <h2>Areas for Improvement</h2>
            </div>
            <div className="space-y-3">
              {data.commonMistakes.map((mistake, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 text-sm">
                    {index + 1}
                  </div>
                  <p className="text-foreground/80 flex-1">{mistake}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-lg border border-blue-200 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2>AI Recommendations</h2>
          </div>
          <div className="space-y-3">
            {data.aiSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-foreground/80 flex-1">{suggestion}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={onTryAgain}
            variant="outline"
            className="px-8 py-6 rounded-2xl border-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={handleSaveResult}
            disabled={isSaving}
            className="px-8 py-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mr-2"
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Result
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Save Success Modal */}
      {showSaveModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              
              <h2 className="mb-2">Result Saved Successfully! ✅</h2>
              <p className="text-muted-foreground mb-6">
                Your session result has been saved to your progress history.
              </p>
              
              <Button
                onClick={handleCloseModal}
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
              >
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
