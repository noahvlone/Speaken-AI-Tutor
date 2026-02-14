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

export interface CategorizedError {
  category: string;
  count: number;
  examples: string[];
}

export function useUserProgress(userId: string | null) {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [errorFrequency, setErrorFrequency] = useState<ErrorFrequency[]>([]);
  const [skillDistribution, setSkillDistribution] = useState<SkillDistribution[]>([]);
  const [categorizedErrors, setCategorizedErrors] = useState<CategorizedError[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalSessions: 0,
    avgPronunciation: 0,
    avgAvgFluency: 0, // Typo in previous? No, let's fix
    avgFluency: 0,
    practiceStreak: 0
  } as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load progress data & aggregate mistakes
  useEffect(() => {
    const loadProgressData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .order('session_date', { ascending: true });

        if (fetchError) throw fetchError;

        // Group by week for charts
        const sixWeeksAgo = new Date();
        sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

        const filteredData = data?.filter(s => new Date(s.session_date) >= sixWeeksAgo) || [];
        const weeklyData: Record<string, { pronunciation: number[], fluency: number[], accuracy: number[], prosody: number[] }> = {};

        filteredData.forEach((session) => {
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

        const progressArray: ProgressData[] = Object.entries(weeklyData).map(([week, scores]) => ({
          session: week,
          pronunciation: Math.round(scores.pronunciation.reduce((a, b) => a + b, 0) / (scores.pronunciation.length || 1)) || 0,
          fluency: Math.round(scores.fluency.reduce((a, b) => a + b, 0) / (scores.fluency.length || 1)) || 0,
          accuracy: Math.round(scores.accuracy.reduce((a, b) => a + b, 0) / (scores.accuracy.length || 1)) || 0,
          prosody: Math.round(scores.prosody.reduce((a, b) => a + b, 0) / (scores.prosody.length || 1)) || 0,
        }));

        setProgressData(progressArray);

        // Aggregate All Mistakes for Focus Areas
        const mistakeCounts: Record<string, { count: number, examples: Set<string> }> = {
          'Grammar': { count: 0, examples: new Set() },
          'Vocabulary': { count: 0, examples: new Set() },
          'Pronunciation': { count: 0, examples: new Set() }
        };

        data?.forEach(session => {
          const mistakes = session.common_mistakes || [];
          mistakes.forEach((m: any) => {
            let cat = 'Grammar';
            const text = (m.explanation || m.mistake || "").toLowerCase();
            if (text.includes('pronunciation') || text.includes('sound') || text.includes('accent')) cat = 'Pronunciation';
            else if (text.includes('vocabulary') || text.includes('word choice') || text.includes('lexical')) cat = 'Vocabulary';

            mistakeCounts[cat].count++;
            if (m.mistake && m.mistake !== 'Grammar Error' && m.mistake !== 'Grammar/Mechanics') {
              if (mistakeCounts[cat].examples.size < 3) {
                mistakeCounts[cat].examples.add(m.mistake);
              }
            }
          });
        });

        const errorsList: CategorizedError[] = Object.entries(mistakeCounts).map(([category, d]) => ({
          category,
          count: d.count,
          examples: Array.from(d.examples)
        })).sort((a, b) => b.count - a.count);

        setCategorizedErrors(errorsList);

        // Stats
        if (data && data.length > 0) {
          const totalSessions = data.length;
          const avgPronunciation = Math.round(data.reduce((sum, s) => sum + (s.pronunciation_score || 0), 0) / totalSessions);
          const avgFluency = Math.round(data.reduce((sum, s) => sum + (s.fluency_score || 0), 0) / totalSessions);

          let streak = 0;
          const sortedDates = [...new Set(data.map(s => new Date(s.session_date).toDateString()))]
            .map(d => new Date(d))
            .sort((a, b) => b.getTime() - a.getTime());

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          for (let i = 0; i < sortedDates.length; i++) {
            const expected = new Date(today);
            expected.setDate(today.getDate() - i);
            if (sortedDates[i].toDateString() === expected.toDateString()) streak++;
            else break;
          }

          setStats({
            totalSessions,
            avgPronunciation,
            avgFluency,
            practiceStreak: streak
          });

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

  // Load error frequency (Phonemes)
  useEffect(() => {
    const loadErrorFrequency = async () => {
      if (!userId) return;
      try {
        const { data, error: fetchError } = await supabase
          .from('pronunciation_errors')
          .select('*')
          .eq('user_id', userId)
          .order('error_count', { ascending: false })
          .limit(8);

        if (fetchError) throw fetchError;
        setErrorFrequency(data?.map(e => ({ phoneme: e.phoneme, count: e.error_count })) || []);
      } catch (err) {
        console.error('Error loading error frequency:', err);
      }
    };
    loadErrorFrequency();
  }, [userId]);

  const clampScore = (score: number | undefined): number | null => {
    if (score === undefined || score === null || isNaN(score)) return null;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

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
    if (!userId) throw new Error('User not authenticated');
    try {
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
      if (saveError) throw saveError;
    } catch (err) {
      console.error('Error saving progress:', err);
      throw err;
    }
  };

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
        }, { onConflict: 'user_id,phoneme' });
      if (upsertError) throw upsertError;
    } catch (err) {
      console.error('Error tracking pronunciation error:', err);
    }
  };

  return {
    progressData,
    errorFrequency,
    skillDistribution,
    categorizedErrors,
    stats,
    loading,
    error,
    saveProgressSession,
    trackPronunciationError
  };
}
