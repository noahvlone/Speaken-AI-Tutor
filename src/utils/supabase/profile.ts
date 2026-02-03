import { createClient } from './instance';
import {
    ExtendedUserProfile,
    UserProfile,
    UserSettings,
    ExtendedUserSettings,
    FrontendSettings
} from './types';

export async function getExtendedUserProfile(): Promise<ExtendedUserProfile | null> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
        return null;
    }

    try {
        const baseProfile: ExtendedUserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
            avatar_url: session.user.user_metadata?.avatar_url || '',
            created_at: session.user.created_at,
        };

        const { data: settings } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle() as any;

        if (settings) {
            return {
                ...baseProfile,
                phone: settings.phone || undefined,
                location: settings.location || undefined,
                bio: settings.bio || undefined,
                date_of_birth: settings.date_of_birth || undefined,
            };
        }

        return baseProfile;

    } catch (error) {
        console.error('❌ Error fetching extended profile:', error);
        return null;
    }
}

export async function updateProfile(fullName: string, avatarUrl?: string) {
    const supabase = createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('No active session');
    }

    const updateData: { full_name?: string; avatar_url?: string } = {};

    if (fullName !== undefined && fullName.trim()) {
        updateData.full_name = fullName;
    }

    // ⭐ HANYA update avatar_url jika itu URL (bukan base64)
    if (avatarUrl && !avatarUrl.startsWith('data:image')) {
        updateData.avatar_url = avatarUrl;
    } else if (avatarUrl && avatarUrl.startsWith('data:image')) {
        // Base64 - warning dan skip (simpan ke storage dulu)
        console.warn('⚠️ Base64 avatar detected, skipping auth metadata update');
        console.warn('   Please use uploadAvatar() function to upload to storage first');
    }

    console.log('🔍 Updating profile with data:', updateData);

    // Jika tidak ada data untuk diupdate, return early
    if (Object.keys(updateData).length === 0) {
        console.log('ℹ️ No profile data to update');
        return { user: session.user, error: null };
    }

    const { data, error } = await supabase.auth.updateUser({
        data: updateData,
    });

    if (error) {
        console.error('❌ Auth update error:', error);

        // Handle specific errors
        if (error.message.includes('Payload too large')) {
            throw new Error('Profile data is too large. Please upload avatars to cloud storage instead of using base64.');
        }

        if (error.message.includes('Failed to fetch') || error.code === '0') {
            throw new Error('Network error. Please check your connection.');
        }

        throw new Error(error.message);
    }

    console.log('✅ Profile updated successfully');
    return data;
}

export async function saveExtendedUserProfile(profile: Partial<ExtendedUserProfile>) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
        throw new Error('User not authenticated');
    }

    console.log('🔍 Saving extended profile:', profile);

    try {
        if (profile.full_name !== undefined || profile.avatar_url !== undefined) {
            const updateData: { full_name?: string; avatar_url?: string } = {};

            if (profile.full_name !== undefined) {
                updateData.full_name = profile.full_name;
            }

            if (profile.avatar_url !== undefined) {
                updateData.avatar_url = profile.avatar_url;
            }

            await supabase.auth.updateUser({
                data: updateData,
            });
        }

        const settingsData: Partial<ExtendedUserSettings> = {
            user_id: session.user.id,
            phone: profile.phone,
            location: profile.location,
            bio: profile.bio,
            date_of_birth: profile.date_of_birth,
            updated_at: new Date().toISOString()
        };

        Object.keys(settingsData).forEach(key => {
            const k = key as keyof ExtendedUserSettings;
            if (settingsData[k] === undefined) {
                delete settingsData[k];
            }
        });

        if (Object.keys(settingsData).length > 2) {
            const { error } = await supabase
                .from('user_settings')
                .upsert(settingsData as any, { onConflict: 'user_id' });

            if (error) {
                console.error('❌ Error saving extended profile:', error);
                throw new Error(`Failed to save profile: ${error.message}`);
            }
        }

        console.log('✅ Extended profile saved successfully');
        return { success: true, message: 'Profile saved successfully' };

    } catch (error) {
        console.error('❌ Save extended profile error:', error);
        throw error;
    }
}

export async function updateAvatar(avatarUrl: string) {
    return updateProfile('', avatarUrl);
}

export async function saveUserSettings(settings: Partial<UserSettings>) {
    console.log('🔍 saveUserSettings called with:', settings);

    const supabase = createClient();

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    console.log('🔍 Session user ID:', session?.user?.id);

    if (sessionError) {
        console.error('❌ Session error:', sessionError);
        throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!session?.user) {
        console.error('❌ No authenticated user found in session');
        throw new Error('User not authenticated - no session found');
    }

    const settingsData: Partial<UserSettings> = {
        user_id: session.user.id,
        ...settings,
        updated_at: new Date().toISOString()
    };

    console.log('📊 Prepared data for upsert:', settingsData);

    try {
        const { data, error } = await supabase
            .from('user_settings')
            .upsert(settingsData as any, {
                onConflict: 'user_id'
            })
            .select()
            .maybeSingle();

        if (error) {
            console.error('❌ Database error details:', {
                code: error.code,
                message: error.message,
                details: error.details
            });

            // Handle network errors
            if (error.message?.includes('Failed to fetch') || error.code === '0') {
                throw new Error('Network error. Please check your connection.');
            }

            throw new Error(`Failed to save settings: ${error.message}`);
        }

        console.log('✅ Settings saved successfully:', data);
        return {
            success: true,
            message: 'Settings saved successfully',
            data
        };

    } catch (error) {
        console.error('❌ Save settings catch error:', error);
        throw error;
    }
}

export async function getUserSettings(userId?: string): Promise<UserSettings | null> {
    const supabase = createClient();

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    // Gunakan userId yang dikirim atau dari session
    const targetUserId = userId || session?.user?.id;

    console.log('🔍 getUserSettings - Target User ID:', targetUserId);

    if (sessionError || !targetUserId) {
        console.log('ℹ️ No session or error:', sessionError);
        return null;
    }

    try {
        console.log('🔍 Fetching settings from database for user:', targetUserId);

        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', targetUserId)
            .maybeSingle(); // Gunakan maybeSingle untuk menghindari error 406

        console.log('🔍 Database response:', { data, error });

        if (error) {
            // Handle network errors
            if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
                console.error('❌ Network error fetching settings:', error.message);
                throw new Error('Network error. Please check your connection.');
            }

            // If no data found, return null
            if (error.code === 'PGRST116') {
                console.log('ℹ️ No settings found for user, returning null');
                return null;
            }

            console.error('❌ Database error fetching settings:', error);
            return null;
        }

        console.log('✅ Settings loaded from database:', data);
        return data;

    } catch (error) {
        console.error('❌ Error fetching settings:', error);

        // Return default settings if network error
        if (error instanceof Error && (
            error.message.includes('Network') ||
            error.message.includes('connection') ||
            error.message.includes('timeout')
        )) {
            console.log('🌐 Network error detected, returning null');
            return null;
        }

        return null;
    }
}

export function frontendToDBSettings(frontend: FrontendSettings): Partial<UserSettings> {
    return {
        learning_goal: frontend.learningGoal,
        current_level: frontend.currentLevel,
        daily_goal_minutes: parseInt(frontend.dailyGoal) || 30,
        preferred_accent: frontend.accent,
        ai_voice_speed: frontend.voiceSpeed,
        daily_reminder: frontend.dailyReminder,
        achievement_notifications: frontend.achievementNotifications,
        weekly_report: frontend.weeklyReport,
        tips_suggestions: frontend.tipsSuggestions,
        theme: frontend.theme,
        reduce_animations: frontend.reduceAnimations,
        interface_language: frontend.language,
    };
}

export function dbToFrontendSettings(db: UserSettings | null): FrontendSettings {
    if (!db) {
        console.log('ℹ️ No DB settings, returning defaults');
        return {
            learningGoal: 'general',
            currentLevel: 'b1',
            dailyGoal: '30',
            accent: 'american',
            voiceSpeed: 'normal',
            dailyReminder: true,
            achievementNotifications: true,
            weeklyReport: false,
            tipsSuggestions: true,
            theme: 'light',
            reduceAnimations: false,
            language: 'id',
        };
    }

    console.log('🔄 Converting DB to frontend:', db);
    return {
        learningGoal: db.learning_goal || 'general',
        currentLevel: db.current_level || 'b1',
        dailyGoal: db.daily_goal_minutes?.toString() || '30',
        accent: db.preferred_accent || 'american',
        voiceSpeed: db.ai_voice_speed || 'normal',
        dailyReminder: db.daily_reminder ?? true,
        achievementNotifications: db.achievement_notifications ?? true,
        weeklyReport: db.weekly_report ?? false,
        tipsSuggestions: db.tips_suggestions ?? true,
        theme: db.theme || 'light',
        reduceAnimations: db.reduce_animations ?? false,
        language: db.interface_language || 'id',
    };
}

// Helper function untuk cek koneksi
export async function checkConnection(): Promise<boolean> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase.from('user_settings').select('count').limit(1);

        if (error) {
            console.error('❌ Connection check error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('❌ Connection check catch error:', error);
        return false;
    }
}
