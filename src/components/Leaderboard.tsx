import { Trophy, Medal, Award, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getCurrentUser } from '../utils/supabase/client';
import { useState, useEffect } from 'react';

export function Leaderboard() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) setUserId(user.id);
    });
  }, []);

  const { leaderboard, loading, error } = useLeaderboard(userId);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-slate-500">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-amber-100';
      case 2:
        return 'bg-slate-100';
      case 3:
        return 'bg-amber-50';
      default:
        return 'bg-slate-100';
    }
  };

  const HeaderSection = () => (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
        <Trophy className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">Leaderboard</h3>
        <p className="text-sm text-slate-500">Top learners this week</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6 border-slate-200">
            <HeaderSection />
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6 border-slate-200">
            <HeaderSection />
            <div className="text-center py-12">
              <p className="text-red-500 font-medium">Error loading leaderboard</p>
              <p className="text-slate-500 text-sm mt-1">{error}</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6 border-slate-200">
            <HeaderSection />
            <div className="text-center py-12">
              <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No leaderboard data yet</p>
              <p className="text-sm text-slate-500 mt-1">Complete challenges to appear here!</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 border-slate-200">
          <HeaderSection />

          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.user_id}
                className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${entry.isCurrentUser
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-slate-50 hover:bg-slate-100'
                  }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
                  <div className={`w-9 h-9 ${getRankBadgeColor(entry.rank)} rounded-full flex items-center justify-center`}>
                    {getRankIcon(entry.rank)}
                  </div>
                </div>

                {/* Avatar & Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                      {entry.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {entry.name}
                      {entry.isCurrentUser && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                          You
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <TrendingUp className="w-3 h-3" />
                      <span>{entry.streak} day streak</span>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{entry.score.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">points</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-center text-sm text-slate-600">
              Keep practicing to climb the leaderboard! 🚀
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
