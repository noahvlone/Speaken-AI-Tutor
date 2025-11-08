import { useState } from 'react';
import { Trophy, Timer, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Star, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card } from './ui/card';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

const challenges: Question[] = [
  {
    id: 1,
    question: "Choose the correct sentence:",
    options: [
      "She don't like coffee.",
      "She doesn't likes coffee.",
      "She doesn't like coffee.",
      "She not like coffee."
    ],
    correctAnswer: 2,
    explanation: "Use 'doesn't' (does not) with third-person singular subjects, followed by base form verb.",
    category: "Grammar"
  },
  {
    id: 2,
    question: "Which word is a synonym for 'happy'?",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    correctAnswer: 1,
    explanation: "'Joyful' means feeling or expressing great happiness and triumph.",
    category: "Vocabulary"
  },
  {
    id: 3,
    question: "Complete: If I ___ rich, I would travel the world.",
    options: ["am", "was", "were", "will be"],
    correctAnswer: 2,
    explanation: "In second conditional (hypothetical present/future), use 'were' with all subjects.",
    category: "Grammar"
  },
  {
    id: 4,
    question: "What does 'break the ice' mean?",
    options: [
      "To damage something frozen",
      "To make people feel more relaxed",
      "To work very hard",
      "To be very cold"
    ],
    correctAnswer: 1,
    explanation: "'Break the ice' is an idiom meaning to make people feel more comfortable in a social situation.",
    category: "Idioms"
  },
  {
    id: 5,
    question: "Choose the correct preposition: She's good ___ mathematics.",
    options: ["in", "at", "on", "with"],
    correctAnswer: 1,
    explanation: "We use 'good at' to describe skills or abilities in a particular area.",
    category: "Grammar"
  }
];

export function DailyChallengePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(challenges.length).fill(false)
  );
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectAnswer = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === challenges[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 20);
    }

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < challenges.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Array(challenges.length).fill(false));
    setTimeLeft(300);
    setIsCompleted(false);
  };

  const progress = ((currentQuestion + 1) / challenges.length) * 100;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 pb-24 md:pb-6">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 md:p-12 text-center shadow-xl">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="mb-4">Challenge Completed!</h1>
            
            <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {score}/100
            </div>
            
            <p className="text-muted-foreground mb-8">
              {score >= 80
                ? "Excellent work! You're mastering English! 🎉"
                : score >= 60
                ? "Good job! Keep practicing to improve more! 👍"
                : "Nice try! Review the topics and try again! 💪"}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-secondary/50 rounded-2xl p-4">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-muted-foreground">Correct</p>
                <p className="text-2xl">{score / 20}/5</p>
              </div>
              <div className="bg-secondary/50 rounded-2xl p-4">
                <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-muted-foreground">Points</p>
                <p className="text-2xl">+{score}</p>
              </div>
              <div className="bg-secondary/50 rounded-2xl p-4">
                <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-muted-foreground">Streak</p>
                <p className="text-2xl">3🔥</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleRestart}
                className="w-full py-6 rounded-xl shadow-md hover:shadow-lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
              
              <Button
                variant="outline"
                className="w-full py-6 rounded-xl"
                onClick={() => window.location.reload()}
              >
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = challenges[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 pb-24 md:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2>Daily Challenge</h2>
                <p className="text-muted-foreground">Test your English skills</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-md">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="font-mono">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {challenges.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-6 md:p-8 mb-6 shadow-xl bg-white">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-4">
              <span>{question.category}</span>
            </div>
            <h3 className="mb-6">{question.question}</h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === question.correctAnswer;
              
              let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all ";
              
              if (!showResult) {
                buttonClass += isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-border hover:border-blue-300 hover:bg-blue-50/50";
              } else {
                if (isCorrectOption) {
                  buttonClass += "border-green-500 bg-green-50";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "border-red-500 bg-red-50";
                } else {
                  buttonClass += "border-border bg-secondary/20";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <>
                        {isCorrectOption && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                        {isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className={`mt-6 p-4 rounded-xl ${
              isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className={isCorrect ? 'text-green-900' : 'text-orange-900'}>
                    <strong>{isCorrect ? 'Correct!' : 'Not quite right.'}</strong>
                  </p>
                  <p className={isCorrect ? 'text-green-800' : 'text-orange-800'}>
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Score Display */}
        <div className="flex items-center justify-between mb-6">
          <div className="bg-white px-6 py-3 rounded-xl shadow-md">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Score: {score}/{challenges.length * 20}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {answeredQuestions.map((answered, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  answered
                    ? 'bg-blue-500'
                    : index === currentQuestion
                    ? 'bg-blue-300 ring-2 ring-blue-500 ring-offset-2'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!showResult ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="flex-1 py-6 rounded-xl shadow-md hover:shadow-lg"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="flex-1 py-6 rounded-xl shadow-md hover:shadow-lg"
            >
              {currentQuestion < challenges.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                'See Results'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
