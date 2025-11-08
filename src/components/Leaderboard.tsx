import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  streak: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    score: 2850,
    streak: 21
  },
  {
    rank: 2,
    name: 'Michael Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    score: 2720,
    streak: 18
  },
  {
    rank: 3,
    name: 'Emma Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    score: 2650,
    streak: 15
  },
  {
    rank: 4,
    name: 'You',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
    score: 2480,
    streak: 7
  },
  {
    rank: 5,
    name: 'David Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    score: 2320,
    streak: 12
  }
];

export function Leaderboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-orange-500';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <Card className="p-6 shadow-xl bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3>Leaderboard</h3>
          <p className="text-muted-foreground">Top learners this week</p>
        </div>
      </div>

      <div className="space-y-3">
        {mockLeaderboard.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
              entry.name === 'You'
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 shadow-md'
                : 'bg-secondary/50 hover:bg-secondary'
            }`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
              {entry.rank <= 3 ? (
                <div className={`w-10 h-10 bg-gradient-to-br ${getRankBadgeColor(entry.rank)} rounded-full flex items-center justify-center shadow-md`}>
                  {getRankIcon(entry.rank)}
                </div>
              ) : (
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>
              )}
            </div>

            {/* Avatar & Name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="w-10 h-10 ring-2 ring-border">
                <AvatarImage src={entry.avatar} />
                <AvatarFallback>{entry.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate">
                  {entry.name}
                  {entry.name === 'You' && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                      You
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  <span>{entry.streak} day streak</span>
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <p className="font-mono">{entry.score.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
        <p className="text-center text-sm text-muted-foreground">
          Keep practicing to climb the leaderboard! 🚀
        </p>
      </div>
    </Card>
  );
}
