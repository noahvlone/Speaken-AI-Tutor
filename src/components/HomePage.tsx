import { MessageSquare, Video, CheckCircle2, Mic, Zap, TrendingUp, Trophy, Target, Award, Sparkles, Flame, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useHomeStats } from '../hooks/useHomeStats';
import { useLevelSystem } from '../hooks/useLevelSystem';
import { useDailyGoal } from '../hooks/useDailyGoal';
import { useUserLevel } from '../contexts/LevelContext';
import { BEGINNER_SCENARIOS } from './BeginnerScenarios';
import { getCurrentUser } from '../utils/supabase/client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';

interface HomePageProps {
  userName?: string;
}

export function HomePage({ userName = 'User' }: HomePageProps) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { userLevel, loading: levelContextLoading } = useUserLevel();

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) setUserId(user.id);
    });
  }, []);

  const { streak, level: cefr, accuracy, xp, loading } = useHomeStats(userId);
  const { level, totalXP, progressPercent, xpToNextLevel, loading: levelLoading } = useLevelSystem(userId);
  const { dailyGoal, xpEarnedToday, goalCompleted, progressPercent: dailyProgress, loading: goalLoading } = useDailyGoal(userId);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">

        {/* Header Fixed */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, <span className="text-[#6366f1]">{userName}</span> 👋
          </h1>
          <p className="text-slate-500 text-lg">
            Ready to level up your English skills today?
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Streak */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mb-3">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">STREAK</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '-' : streak} {streak === 1 ? 'day' : 'days'}</p>
          </div>

          {/* Level */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center mb-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">LEVEL</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '-' : level}</p>
          </div>

          {/* Accuracy */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ACCURACY</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '-' : accuracy}%</p>
          </div>

          {/* Total XP */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-purple-500 fill-current" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">TOTAL XP</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '-' : xp}</p>
          </div>
        </div>

        {/* Level and Daily Goal Progress Section - Combined Card */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-slate-100">
          {/* Level Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-500" />
                <span className="font-bold text-slate-700">Level {level}</span>
              </div>
              <span className="text-xs font-medium text-slate-500">{xpToNextLevel} XP to next level</span>
            </div>
            {/* Purple Progress Bar */}
            <div className="h-3 bg-purple-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8b5cf6] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Daily Goal Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-full ${goalCompleted ? 'bg-green-100' : 'bg-green-50'}`}>
                  <Target className={`w-4 h-4 ${goalCompleted ? 'text-green-600' : 'text-green-500'}`} />
                </div>
                <span className="font-bold text-slate-700">Daily Goal: {dailyGoal} XP</span>
                {goalCompleted && <span className="ml-2 text-xs font-bold text-green-600">✓ Complete!</span>}
              </div>
              <span className="text-xs font-medium text-slate-500">{xpEarnedToday} / {dailyGoal} XP earned today</span>
            </div>
            {/* Green/Teal Progress Bar for Daily Goal - lighter than Level bar in reference */}
            <div className="h-3 bg-green-50/50 rounded-full overflow-hidden border border-green-100">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${dailyProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Chat Practice */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 relative group hover:shadow-md transition-all h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-full">Writing Focus</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-full">Free</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">Chat Practice</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1">
              Practice written English with instant grammar correction.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-600">Real-time grammar correction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-600">Vocabulary enhancement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-600">Contextual suggestions</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/chat')}
              className="flex items-center text-[#6366f1] font-bold cursor-pointer hover:underline gap-1 mt-auto"
            >
              Start Session <ArrowRight className="w-4 h-4" />
            </div>
            {/* Left blue accent border */}
            <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-500 rounded-r-full"></div>
          </div>

          {/* AI Roleplay */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 relative group hover:shadow-md transition-all h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-[#a855f7] rounded-full flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-full">Speaking Focus</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-full">Pro</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">AI Roleplay</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1">
              Video conversations with AI tutor featuring real-time pronunciation analysis.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-600">Pronunciation scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-600">Fluency analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-600">Real-time feedback</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/roleplay')}
              className="flex items-center text-[#6366f1] font-bold cursor-pointer hover:underline gap-1 mt-auto"
            >
              Start Session <ArrowRight className="w-4 h-4" />
            </div>
            {/* Left purple accent border */}
            <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#a855f7] rounded-r-full"></div>
          </div>
        </div>

        {/* Start Learning Grid */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-bold text-slate-900">Start Learning</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {BEGINNER_SCENARIOS.slice(0, 4).map((scenario, index) => (
              <div
                key={scenario.id}
                onClick={() => navigate('/chat', { state: { beginnerScenario: scenario } })}
                className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-xl">
                    {scenario.icon}
                  </div>
                  {index === 0 ? (
                    <div className="bg-green-500 rounded-full p-1">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] px-2 bg-slate-100 text-slate-500 hover:bg-slate-100">Pemula</Badge>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 mb-1">{scenario.titleId}</h3>
                <p className="text-xs text-slate-500 mb-4 flex-1">{scenario.description}</p>

                {/* Progress Bar styled line at bottom */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-auto">
                  <div
                    className={`h-full rounded-full ${index === 0 ? 'bg-purple-600 w-full' : (index === 1 ? 'bg-purple-600 w-1/3' : 'bg-slate-200 w-0')}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
