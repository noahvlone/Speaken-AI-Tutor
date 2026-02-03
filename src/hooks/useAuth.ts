import { useState, useEffect } from 'react';
import { getCurrentUser, onAuthStateChange, UserProfile } from '../utils/supabase/client';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        let subscription: any;

        const initAuth = async () => {
            try {
                const currentUser = await getCurrentUser();

                if (currentUser) {
                    setUser(currentUser);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }

            // Listen for auth state changes
            subscription = onAuthStateChange((user) => {
                setUser(user);
                setIsAuthenticated(!!user);
            });
        };

        initAuth();

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    return { isAuthenticated, loading, user };
}
