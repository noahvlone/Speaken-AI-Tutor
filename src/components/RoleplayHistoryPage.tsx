import { useEffect, useState } from 'react';
import { getCurrentUser, createClient } from '../utils/supabase/client';
import {
    Calendar,
    Clock,
    TrendingUp,
    MessageSquare,
    Award,
    Loader2,
    ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

interface SessionHistory {
    id: string;
    created_at: string;
    session_date: string;
    pronunciation_score: number;
    fluency_score: number;
    accuracy_score: number;
    prosody_score: number;
    session_duration_minutes: number;
}

export function RoleplayHistoryPage() {
    const [history, setHistory] = useState<SessionHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Initialize supabase client
    const supabase = createClient();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const user = await getCurrentUser();
                if (!user) {
                    setError('User not authenticated');
                    setLoading(false);
                    return;
                }

                // Fetch progress sorted by date desc
                const { data, error: dbError } = await supabase
                    .from('user_progress')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('session_date', { ascending: false });

                if (dbError) throw dbError;

                setHistory(data || []);
            } catch (err) {
                console.error('Error fetching history:', err);
                setError('Failed to load session history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 pb-20 md:pb-0">
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Clock className="w-8 h-8 text-primary" />
                        Session History
                    </h1>
                    <p className="text-muted-foreground">Review your past roleplay conversations and feedback.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6">
                        {error}
                    </div>
                )}

                {history.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-xl font-medium mb-2">No Sessions Yet</h3>
                            <p className="text-muted-foreground mb-6">Start a roleplay session to verify your English skills!</p>
                            <Button onClick={() => window.location.href = '/roleplay'}>
                                Start New Session
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {history.map((session) => (
                            <Card key={session.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        {/* Left: Date & Info */}
                                        <div className="p-6 flex-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(session.session_date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                                Roleplay Session
                                                <Badge variant="secondary" className="text-xs font-normal">
                                                    {session.session_duration_minutes ? `${session.session_duration_minutes} min` : 'Completed'}
                                                </Badge>
                                            </h3>
                                        </div>

                                        {/* Middle: Scores */}
                                        <div className="px-6 pb-6 md:py-6 md:border-l border-border bg-secondary/10 flex gap-6 md:gap-8 justify-around md:justify-start min-w-[250px]">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {session.pronunciation_score || 0}
                                                </div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider">Pronunciation</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {session.fluency_score || 0}
                                                </div>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider">Fluency</div>
                                            </div>
                                            {session.accuracy_score !== undefined && (
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-purple-600">
                                                        {session.accuracy_score || 0}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Grammar</div>
                                                </div>
                                            )}
                                            {session.prosody_score !== undefined && (
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-orange-600">
                                                        {session.prosody_score || 0}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Prosody</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Action */}
                                        <div className="px-6 pb-6 md:py-6 flex items-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/history/${session.id}`)}
                                                className="gap-2 group-hover:bg-primary group-hover:text-white transition-colors"
                                            >
                                                Details
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
