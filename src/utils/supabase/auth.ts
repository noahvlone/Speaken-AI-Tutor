import { createClient } from './instance';
import { UserProfile } from './types';

export async function getCurrentUser(): Promise<UserProfile | null> {
    try {
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();

        console.log('🔍 getCurrentUser - Session exists:', !!session);

        if (error || !session) {
            console.log('❌ getCurrentUser error or no session:', error);
            return null;
        }

        return {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
            created_at: session.user.created_at,
            avatar_url: session.user.user_metadata?.avatar_url || '',
        };
    } catch (error) {
        console.error('❌ getCurrentUser catch error:', error);
        return null;
    }
}

export async function signIn(email: string, password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function signUp(email: string, password: string, fullName: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }
}

export function onAuthStateChange(callback: (user: UserProfile | null) => void) {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
            console.log('🔄 Auth state changed:', event);
            if (session?.user) {
                const profile: UserProfile = {
                    id: session.user.id,
                    email: session.user.email || '',
                    full_name: session.user.user_metadata?.full_name || '',
                    avatar_url: session.user.user_metadata?.avatar_url || '',
                    created_at: session.user.created_at,
                };
                callback(profile);
            } else {
                callback(null);
            }
        }
    );

    return subscription;
}

export async function checkAuth(): Promise<boolean> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
}

export async function signInWithGoogle() {
    const supabase = createClient();

    const redirectUrl = `${window.location.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

