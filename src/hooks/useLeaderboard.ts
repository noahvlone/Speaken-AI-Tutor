import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getTodayWIB, getNowWIB } from '../utils/dateUtils';

export interface LeaderboardEntry {
    rank: number;
    user_id: string;
    name: string;
    avatar: string;
    score: number;
    streak: number;
    isCurrentUser?: boolean;
}

export function useLeaderboard(userId: string | null) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load leaderboard data
    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get top 10 users from leaderboard
            const { data: entries, error: fetchError } = await supabase
                .from('leaderboard_entries')
                .select('*')
                .order('total_score', { ascending: false })
                .limit(10);

            if (fetchError) throw fetchError;

            if (!entries || entries.length === 0) {
                setLeaderboard([]);
                return;
            }

            // Fetch public profiles for these users
            const userIds = entries.map(e => e.user_id);
            const { data: profiles } = await supabase
                .from('public_profiles')
                .select('id, full_name, avatar_url')
                .in('id', userIds);

            // Create a map for easy lookup
            const profileMap = new Map();
            if (profiles) {
                profiles.forEach(p => profileMap.set(p.id, p));
            }

            // Format leaderboard data
            const formattedData: LeaderboardEntry[] = entries.map((entry, index) => {
                const profile = profileMap.get(entry.user_id);

                // Fallback logic
                const fullName = profile?.full_name || profile?.username || 'Anonymous User';
                // Use profile avatar if available, otherwise fallback to Dicebear
                const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.user_id}`;

                return {
                    rank: index + 1,
                    user_id: entry.user_id,
                    name: fullName,
                    avatar: avatarUrl,
                    score: entry.total_score || 0,
                    streak: entry.current_streak || 0,
                    isCurrentUser: userId === entry.user_id
                };
            });

            setLeaderboard(formattedData);

            // Find current user's rank
            const userEntry = formattedData.find(e => e.user_id === userId);
            if (userEntry) {
                setCurrentUserRank(userEntry.rank);
            } else if (userId) {
                // User not in top 10, get their actual rank
                const { data: userRankData } = await supabase
                    .from('leaderboard_entries')
                    .select('rank')
                    .eq('user_id', userId)
                    .maybeSingle();

                if (userRankData) {
                    setCurrentUserRank(userRankData.rank);
                }
            }

        } catch (err) {
            console.error('Error loading leaderboard:', err);
            setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeaderboard();
    }, [userId]);

    // Update user score
    const updateUserScore = async (pointsToAdd: number) => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            // Get current entry or create new one
            const { data: currentEntry } = await supabase
                .from('leaderboard_entries')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            const newScore = (currentEntry?.total_score || 0) + pointsToAdd;

            const { error: upsertError } = await supabase
                .from('leaderboard_entries')
                .upsert({
                    user_id: userId,
                    total_score: newScore,
                    current_streak: currentEntry?.current_streak || 0,
                    longest_streak: currentEntry?.longest_streak || 0,
                    last_activity_date: getTodayWIB(),
                    updated_at: getNowWIB()
                }, {
                    onConflict: 'user_id'
                });

            if (upsertError) throw upsertError;

            // Optional: Recalculate ranks (expensive, maybe skip or do server side)
            // await recalculateRanks();

            // Reload leaderboard without page refresh
            await loadLeaderboard();
        } catch (err) {
            console.error('Error updating score:', err);
            throw err;
        }
    };


    // Update streak
    const updateStreak = async () => {
        if (!userId) return;

        try {
            const { data: currentEntry } = await supabase
                .from('leaderboard_entries')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            const today = getTodayWIB();
            const lastActivity = currentEntry?.last_activity_date;

            let newStreak = 1;

            if (lastActivity) {
                const lastDate = new Date(lastActivity);
                const todayDate = new Date(today);
                const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays === 0) {
                    // Same day, keep current streak
                    newStreak = currentEntry.current_streak || 1;
                } else if (diffDays === 1) {
                    // Consecutive day, increment streak
                    newStreak = (currentEntry.current_streak || 0) + 1;
                } else {
                    // Streak broken, reset to 1
                    newStreak = 1;
                }
            }

            const longestStreak = Math.max(newStreak, currentEntry?.longest_streak || 0);

            const { error: updateError } = await supabase
                .from('leaderboard_entries')
                .upsert({
                    user_id: userId,
                    total_score: currentEntry?.total_score || 0,
                    current_streak: newStreak,
                    longest_streak: longestStreak,
                    last_activity_date: today,
                    updated_at: getNowWIB()
                }, {
                    onConflict: 'user_id'
                });

            if (updateError) throw updateError;

        } catch (err) {
            console.error('Error updating streak:', err);
        }
    };

    // Recalculate all ranks
    const recalculateRanks = async () => {
        try {
            // Get all entries sorted by score
            const { data: allEntries } = await supabase
                .from('leaderboard_entries')
                .select('user_id, total_score')
                .order('total_score', { ascending: false });

            if (!allEntries) return;

            // Update ranks
            for (let i = 0; i < allEntries.length; i++) {
                await supabase
                    .from('leaderboard_entries')
                    .update({ rank: i + 1 })
                    .eq('user_id', allEntries[i].user_id);
            }
        } catch (err) {
            console.error('Error recalculating ranks:', err);
        }
    };

    return {
        leaderboard,
        currentUserRank,
        loading,
        error,
        updateUserScore,
        updateStreak,
        recalculateRanks
    };
}
