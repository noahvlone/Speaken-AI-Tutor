import { TrendingUp, Award, Calendar, Target, Loader2 } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useLevelSystem } from '../hooks/useLevelSystem';
import { Star } from 'lucide-react';
import { useUserProgress } from '../hooks/useUserProgress';
import { getCurrentUser } from '../utils/supabase/client';
import { useState, useEffect } from 'react';
import { ChallengeProgressChart } from './ChallengeProgressChart';

export function ProgressPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) setUserId(user.id);
    });
  }, []);

  const {
    progressData,
    errorFrequency,
    skillDistribution,
    stats,
    loading,
    error
  } = useUserProgress(userId);

  const { level, totalXP, progressPercent, xpToNextLevel } = useLevelSystem(userId);

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

  const statsDisplay = [
    {
      label: 'Total Sessions',
      value: stats.totalSessions.toString(),
      icon: Calendar,
      change: `+${Math.max(0, stats.totalSessions - 20)} this week`,
    },
    {
      label: 'Avg. Pronunciation',
      value: stats.avgPronunciation.toString(),
      icon: Award,
      change: `${stats.avgPronunciation >= 70 ? '+' : ''}${stats.avgPronunciation - 70} points`,
    },
    {
      label: 'Avg. Fluency',
      value: stats.avgFluency.toString(),
      icon: TrendingUp,
      change: `${stats.avgFluency >= 60 ? '+' : ''}${stats.avgFluency - 60} points`,
    },
    {
      label: 'Practice Streak',
      value: stats.practiceStreak.toString(),
      icon: Target,
      change: 'days in a row',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-500">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading progress data</p>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Please Log In</h2>
          <p className="text-slate-500">You need to be logged in to view your progress.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Progress Dashboard</h2>
          <p className="text-slate-500">Track your English learning journey</p>
        </div>

        {/* Level Progress - NEW */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
                <span className="text-2xl font-bold">{level}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Current Level</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Star className="w-4 h-4 text-purple-500 fill-purple-500" />
                  <span>{totalXP} Total XP</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">{progressPercent}%</p>
              <p className="text-xs text-slate-400">to next level</p>
            </div>
          </div>

          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative z-10">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-2 text-xs text-center text-slate-400 relative z-10">
            {xpToNextLevel} XP needed to reach Level {level + 1}
          </div>

          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl -ml-16 -mb-16 opacity-50" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsDisplay.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                <p className="text-xs text-emerald-600">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Progress Over Time */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Progress Over Time</h3>
            {progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pronunciation"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Pronunciation"
                  />
                  <Line
                    type="monotone"
                    dataKey="fluency"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Fluency"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-4">
                <TrendingUp className="w-10 h-10 text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground">No voice sessions recorded yet.</p>
              </div>
            )}
          </div>

          {/* Skill Distribution */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/60">
            <h3 className="mb-6">Current Skill Levels</h3>
            {skillDistribution.some(s => s.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-4">
                <Target className="w-10 h-10 text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground">Practice to unlock skill insights.</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Common Errors */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/60">
            <h3 className="mb-6">Most Common Pronunciation Errors</h3>
            {errorFrequency.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={errorFrequency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="phoneme" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-muted-foreground mt-4 text-center">
                  Focus on these sounds to improve faster
                </p>
              </>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-4">
                <Award className="w-10 h-10 text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground">Great job! No frequent errors detected yet.</p>
              </div>
            )}
          </div>

          {/* Improvement Tips */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/60">
            <h3 className="mb-6">Focus Areas</h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="mb-2">Needs Practice</h4>
                <p className="text-muted-foreground">
                  The "th" sound (θ, ð) - Practice words: think, this, brother
                </p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <h4 className="mb-2">Improving</h4>
                <p className="text-muted-foreground">
                  The "r" sound - Continue practicing: right, wrong, career
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <h4 className="mb-2">Great Job!</h4>
                <p className="text-muted-foreground">
                  Vowel sounds - Your vowel pronunciation is excellent
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-lg text-white">
          <h3 className="mb-6">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur">
              <Award className="w-12 h-12 mx-auto mb-3" />
              <h4>7 Day Streak</h4>
              <p className="text-white/80">Consistency Champion</p>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur">
              <TrendingUp className="w-12 h-12 mx-auto mb-3" />
              <h4>+20 Points</h4>
              <p className="text-white/80">Pronunciation Master</p>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur">
              <Target className="w-12 h-12 mx-auto mb-3" />
              <h4>20 Sessions</h4>
              <p className="text-white/80">Dedicated Learner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
