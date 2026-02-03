import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Challenge {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: string;
    difficulty?: string;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    xp_reward: number;
    target_count: number;
    action_url: string;
    progress?: number;
    completed?: boolean;
}

export interface ChallengeAttempt {
    challenge_id: string;
    selected_answer: number;
    is_correct: boolean;
    points_earned: number;
}

// Generate deterministic seed from date
const getDailySeed = (date: Date): number => {
    const dateStr = date.toISOString().split('T')[0];
    return dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

// Seeded shuffle for consistent daily challenges
const seededShuffle = <T,>(array: T[], seed: number): T[] => {
    const rng = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export function useDailyChallenges(userId: string | null) {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [quests, setQuests] = useState<Quest[]>([]);
    const [todaysAttempts, setTodaysAttempts] = useState<ChallengeAttempt[]>([]);
    const [totalScore, setTotalScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load today's challenges and Quests
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Load Quests
                const { data: questsData, error: questsError } = await supabase
                    .from('quests')
                    .select('*');

                if (questsError) throw questsError;

                let mergedQuests = (questsData || []).map((q: any) => ({
                    ...q,
                    progress: 0,
                    completed: false
                }));

                // 2. Load User Progress if logged in
                if (userId) {
                    const { data: progressData, error: progressError } = await supabase
                        .from('user_quest_progress')
                        .select('*')
                        .eq('user_id', userId);

                    if (!progressError && progressData) {
                        mergedQuests = mergedQuests.map(q => {
                            const prog = progressData.find((p: any) => p.quest_id === q.id);
                            return {
                                ...q,
                                progress: prog ? prog.progress : 0,
                                completed: prog ? prog.completed : false
                            };
                        });
                    }
                }

                setQuests(mergedQuests);

                // 3. Load existing "Daily Challenges" (Quiz) - KEEPING FOR BACKWARD COMPAT (or partial usage)
                const { data, error: fetchError } = await supabase
                    .from('daily_challenges')
                    .select('*')
                    .eq('is_active', true);

                if (fetchError) throw fetchError;

                // Use daily seed for consistent challenges
                const today = new Date();
                const seed = getDailySeed(today);
                const shuffled = seededShuffle(data || [], seed).slice(0, 5);

                const formattedChallenges: Challenge[] = shuffled.map(c => ({
                    id: c.id,
                    question: c.question,
                    options: c.options as string[],
                    correctAnswer: c.correct_answer,
                    explanation: c.explanation,
                    category: c.category,
                    difficulty: c.difficulty
                }));

                setChallenges(formattedChallenges);

                // Load today's attempts if user is logged in
                if (userId) {
                    const todayStr = new Date().toISOString().split('T')[0];

                    const { data: attempts } = await supabase
                        .from('user_challenge_attempts')
                        .select('*')
                        .eq('user_id', userId)
                        .eq('attempt_date', todayStr);

                    setTodaysAttempts(attempts || []);

                    const score = (attempts || []).reduce((sum, a) => sum + a.points_earned, 0);
                    setTotalScore(score);
                }

            } catch (err) {
                console.error('Error loading data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load challenges');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);

    // Submit answer for Quiz (Existing)
    const submitAnswer = async (challengeId: string, selectedAnswer: number, correctAnswer: number) => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            const isCorrect = selectedAnswer === correctAnswer;
            const pointsEarned = isCorrect ? 20 : 0;

            const { error: insertError } = await supabase
                .from('user_challenge_attempts')
                .insert({
                    user_id: userId,
                    challenge_id: challengeId,
                    selected_answer: selectedAnswer,
                    is_correct: isCorrect,
                    points_earned: pointsEarned,
                    attempt_date: new Date().toISOString().split('T')[0]
                });

            if (insertError) {
                if (insertError.code === '23505') {
                    throw new Error('You have already attempted this challenge today');
                }
                throw insertError;
            }

            // Update total score
            setTotalScore(prev => prev + pointsEarned);

            // Update attempts list
            setTodaysAttempts(prev => [...prev, {
                challenge_id: challengeId,
                selected_answer: selectedAnswer,
                is_correct: isCorrect,
                points_earned: pointsEarned
            }]);

            return {
                isCorrect,
                pointsEarned
            };

        } catch (err) {
            console.error('Error submitting answer:', err);
            throw err;
        }
    };

    // Save daily summary (Legacy/Quiz)
    const saveDailySummary = async () => {
        if (!userId) return { success: false, error: 'User not authenticated' };

        try {
            const stats = getTodaysStats();
            const { data, error } = await supabase
                .from('daily_challenge_progress')
                .upsert({
                    user_id: userId,
                    challenge_date: new Date().toISOString().split('T')[0],
                    total_questions: 5,
                    correct_answers: stats.correct,
                    accuracy_percentage: stats.accuracy,
                    points_earned: stats.totalScore
                }, {
                    onConflict: 'user_id,challenge_date'
                })
                .select();

            if (error) return { success: false, error };
            return { success: true, data };

        } catch (error: any) {
            return { success: false, error };
        }
    };

    // Get user's attempt history
    const getUserAttempts = async (limit: number = 10) => {
        if (!userId) return [];
        try {
            const { data, error: fetchError } = await supabase
                .from('user_challenge_attempts')
                .select(`*, challenge:challenge_id (question, category)`)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (fetchError) throw fetchError;
            return data || [];
        } catch (err) {
            console.error('Error fetching attempts:', err);
            return [];
        }
    };

    // Get challenge progress history
    const getChallengeProgress = async (days: number = 30) => {
        if (!userId) return [];
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const dateStr = startDate.toISOString().split('T')[0];

            const { data, error: fetchError } = await supabase
                .from('daily_challenge_progress')
                .select('*')
                .eq('user_id', userId)
                .gte('challenge_date', dateStr)
                .order('challenge_date', { ascending: true });

            if (fetchError) throw fetchError;
            return data || [];
        } catch (err) {
            console.error('Error fetching challenge progress:', err);
            return [];
        }
    };

    // Check if challenge was attempted today
    const wasAttemptedToday = (challengeId: string) => {
        return todaysAttempts.some(a => a.challenge_id === challengeId);
    };

    // Get today's stats
    const getTodaysStats = () => {
        const attempted = todaysAttempts.length;
        const correct = todaysAttempts.filter(a => a.is_correct).length;
        const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

        return {
            attempted,
            correct,
            accuracy,
            totalScore
        };
    };

    // Force sync today's stats
    const forceSyncToday = async () => {
        if (!userId) return;
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data: attempts } = await supabase
                .from('user_challenge_attempts')
                .select('*')
                .eq('user_id', userId)
                .eq('attempt_date', today);

            if (!attempts || attempts.length === 0) return;

            const attempted = attempts.length;
            const correct = attempts.filter((a: any) => a.is_correct).length;
            const points = attempts.reduce((sum: number, a: any) => sum + (a.points_earned || 0), 0);
            const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

            await supabase
                .from('daily_challenge_progress')
                .upsert({
                    user_id: userId,
                    challenge_date: today,
                    total_questions: 5,
                    correct_answers: correct,
                    accuracy_percentage: accuracy,
                    points_earned: points
                }, { onConflict: 'user_id,challenge_date' });

        } catch (e) {
            console.error("Force sync error:", e);
        }
    };

    return {
        challenges,
        quests, // NEW
        todaysAttempts,
        totalScore,
        loading,
        error,
        submitAnswer,
        saveDailySummary,
        getUserAttempts,
        getChallengeProgress,
        wasAttemptedToday,
        getTodaysStats,
        forceSyncToday
    };
}
