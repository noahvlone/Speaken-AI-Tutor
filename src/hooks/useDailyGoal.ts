import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface DailyGoalState {
    dailyGoal: number;         // Target XP (50, 100, etc.)
    xpEarnedToday: number;     // XP earned today
    goalCompleted: boolean;    // Has reached goal?
    progressPercent: number;   // 0-100
}

export function useDailyGoal(userId: string | null) {
    const [state, setState] = useState<DailyGoalState>({
        dailyGoal: 50,
        xpEarnedToday: 0,
        goalCompleted: false,
        progressPercent: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const loadDailyProgress = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];

                // Get user's daily goal setting - try daily_xp_goal first, fall back to daily_goal_minutes
                const { data: settings } = await supabase
                    .from('user_settings')
                    .select('*')
                    .eq('user_id', userId)
                    .maybeSingle();

                const dailyGoal = settings?.daily_xp_goal || settings?.daily_goal_minutes || 50;

                // Get today's challenge progress
                const { data: challengeProgress } = await supabase
                    .from('daily_challenge_progress')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('challenge_date', today)
                    .maybeSingle();

                const xpEarnedToday = challengeProgress?.points_earned || 0;
                const progressPercent = Math.min(100, Math.round((xpEarnedToday / dailyGoal) * 100));

                setState({
                    dailyGoal,
                    xpEarnedToday,
                    goalCompleted: xpEarnedToday >= dailyGoal,
                    progressPercent,
                });
            } catch (error) {
                console.error('Error loading daily progress:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDailyProgress();
    }, [userId]);

    const setDailyGoal = useCallback(async (newGoal: number) => {
        if (!userId) return;

        try {
            await supabase
                .from('user_settings')
                .upsert({ user_id: userId, daily_xp_goal: newGoal }, { onConflict: 'user_id' });

            setState(prev => ({
                ...prev,
                dailyGoal: newGoal,
                progressPercent: Math.min(100, Math.round((prev.xpEarnedToday / newGoal) * 100)),
                goalCompleted: prev.xpEarnedToday >= newGoal,
            }));
        } catch (error) {
            console.error('Error setting daily goal:', error);
        }
    }, [userId]);

    return { ...state, loading, setDailyGoal };
}
