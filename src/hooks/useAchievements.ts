import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Achievement {
    id: string;
    achievement_key: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    requirement_type: string;
    requirement_value: number;
    points: number;
}

export interface UserAchievement {
    id: string;
    achievement_type: string;
    achievement_name: string;
    achievement_description: string;
    earned_at: string;
}

export function useAchievements(userId: string | null) {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAchievements = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                // Load all achievement definitions
                const { data: allAchievements } = await supabase
                    .from('achievement_definitions')
                    .select('*')
                    .order('points', { ascending: true });

                setAchievements(allAchievements || []);

                // Load user's unlocked achievements
                const { data: unlocked } = await supabase
                    .from('user_achievements')
                    .select('*')
                    .eq('user_id', userId)
                    .order('earned_at', { ascending: false });

                setUserAchievements(unlocked || []);
            } catch (error) {
                console.error('Error loading achievements:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAchievements();
    }, [userId]);

    const checkAndUnlock = async (achievementKey: string): Promise<Achievement | null> => {
        if (!userId) return null;

        try {
            // Check if already unlocked
            const existing = userAchievements.find(a => a.achievement_type === achievementKey);
            if (existing) return null;

            // Get achievement definition
            const achievement = achievements.find(a => a.achievement_key === achievementKey);
            if (!achievement) return null;

            // Unlock achievement
            const { error } = await supabase
                .from('user_achievements')
                .insert({
                    user_id: userId,
                    achievement_type: achievementKey,
                    achievement_name: achievement.name,
                    achievement_description: achievement.description
                });

            if (error) throw error;

            // Update local state
            setUserAchievements(prev => [...prev, {
                id: crypto.randomUUID(),
                achievement_type: achievementKey,
                achievement_name: achievement.name,
                achievement_description: achievement.description,
                earned_at: new Date().toISOString()
            }]);

            return achievement;
        } catch (error) {
            console.error('Error unlocking achievement:', error);
            return null;
        }
    };

    const isUnlocked = (achievementKey: string): boolean => {
        return userAchievements.some(a => a.achievement_type === achievementKey);
    };

    const getProgress = (achievementKey: string, currentValue: number): number => {
        const achievement = achievements.find(a => a.achievement_key === achievementKey);
        if (!achievement) return 0;
        return Math.min(100, Math.round((currentValue / achievement.requirement_value) * 100));
    };

    return {
        achievements,
        userAchievements,
        loading,
        checkAndUnlock,
        isUnlocked,
        getProgress
    };
}
