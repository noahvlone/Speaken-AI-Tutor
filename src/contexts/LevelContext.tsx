import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from '../utils/supabase/client';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

interface LevelContextType {
    userLevel: UserLevel;
    setUserLevel: (level: UserLevel) => void;
    loading: boolean;
}

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export function LevelProvider({ children }: { children: ReactNode }) {
    const [userLevel, setUserLevelState] = useState<UserLevel>('intermediate');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserLevel();
    }, []);

    const loadUserLevel = async () => {
        try {
            const user = await getCurrentUser();
            if (user) {
                const { data, error } = await supabase
                    .from('user_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (error) {
                    console.warn('Could not load user level:', error.message);
                    return;
                }

                const level = data?.english_level || data?.current_level || 'intermediate';
                setUserLevelState(level as UserLevel);
            }
        } catch (error) {
            console.error('Error loading user level:', error);
        } finally {
            setLoading(false);
        }
    };

    const setUserLevel = async (level: UserLevel) => {
        setUserLevelState(level);

        try {
            const user = await getCurrentUser();
            if (user) {
                await supabase
                    .from('user_settings')
                    .update({ english_level: level })
                    .eq('user_id', user.id);
            }
        } catch (error) {
            console.error('Error updating user level:', error);
        }
    };

    return (
        <LevelContext.Provider value={{ userLevel, setUserLevel, loading }}>
            {children}
        </LevelContext.Provider>
    );
}

export function useUserLevel() {
    const context = useContext(LevelContext);
    if (context === undefined) {
        throw new Error('useUserLevel must be used within a LevelProvider');
    }
    return context;
}
