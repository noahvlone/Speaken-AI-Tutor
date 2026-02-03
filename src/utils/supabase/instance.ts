import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Singleton Supabase client with network error handling
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;
let isInitializing = false;

export function createClient() {
    if (!supabaseClient && !isInitializing) {
        isInitializing = true;
        try {
            const supabaseUrl = `https://${projectId}.supabase.co`;
            supabaseClient = createSupabaseClient(supabaseUrl, publicAnonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: false,
                },
                global: {
                    headers: {
                        'X-Client-Info': 'supabase-js-react/1.0',
                    },
                    fetch: (url, options) => {
                        // Custom fetch dengan timeout dan retry
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

                        return fetch(url, {
                            ...options,
                            signal: controller.signal,
                        })
                            .then(response => {
                                clearTimeout(timeoutId);
                                return response;
                            })
                            .catch(error => {
                                clearTimeout(timeoutId);
                                if (error.name === 'AbortError') {
                                    throw new Error('Request timeout. Please check your connection.');
                                }
                                throw error;
                            });
                    },
                },
            });
        } finally {
            isInitializing = false;
        }
    }

    if (!supabaseClient) {
        throw new Error('Failed to initialize Supabase client');
    }

    return supabaseClient;
}
