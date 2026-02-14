import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { getTodayWIB, getDateWIB, getNowWIB } from '../utils/dateUtils';

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
    period?: 'daily' | 'weekly' | 'monthly'; // Added period
    progress?: number;
    completed?: boolean;
}

export interface ChallengeAttempt {
    challenge_id: string;
    selected_answer: number;
    is_correct: boolean;
    points_earned: number;
}

// Generate deterministic seed from date (WIB timezone)
const getDailySeed = (date: Date): number => {
    const dateStr = getDateWIB(date);
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

                // 1. Check existing quests
                const { data: existingQuests, error: fetchError } = await supabase
                    .from('quests')
                    .select('*');

                if (fetchError) {
                    console.error('Error fetching quests:', fetchError);
                    return;
                }

                // Premium 7 Quests
                const activeQuestList = [
                    // Daily (The "Big 3")
                    { title: 'Grammar Guru', description: 'Complete 10 grammar challenges today', category: 'Grammar', difficulty: 'Medium', xp_reward: 100, target_count: 10, action_url: '/challenge/grammar', period: 'daily' },
                    { title: 'Pronunciation Pro', description: 'Practice 10 words with perfect accuracy', category: 'Pronunciation', difficulty: 'Easy', xp_reward: 100, target_count: 10, action_url: '/challenge/pronunciation', period: 'daily' },
                    { title: 'Voice Master', description: 'Practice speaking in roleplay', category: 'Speaking', difficulty: 'Hard', xp_reward: 150, target_count: 1, action_url: '/roleplay', period: 'daily' },

                    // Weekly
                    { title: 'Weekly Grammar Marathon', description: 'Complete 15 advanced grammar exercises', category: 'Grammar', difficulty: 'Hard', xp_reward: 500, target_count: 15, action_url: '/challenge/grammar', period: 'weekly' },
                    { title: 'Weekly Tongue Twister', description: 'Master 15 difficult phonetic sets', category: 'Pronunciation', difficulty: 'Hard', xp_reward: 400, target_count: 15, action_url: '/challenge/pronunciation', period: 'weekly' },

                    // Monthly
                    { title: 'Global Grammar Master', description: 'Achieve 25 advanced grammar milestones', category: 'Grammar', difficulty: 'Hard', xp_reward: 1500, target_count: 25, action_url: '/challenge/grammar', period: 'monthly' },
                    { title: 'Legendary Speaker', description: 'Speak for over 30 minutes in roleplays', category: 'Speaking', difficulty: 'Hard', xp_reward: 2000, target_count: 5, action_url: '/chat/roleplay', period: 'monthly' }
                ];

                // 2. Identify and DELETE redundant quests
                // Explicitly target the 3 legacy quests User wants removed
                const legacyTitles = ['Morning Conversation', 'Pronunciation Master', 'Grammar Ninja'];
                const activeTitles = activeQuestList.map(q => q.title);

                // Combine legacy titles + anything not in active list
                const questsToDelete = existingQuests?.filter(q =>
                    legacyTitles.includes(q.title) || !activeTitles.includes(q.title)
                ) || [];

                if (questsToDelete.length > 0) {
                    const idsToDelete = questsToDelete.map(q => q.id);
                    console.log('Deleting redundant quests:', idsToDelete);

                    // First, delete dependent progress to avoid Foreign Key constraint errors
                    const { error: progressDeleteError } = await supabase
                        .from('user_quest_progress')
                        .delete()
                        .in('quest_id', idsToDelete);

                    if (progressDeleteError) {
                        console.error('Error deleting dependent progress:', progressDeleteError);
                    } else {
                        // Then delete the quests
                        const { error: questDeleteError } = await supabase
                            .from('quests')
                            .delete()
                            .in('id', idsToDelete);
                        if (questDeleteError) console.error('Error deleting quests:', questDeleteError);
                    }
                }

                // 3. UPSERT the Premium 7 to ensure they exist and are up-to-date
                // We will iterate and upsert to ensure we don't violate any constraints if ID is not matching,
                // but since we deleted the non-matching ones, we typically just need to ensure these 7 exist.
                // To be safe and keep IDs stable if possible, we check existence by title.

                for (const quest of activeQuestList) {
                    const distinctQuest = existingQuests?.find(eq => eq.title === quest.title);
                    if (distinctQuest) {
                        // Update existing to match code definition
                        await supabase.from('quests').update(quest).eq('id', distinctQuest.id);
                    } else {
                        // Insert new
                        await supabase.from('quests').insert(quest);
                    }
                }

                // 4. Reload Quests after cleanup/update
                const { data: finalQuests, error: finalError } = await supabase
                    .from('quests')
                    .select('*');

                if (finalError) {
                    console.error('Error reloading quests:', finalError);
                    return;
                }

                // NUCLEAR OPTION: Filter out anything that is not in our Active List on the frontend too
                // This ensures that even if DB deletion fails (e.g. RLS policies), the user never sees them.
                const allowedTitles = activeQuestList.map(q => q.title);
                const filteredQuests = (finalQuests || []).filter(q => allowedTitles.includes(q.title));

                let mergedQuests = filteredQuests.map((q: any) => ({
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

                            // Check if progress is from TODAY (WIB)
                            // We compare the date part of the ISO string
                            const todayWIB = getTodayWIB();
                            const lastUpdated = prog?.last_updated || '';
                            const isToday = lastUpdated.startsWith(todayWIB);

                            return {
                                ...q,
                                // Only show progress if it was updated TODAY
                                progress: isToday ? prog.progress : 0,
                                completed: isToday ? prog.completed : false
                            };
                        });
                    }
                }

                setQuests(mergedQuests);

                // 3. Load existing "Daily Challenges" (Quiz) - KEEPING FOR BACKWARD COMPAT (or partial usage)
                const { data, error: dailyFetchError } = await supabase
                    .from('daily_challenges')
                    .select('*')
                    .eq('is_active', true);

                if (dailyFetchError) throw dailyFetchError;

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
                    const todayStr = getTodayWIB();

                    const { data: attempts } = await supabase
                        .from('user_challenge_attempts')
                        .select('*')
                        .eq('user_id', userId)
                        .eq('attempt_date', todayStr);

                    setTodaysAttempts(attempts || []);

                    const score = (attempts || []).reduce((sum, a) => sum + a.points_earned, 0);
                    setTotalScore(score);
                    if (userId) {
                        // await syncLeaderboardScore(); // DISABLED: syncLeaderboardScore resets XP based on current active quests only, causing loss of historical daily quest XP.
                    }

                } // End if (userId)

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
                    attempt_date: getTodayWIB(),
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
                    challenge_date: getTodayWIB(),
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
            const today = getTodayWIB();
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

    // Complete a specific Quest
    const completeQuest = async (category: string, period?: string) => {
        if (!userId) return;

        try {
            // Find the quest by category and matching period
            const quest = quests.find(q =>
                q.category === category && (period ? q.period === period : true)
            );
            if (!quest) {
                console.error('Quest not found for category:', category, 'period:', period);
                return;
            }

            // 1. Check if already completed TODAY
            const { data: existingProgress } = await supabase
                .from('user_quest_progress')
                .select('completed, last_updated')
                .eq('user_id', userId)
                .eq('quest_id', quest.id)
                .maybeSingle();

            const todayWIB = getTodayWIB();
            const lastUpdated = existingProgress?.last_updated || '';
            const isCompletedToday = existingProgress?.completed && lastUpdated.startsWith(todayWIB);

            if (isCompletedToday) {
                // Already completed TODAY, just return
                console.log('Quest already completed today');
                return;
            }

            // 2. Mark as completed in user_quest_progress
            // We use getNowWIB() to store the time in a way that matches our date check
            const { error } = await supabase
                .from('user_quest_progress')
                .upsert({
                    user_id: userId,
                    quest_id: quest.id,
                    completed: true,
                    progress: quest.target_count,
                    last_updated: getNowWIB()
                }, {
                    onConflict: 'user_id,quest_id'
                });

            if (error) throw error;

            // 3. Award XP to Leaderboard
            const { data: currentEntry } = await supabase
                .from('leaderboard_entries')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            const currentScore = currentEntry?.total_score || 0;
            const newScore = currentScore + quest.xp_reward;

            // Update leaderboard entry
            const { error: lbError } = await supabase
                .from('leaderboard_entries')
                .upsert({
                    user_id: userId,
                    total_score: newScore,
                    current_streak: currentEntry?.current_streak || 0,
                    longest_streak: currentEntry?.longest_streak || 0,
                    last_activity_date: new Date().toISOString().split('T')[0],
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            if (lbError) console.error("Failed to update leaderboard XP:", lbError);

            // 4. Update local state
            setQuests(prev => prev.map(q =>
                q.id === quest.id ? { ...q, completed: true, progress: quest.target_count } : q
            ));

            // Show explicit XP toast
            toast.success(`Quest Complete! +${quest.xp_reward} XP`);

        } catch (err) {
            console.error('Error completing quest:', err);
            toast.error('Failed to save progress');
        }
    };

    // Sync Leaderboard Score (Recalculate total XP from all sources)
    const syncLeaderboardScore = async () => {
        if (!userId) return;
        try {
            // 1. Calculate XP from Quests
            const { data: questProgress } = await supabase
                .from('user_quest_progress')
                .select(`
                    completed,
                    quest:quests (xp_reward)
                `)
                .eq('user_id', userId)
                .eq('completed', true);

            const questXp = (questProgress || []).reduce((sum: number, item: any) => {
                return sum + (item.quest?.xp_reward || 0);
            }, 0);

            // 2. Calculate XP from Daily Challenges (Quiz)
            const { data: challengeAttempts } = await supabase
                .from('user_challenge_attempts')
                .select('points_earned')
                .eq('user_id', userId);

            const challengeXp = (challengeAttempts || []).reduce((sum: number, item: any) => {
                return sum + (item.points_earned || 0);
            }, 0);

            const totalScore = questXp + challengeXp;

            // 3. Update Leaderboard
            await supabase
                .from('leaderboard_entries')
                .upsert({
                    user_id: userId,
                    total_score: totalScore,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            console.log(`Leaderboard synced. Total XP: ${totalScore} (Quests: ${questXp}, Challenges: ${challengeXp})`);

        } catch (error) {
            console.error('Error syncing leaderboard:', error);
        }
    };

    return {
        challenges,
        quests,
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
        forceSyncToday,
        completeQuest,
        syncLeaderboardScore
    };
}
