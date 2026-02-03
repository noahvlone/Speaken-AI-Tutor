import { Trophy, CheckCircle2, Target, TrendingUp, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useDailyChallenges } from '../hooks/useDailyChallenges';
import { Progress } from './ui/progress';

interface ChallengeWidgetProps {
    userId: string | null;
    onNavigate: () => void;
}

export function ChallengeWidget({ userId, onNavigate }: ChallengeWidgetProps) {
    const { getTodaysStats, loading } = useDailyChallenges(userId);
    const stats = getTodaysStats();

    if (loading) {
        return (
            <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-blue-500" />
                        Today's Challenge
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Loading...</p>
                </CardContent>
            </Card>
        );
    }

    const isCompleted = stats.attempted === 5;
    const progressPercentage = (stats.attempted / 5) * 100;

    return (
        <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-blue-500" />
                    Today's Challenge
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isCompleted ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-green-700 dark:text-green-400">Completed!</p>
                                <p className="text-sm text-muted-foreground">{stats.accuracy}% accuracy</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Target className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs text-muted-foreground">Correct</span>
                                </div>
                                <p className="text-lg font-semibold">{stats.correct}/5</p>
                            </div>

                            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp className="w-4 h-4 text-purple-500" />
                                    <span className="text-xs text-muted-foreground">Points</span>
                                </div>
                                <p className="text-lg font-semibold">+{stats.totalScore}</p>
                            </div>
                        </div>

                        <p className="text-sm text-center text-muted-foreground">
                            Come back tomorrow for new challenges!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Flame className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">
                                    {5 - stats.attempted} {5 - stats.attempted === 1 ? 'question' : 'questions'} remaining
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {stats.attempted > 0 ? `${stats.correct} correct so far` : 'Start your daily challenge'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{stats.attempted}/5</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                        </div>

                        <Button
                            onClick={onNavigate}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                        >
                            {stats.attempted > 0 ? 'Continue Challenge' : 'Start Challenge'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
