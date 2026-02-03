import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface ProgressData {
  session: string;
  pronunciation: number;
  fluency: number;
  accuracy?: number;
  prosody?: number;
}

export interface ErrorFrequency {
  phoneme: string;
  count: number;
}

export interface SkillDistribution {
  name: string;
  value: number;
}

export interface UserStats {
  totalSessions: number;
  avgPronunciation: number;
  avgFluency: number;
  practiceStreak: number;
}

export function useUserProgress(userId: string | null) {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [errorFrequency, setErrorFrequency] = useState<ErrorFrequency[]>([]);
  const [skillDistribution, setSkillDistribution] = useState<SkillDistribution[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalSessions: 0,
    avgPronunciation: 0,
    avgFluency: 0,
    practiceStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load progress data
  useEffect(() => {
    const loadProgressData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get last 6 weeks of progress
        const sixWeeksAgo = new Date();
        sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

        const { data, error: fetchError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .gte('session_date', sixWeeksAgo.toISOString().split('T')[0])
          .order('session_date', { ascending: true });

        if (fetchError) throw fetchError;

        // Group by week
        const weeklyData: Record<string, { pronunciation: number[], fluency: number[], accuracy: number[], prosody: number[] }> = {};

        data?.forEach((session) => {
          const date = new Date(session.session_date);
          const weekNum = Math.floor((Date.now() - date.getTime()) / (7 * 24 * 60 * 60 * 1000));
          const weekLabel = `Week ${6 - weekNum}`;

          if (!weeklyData[weekLabel]) {
            weeklyData[weekLabel] = { pronunciation: [], fluency: [], accuracy: [], prosody: [] };
          }

          if (session.pronunciation_score) weeklyData[weekLabel].pronunciation.push(session.pronunciation_score);
          if (session.fluency_score) weeklyData[weekLabel].fluency.push(session.fluency_score);
          if (session.accuracy_score) weeklyData[weekLabel].accuracy.push(session.accuracy_score);
          if (session.prosody_score) weeklyData[weekLabel].prosody.push(session.prosody_score);
        });

        // Calculate averages
        const progressArray: ProgressData[] = Object.entries(weeklyData).map(([week, scores]) => ({
          session: week,
          pronunciation: Math.round(scores.pronunciation.reduce((a, b) => a + b, 0) / scores.pronunciation.length) || 0,
          fluency: Math.round(scores.fluency.reduce((a, b) => a + b, 0) / scores.fluency.length) || 0,
          accuracy: Math.round(scores.accuracy.reduce((a, b) => a + b, 0) / scores.accuracy.length) || 0,
          prosody: Math.round(scores.prosody.reduce((a, b) => a + b, 0) / scores.prosody.length) || 0,
        }));

        setProgressData(progressArray);

        // Calculate stats
        if (data && data.length > 0) {
          const totalSessions = data.length;
          const avgPronunciation = Math.round(
            data.reduce((sum, s) => sum + (s.pronunciation_score || 0), 0) / totalSessions
          );
          const avgFluency = Math.round(
            data.reduce((sum, s) => sum + (s.fluency_score || 0), 0) / totalSessions
          );

          // Calculate streak
          let streak = 0;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const sortedDates = data
            .map(s => new Date(s.session_date))
            .sort((a, b) => b.getTime() - a.getTime());

          for (let i = 0; i < sortedDates.length; i++) {
            const sessionDate = new Date(sortedDates[i]);
            sessionDate.setHours(0, 0, 0, 0);

            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            expectedDate.setHours(0, 0, 0, 0);

            if (sessionDate.getTime() === expectedDate.getTime()) {
              streak++;
            } else {
              break;
            }
          }

          setStats({
            totalSessions,
            avgPronunciation,
            avgFluency,
            practiceStreak: streak
          });

          // Get latest scores for skill distribution
          const latest = data[data.length - 1];
          setSkillDistribution([
            { name: 'Pronunciation', value: latest.pronunciation_score || 0 },
            { name: 'Fluency', value: latest.fluency_score || 0 },
            { name: 'Accuracy', value: latest.accuracy_score || 0 },
            { name: 'Prosody', value: latest.prosody_score || 0 },
          ]);
        }

      } catch (err) {
        console.error('Error loading progress data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, [userId]);

  // Load error frequency
  useEffect(() => {
    const loadErrorFrequency = async () => {
      if (!userId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('pronunciation_errors')
          .select('*')
          .eq('user_id', userId)
          .order('error_count', { ascending: false })
          .limit(5);

        if (fetchError) throw fetchError;

        setErrorFrequency(
          data?.map(e => ({
            phoneme: e.phoneme,
            count: e.error_count
          })) || []
        );
      } catch (err) {
        console.error('Error loading error frequency:', err);
      }
    };

    loadErrorFrequency();
  }, [userId]);

  // Helper to ensure scores are valid integers between 0-100
  const clampScore = (score: number | undefined): number | null => {
    if (score === undefined || score === null || isNaN(score)) return null;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  // Save progress session
  const saveProgressSession = async (scores: {
    pronunciation?: number;
    fluency?: number;
    accuracy?: number;
    prosody?: number;
    duration?: number;
    transcript?: string;
    common_mistakes?: any[];
    ai_suggestions?: string[];
    feedback_summary?: string;
    session_type?: 'chat' | 'roleplay';
  }) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      // Use INSERT to save a new session record (History logic)
      // Attempting to save with full timestamp to allow multiple sessions per day
      const { error: saveError } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          session_date: new Date().toISOString(),
          pronunciation_score: clampScore(scores.pronunciation),
          fluency_score: clampScore(scores.fluency),
          accuracy_score: clampScore(scores.accuracy),
          prosody_score: clampScore(scores.prosody),
          session_duration_minutes: scores.duration || 0,
          created_at: new Date().toISOString(),
          transcript: scores.transcript || "",
          common_mistakes: scores.common_mistakes || [],
          ai_suggestions: scores.ai_suggestions || [],
          feedback_summary: scores.feedback_summary || "",
          session_type: scores.session_type || 'roleplay'
        });

      if (saveError) {
        console.error('Save error details:', saveError);
        throw saveError;
      }

      console.log('✅ Session saved successfully!');
    } catch (err) {
      console.error('Error saving progress:', err);
      throw err;
    }
  };

  // Track pronunciation error
  const trackPronunciationError = async (phoneme: string) => {
    if (!userId) return;

    try {
      const { error: upsertError } = await supabase
        .from('pronunciation_errors')
        .upsert({
          user_id: userId,
          phoneme,
          error_count: 1,
          last_occurred_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,phoneme',
          ignoreDuplicates: false
        });

      if (upsertError) throw upsertError;
    } catch (err) {
      console.error('Error tracking pronunciation error:', err);
    }
  };

  return {
    progressData,
    errorFrequency,
    skillDistribution,
    stats,
    loading,
    error,
    saveProgressSession,
    trackPronunciationError
  };
}
