import { useState, useEffect } from 'react';
import { useLeaderboard } from './useLeaderboard';
import { useUserProgress } from './useUserProgress';
import { getUserSettings } from '../utils/supabase/client';

export interface HomeStats {
    streak: number;
    level: string;
    accuracy: number;
    xp: number;
    loading: boolean;
}

export function useHomeStats(userId: string | null) {
    const [stats, setStats] = useState<HomeStats>({
        streak: 0,
        level: 'B1',
        accuracy: 0,
        xp: 0,
        loading: true
    });

    const { leaderboard, currentUserRank } = useLeaderboard(userId);
    const { stats: progressStats } = useUserProgress(userId);

    useEffect(() => {
        const loadStats = async () => {
            if (!userId) {
                setStats(prev => ({ ...prev, loading: false }));
                return;
            }

            try {
                // Get user settings for level
                const settings = await getUserSettings(userId);
                const level = settings?.current_level?.toUpperCase() || 'B1';

                // Get streak from leaderboard
                const userEntry = leaderboard.find(e => e.user_id === userId);
                const streak = userEntry?.streak || 0;
                const xp = userEntry?.score || 0;

                // Get accuracy from progress stats
                const accuracy = Math.round((progressStats.avgPronunciation + progressStats.avgFluency) / 2) || 0;

                setStats({
                    streak,
                    level,
                    accuracy,
                    xp,
                    loading: false
                });
            } catch (error) {
                console.error('Error loading home stats:', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        loadStats();
    }, [userId, leaderboard, progressStats]);

    return { ...stats, rank: currentUserRank };
}
