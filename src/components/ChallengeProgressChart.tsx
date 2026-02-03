import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useDailyChallenges } from '../hooks/useDailyChallenges';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Target, Award, Trophy } from 'lucide-react';

interface ChallengeProgressChartProps {
    userId: string | null;
}

export function ChallengeProgressChart({ userId }: ChallengeProgressChartProps) {
    const { getChallengeProgress, forceSyncToday } = useDailyChallenges(userId);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            console.log('Chart requesting data...');
            const progressData = await getChallengeProgress(30);
            console.log('Chart received data:', progressData);

            // Format data for chart
            const formattedData = progressData.map((item: any) => ({
                date: new Date(item.challenge_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                accuracy: item.accuracy_percentage,
                points: item.points_earned,
                correct: item.correct_answers
            }));

            console.log('Chart formatted data:', formattedData);

            setData(formattedData);
        } catch (error) {
            console.error('Error loading challenge progress:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [userId]);

    const handleRefresh = async () => {
        setLoading(true);
        await forceSyncToday();
        setTimeout(loadData, 1000); // Wait a bit for DB propagation
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Challenge Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Loading...</p>
                </CardContent>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Challenge Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground">No challenge data available yet</p>
                        <p className="text-sm text-muted-foreground mb-4">Complete daily challenges to see your progress here</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                        >
                            Refresh / Sync Data
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate stats
    const avgAccuracy = Math.round(data.reduce((sum, d) => sum + d.accuracy, 0) / data.length);
    const totalPoints = data.reduce((sum, d) => sum + d.points, 0);
    const totalChallenges = data.length;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Challenge Performance (Last 30 Days)
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-secondary/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span className="text-xs text-muted-foreground">Avg Accuracy</span>
                        </div>
                        <p className="text-2xl font-semibold">{avgAccuracy}%</p>
                    </div>

                    <div className="bg-secondary/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Award className="w-4 h-4 text-purple-500" />
                            <span className="text-xs text-muted-foreground">Total Points</span>
                        </div>
                        <p className="text-2xl font-semibold">{totalPoints}</p>
                    </div>

                    <div className="bg-secondary/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-muted-foreground">Completed</span>
                        </div>
                        <p className="text-2xl font-semibold">{totalChallenges}</p>
                    </div>
                </div>

                {/* Chart */}
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="accuracy"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Accuracy (%)"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="points"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Points"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
