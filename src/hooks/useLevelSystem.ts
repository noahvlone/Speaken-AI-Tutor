import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

// XP thresholds for each level
const LEVEL_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    500,    // Level 4
    850,    // Level 5
    1300,   // Level 6
    1850,   // Level 7
    2500,   // Level 8
    3250,   // Level 9
    4100,   // Level 10
    5050,   // Level 11
    6100,   // Level 12
    7250,   // Level 13
    8500,   // Level 14
    9850,   // Level 15
    11300,  // Level 16
    12850,  // Level 17
    14500,  // Level 18
    16250,  // Level 19
    18100,  // Level 20
];

export interface LevelInfo {
    level: number;
    totalXP: number;
    xpForCurrentLevel: number;
    xpToNextLevel: number;
    progressPercent: number;
}

export function useLevelSystem(userId: string | null) {
    const [levelInfo, setLevelInfo] = useState<LevelInfo>({
        level: 1,
        totalXP: 0,
        xpForCurrentLevel: 0,
        xpToNextLevel: 100,
        progressPercent: 0,
    });
    const [loading, setLoading] = useState(true);

    // Calculate level from XP
    const calculateLevel = useCallback((xp: number): LevelInfo => {
        let level = 1;
        for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            if (xp >= LEVEL_THRESHOLDS[i]) {
                level = i + 1;
                break;
            }
        }

        const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
        const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold + 1000;
        const xpInLevel = xp - currentThreshold;
        const xpNeeded = nextThreshold - currentThreshold;
        const progressPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

        return {
            level,
            totalXP: xp,
            xpForCurrentLevel: xpInLevel,
            xpToNextLevel: xpNeeded - xpInLevel,
            progressPercent,
        };
    }, []);

    // Load user's XP
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const loadXP = async () => {
            try {
                const { data, error } = await supabase
                    .from('leaderboard_entries')
                    .select('*')
                    .eq('user_id', userId)
                    .maybeSingle();

                if (error) {
                    // User may not have leaderboard entry yet, that's OK
                    console.warn('Could not load XP:', error.message);
                    setLoading(false);
                    return;
                }

                const totalXP = data?.total_score || 0;
                setLevelInfo(calculateLevel(totalXP));
            } catch (error) {
                console.error('Error loading XP:', error);
            } finally {
                setLoading(false);
            }
        };

        loadXP();
    }, [userId, calculateLevel]);

    // Add XP
    const addXP = useCallback(async (amount: number, source: string = 'manual'): Promise<{ leveledUp: boolean; newLevel: number }> => {
        if (!userId) return { leveledUp: false, newLevel: 1 };

        const oldLevel = levelInfo.level;
        const newTotalXP = levelInfo.totalXP + amount;
        const newLevelInfo = calculateLevel(newTotalXP);

        try {
            // Update leaderboard
            await supabase
                .from('leaderboard_entries')
                .upsert({
                    user_id: userId,
                    total_score: newTotalXP,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'user_id' });

            // Log XP gain (optional, for analytics)
            // This would require an xp_logs table

            setLevelInfo(newLevelInfo);

            return {
                leveledUp: newLevelInfo.level > oldLevel,
                newLevel: newLevelInfo.level,
            };
        } catch (error) {
            console.error('Error adding XP:', error);
            return { leveledUp: false, newLevel: oldLevel };
        }
    }, [userId, levelInfo, calculateLevel]);

    return { ...levelInfo, loading, addXP, calculateLevel };
}
