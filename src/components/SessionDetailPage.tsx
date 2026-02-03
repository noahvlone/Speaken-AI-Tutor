import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser, createClient } from '../utils/supabase/client';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Award,
    TrendingUp,
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface SessionDetail {
    id: string;
    session_date: string;
    pronunciation_score: number;
    fluency_score: number;
    accuracy_score: number;
    prosody_score: number;
    session_duration_minutes: number;
    transcript: string;
    common_mistakes: {
        mistake: string;
        explanation: string;
        correction: string;
    }[];
    ai_suggestions: string[];
    feedback_summary: string;
}

export function SessionDetailPage() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [session, setSession] = useState<SessionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchSessionDetails = async () => {
            if (!sessionId) return;

            try {
                const { data, error: dbError } = await supabase
                    .from('user_progress')
                    .select('*')
                    .eq('id', sessionId)
                    .single();

                if (dbError) throw dbError;
                setSession(data);
            } catch (err) {
                console.error('Error fetching session details:', err);
                setError('Failed to load session details');
            } finally {
                setLoading(false);
            }
        };

        fetchSessionDetails();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 flex items-center justify-center">
                <Card className="max-w-md w-full text-center p-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p className="text-muted-foreground mb-6">{error || 'Session not found'}</p>
                    <Button onClick={() => navigate('/history')}>Back to History</Button>
                </Card>
            </div>
        );
    }

    const totalScore = Math.round(
        ((session.pronunciation_score || 0) +
            (session.fluency_score || 0) +
            (session.accuracy_score || 0) +
            (session.prosody_score || 0)) / 4
    );

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/history')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to History</span>
                    </button>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.session_date).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Summary Header */}
                <div className="bg-white rounded-3xl p-8 shadow-md border border-border mb-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8">
                        <div className={`text-6xl font-bold ${getScoreColor(totalScore)} opacity-20`}>
                            {totalScore}%
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-8 border-secondary flex items-center justify-center bg-white shadow-inner">
                                <span className={`text-4xl font-bold ${getScoreColor(totalScore)}`}>
                                    {totalScore}
                                </span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg shadow-lg">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2">Session Overview</h1>
                            <p className="text-muted-foreground mb-4">
                                {session.feedback_summary || "Great job on your roleplay session! Here's a detailed breakdown of your performance."}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <Badge variant="secondary" className="px-3 py-1 gap-1.5 font-medium">
                                    <Clock className="w-4 h-4" />
                                    {session.session_duration_minutes || 0} Minutes
                                </Badge>
                                <Badge variant="secondary" className="px-3 py-1 gap-1.5 font-medium">
                                    <TrendingUp className="w-4 h-4" />
                                    {totalScore >= 80 ? 'Proficient' : totalScore >= 60 ? 'Intermediate' : 'Beginner'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Skills Breakdown */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Detailed Scores */}
                        <Card className="rounded-3xl border-none shadow-md overflow-hidden bg-white">
                            <CardHeader className="bg-secondary/10 pb-6">
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Skill Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-6">
                                    {[
                                        { label: 'Pronunciation', value: session.pronunciation_score, color: 'bg-green-500' },
                                        { label: 'Fluency', value: session.fluency_score, color: 'bg-blue-500' },
                                        { label: 'Grammar', value: session.accuracy_score, color: 'bg-purple-500' },
                                        { label: 'Prosody', value: session.prosody_score, color: 'bg-orange-500' },
                                    ].map((skill) => (
                                        <div key={skill.label} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="font-medium">{skill.label}</span>
                                                <span className={`text-lg font-bold ${getScoreColor(skill.value || 0)}`}>
                                                    {skill.value || 0}%
                                                </span>
                                            </div>
                                            <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${skill.color} transition-all duration-1000`}
                                                    style={{ width: `${skill.value || 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Transcript */}
                        <Card className="rounded-3xl border-none shadow-md overflow-hidden bg-white">
                            <CardHeader className="bg-secondary/10 pb-6">
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                    Conversation Transcript
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 max-h-[400px] overflow-y-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-700">
                                    {session.transcript || "No transcript available for this session."}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: AI Feedback */}
                    <div className="space-y-8">
                        {/* Common Mistakes */}
                        <Card className="rounded-3xl border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                            <CardHeader className="border-b border-white/10 pb-6">
                                <CardTitle className="flex items-center gap-2 text-orange-400">
                                    <AlertCircle className="w-5 h-5" />
                                    Improvement Areas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-4">
                                    {session.common_mistakes && session.common_mistakes.length > 0 ? (
                                        session.common_mistakes.map((mistake, i) => (
                                            <div key={i} className="flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-white/10">
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                                                    <p className="font-bold text-orange-400">{typeof mistake === 'string' ? mistake : mistake.mistake}</p>
                                                </div>
                                                {typeof mistake !== 'string' && (
                                                    <div className="pl-5 space-y-1">
                                                        <p className="text-xs text-slate-400 leading-relaxed">{mistake.explanation}</p>
                                                        <p className="text-xs text-emerald-400 font-medium">Correction: {mistake.correction}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-400 text-sm italic">No specific mistakes identified.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Suggestions */}
                        <Card className="rounded-3xl border-none shadow-xl bg-white overflow-hidden">
                            <CardHeader className="bg-blue-600 text-white pb-6">
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    AI Suggestions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-4">
                                    {session.ai_suggestions && session.ai_suggestions.length > 0 ? (
                                        session.ai_suggestions.map((suggestion, i) => (
                                            <div key={i} className="flex gap-3 items-start">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold text-blue-600">{i + 1}</span>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed">{suggestion}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-400 text-sm italic">No suggestions available.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
