export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    created_at?: string;
    avatar_url?: string;
}

export interface ExtendedUserProfile extends UserProfile {
    phone?: string;
    location?: string;
    bio?: string;
    date_of_birth?: string;
}

export interface UserSettings {
    id?: string;
    user_id?: string;
    learning_goal?: string;
    current_level?: string;
    daily_goal_minutes?: number;
    preferred_accent?: string;
    ai_voice_speed?: string;
    daily_reminder?: boolean;
    achievement_notifications?: boolean;
    weekly_report?: boolean;
    tips_suggestions?: boolean;
    theme?: string;
    reduce_animations?: boolean;
    interface_language?: string;
    phone?: string;
    location?: string;
    bio?: string;
    date_of_birth?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ExtendedUserSettings extends UserSettings {
    phone?: string;
    location?: string;
    bio?: string;
    date_of_birth?: string;
}

export interface FrontendSettings {
    learningGoal: string;
    currentLevel: string;
    dailyGoal: string;
    accent: string;
    voiceSpeed: string;
    dailyReminder: boolean;
    achievementNotifications: boolean;
    weeklyReport: boolean;
    tipsSuggestions: boolean;
    theme: string;
    reduceAnimations: boolean;
    language: string;
}
