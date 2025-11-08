import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Singleton Supabase client
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!supabaseClient) {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    supabaseClient = createSupabaseClient(supabaseUrl, publicAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseClient;
}

// User type with metadata
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at?: string;
}

// Get current user profile
export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email || '',
    full_name: session.user.user_metadata?.full_name || '',
    created_at: session.user.created_at,
  };
}

// Sign in with email and password
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

// Sign out
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}

// Update user profile (full_name in metadata)
export async function updateProfile(fullName: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Auth state change listener
export function onAuthStateChange(callback: (user: UserProfile | null) => void) {
  const supabase = createClient();
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || '',
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
