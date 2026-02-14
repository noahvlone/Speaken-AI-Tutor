import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle2, Award, Zap, Flame, Calendar, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'; // Check imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'; // Check imports
import { Badge } from './ui/badge'; // Check imports
import { useDailyChallenges } from '../hooks/useDailyChallenges';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAchievements } from '../hooks/useAchievements';
import { getCurrentUser } from '../utils/supabase/client';
import { toast } from 'sonner';

export function DailyChallengePage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) setUserId(user.id);
    });
  }, []);

  const { quests, loading: questsLoading, getTodaysStats } = useDailyChallenges(userId);
  const { leaderboard } = useLeaderboard(userId);
  const { achievements, userAchievements } = useAchievements(userId);

  // Derived stats
  const userLeaderboardEntry = leaderboard.find(e => e.user_id === userId);
  const currentStreak = userLeaderboardEntry?.streak || 0;

  const todaysStats = getTodaysStats();
  // Calculate completed quests today
  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;
  // Calculate XP earned today from stats or quests
  const xpToday = quests.filter(q => q.completed).reduce((acc, q) => acc + q.xp_reward, 0);

  const totalAchievements = achievements.length;
  const unlockedAchievements = userAchievements.length;

  const handleStartQuest = (quest: any) => {
    const mode = quest.period || 'daily';
    const separator = quest.action_url.includes('?') ? '&' : '?';
    navigate(`${quest.action_url}${separator}mode=${mode}`);
  };

  if (questsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24 md:pb-6">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Challenges & Achievements</h1>
          <p className="text-slate-500 mt-2">Complete challenges to earn XP and unlock achievements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Streak Card */}
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 !text-white border-none shadow-lg">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Flame className="w-6 h-6 !text-white" />
                </div>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full !text-white">Current Streak</span>
              </div>
              <div>
                <div className="text-4xl font-bold mt-4 !text-white">{currentStreak} days</div>
                <p className="!text-white/80 text-sm mt-1">Keep it up!</p>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Card */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-sm font-medium">Achievements</span>
                <div className="text-3xl font-bold text-slate-900 mt-1">{unlockedAchievements}/{totalAchievements}</div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Today Card */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-sm font-medium">Completed Today</span>
                <div className="text-3xl font-bold text-slate-900 mt-1">{completedQuests}/{totalQuests}</div>
              </div>
            </CardContent>
          </Card>

          {/* XP Today Card */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-sm font-medium">XP Today</span>
                <div className="text-3xl font-bold text-slate-900 mt-1">{xpToday}</div>
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Main Content Tabs */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="bg-slate-200/50 p-1 rounded-xl mb-6">
            <TabsTrigger value="daily" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Daily Challenges</h2>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100 gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Resets daily
              </Badge>
            </div>

            <div className="grid gap-4">
              {quests.filter(q => !q.period || q.period === 'daily').map((quest) => (
                <Card key={quest.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6 flex items-center gap-6">
                    {/* Icon based on category */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${quest.category === 'Speaking' ? 'bg-orange-100 text-orange-600' :
                      quest.category === 'Pronunciation' ? 'bg-pink-100 text-pink-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                      {quest.category === 'Speaking' && <Award className="w-8 h-8" />}
                      {quest.category === 'Pronunciation' && <CheckCircle2 className="w-8 h-8" />}
                      {quest.category === 'Grammar' && <Trophy className="w-8 h-8" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-slate-900">{quest.title}</h3>
                        <Badge variant="outline" className={`
                                            ${quest.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-200' :
                            quest.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-red-50 text-red-700 border-red-200'}
                                        `}>
                          {quest.difficulty}
                        </Badge>
                      </div>
                      <p className="text-slate-500 mb-4">{quest.description}</p>

                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(((quest.progress || 0) / quest.target_count) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
                          {quest.progress || 0}/{quest.target_count}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 min-w-[100px]">
                      <div className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-lg">
                        <Zap className="w-4 h-4 fill-current" />
                        +{quest.xp_reward} XP
                      </div>
                      <Button
                        className={`${quest.completed ? '!bg-green-600 hover:!bg-green-700' : '!bg-blue-600 hover:!bg-blue-700'} !text-white rounded-xl px-6`}
                        onClick={() => handleStartQuest(quest)}
                        disabled={quest.completed}
                      >
                        {quest.completed ? 'Completed' : 'Start'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {quests.filter(q => !q.period || q.period === 'daily').length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-500">No active daily quests available right now.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Weekly Challenges</h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Resets weekly
              </Badge>
            </div>
            <div className="grid gap-4">
              {quests.filter(q => q.period === 'weekly').map((quest) => (
                <Card key={quest.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-blue-50/30">
                  <CardContent className="p-6 flex items-center gap-6">
                    {/* Icon based on category */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${quest.category === 'Speaking' ? 'bg-orange-100 text-orange-600' :
                      quest.category === 'Pronunciation' ? 'bg-pink-100 text-pink-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                      {quest.category === 'Speaking' && <Award className="w-8 h-8" />}
                      {quest.category === 'Pronunciation' && <CheckCircle2 className="w-8 h-8" />}
                      {quest.category === 'Grammar' && <Trophy className="w-8 h-8" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-slate-900">{quest.title}</h3>
                        <Badge variant="outline" className={`
                                             ${quest.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-200' :
                            quest.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-red-50 text-red-700 border-red-200'}
                                         `}>
                          {quest.difficulty}
                        </Badge>
                      </div>
                      <p className="text-slate-500 mb-4">{quest.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(((quest.progress || 0) / quest.target_count) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
                          {quest.progress || 0}/{quest.target_count}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 min-w-[100px]">
                      <div className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-lg">
                        <Zap className="w-4 h-4 fill-current" />
                        +{quest.xp_reward} XP
                      </div>
                      <Button
                        className={`${quest.completed ? '!bg-green-600 hover:!bg-green-700' : '!bg-blue-600 hover:!bg-blue-700'} !text-white rounded-xl px-6`}
                        onClick={() => handleStartQuest(quest)}
                        disabled={quest.completed}
                      >
                        {quest.completed ? 'Completed' : 'Start'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {quests.filter(q => q.period === 'weekly').length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-500">No active weekly quests available.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Monthly Challenges</h2>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Resets monthly
              </Badge>
            </div>
            <div className="grid gap-4">
              {quests.filter(q => q.period === 'monthly').map((quest) => (
                <Card key={quest.id} className="border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-amber-50/30">
                  <CardContent className="p-6 flex items-center gap-6">
                    {/* Icon based on category */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${quest.category === 'Speaking' ? 'bg-orange-100 text-orange-600' :
                      quest.category === 'Pronunciation' ? 'bg-pink-100 text-pink-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                      {quest.category === 'Speaking' && <Award className="w-8 h-8" />}
                      {quest.category === 'Pronunciation' && <CheckCircle2 className="w-8 h-8" />}
                      {quest.category === 'Grammar' && <Trophy className="w-8 h-8" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-slate-900">{quest.title}</h3>
                        <Badge variant="outline" className={`
                                             ${quest.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-200' :
                            quest.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-red-50 text-red-700 border-red-200'}
                                         `}>
                          {quest.difficulty}
                        </Badge>
                      </div>
                      <p className="text-slate-500 mb-4">{quest.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(((quest.progress || 0) / quest.target_count) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
                          {quest.progress || 0}/{quest.target_count}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 min-w-[100px]">
                      <div className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-lg">
                        <Zap className="w-4 h-4 fill-current" />
                        +{quest.xp_reward} XP
                      </div>
                      <Button
                        className={`${quest.completed ? '!bg-green-600 hover:!bg-green-700' : '!bg-blue-600 hover:!bg-blue-700'} !text-white rounded-xl px-6`}
                        onClick={() => handleStartQuest(quest)}
                        disabled={quest.completed}
                      >
                        {quest.completed ? 'Completed' : 'Start'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {quests.filter(q => q.period === 'monthly').length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-500">No active monthly quests available.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

