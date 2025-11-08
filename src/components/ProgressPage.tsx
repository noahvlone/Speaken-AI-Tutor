import { TrendingUp, Award, Calendar, Target } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export function ProgressPage() {
  // Mock data for charts
  const progressData = [
    { session: 'Week 1', pronunciation: 65, fluency: 60 },
    { session: 'Week 2', pronunciation: 70, fluency: 65 },
    { session: 'Week 3', pronunciation: 72, fluency: 68 },
    { session: 'Week 4', pronunciation: 78, fluency: 75 },
    { session: 'Week 5', pronunciation: 82, fluency: 78 },
    { session: 'Week 6', pronunciation: 85, fluency: 82 },
  ];

  const errorFrequency = [
    { phoneme: 'θ (th)', count: 12 },
    { phoneme: 'r', count: 8 },
    { phoneme: 'v', count: 6 },
    { phoneme: 'ð (th)', count: 5 },
    { phoneme: 'l', count: 3 },
  ];

  const skillDistribution = [
    { name: 'Pronunciation', value: 85 },
    { name: 'Fluency', value: 82 },
    { name: 'Accuracy', value: 88 },
    { name: 'Prosody', value: 80 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

  const stats = [
    {
      label: 'Total Sessions',
      value: '24',
      icon: Calendar,
      change: '+4 this week',
      color: 'bg-blue-500',
    },
    {
      label: 'Avg. Pronunciation',
      value: '85',
      icon: Award,
      change: '+15 points',
      color: 'bg-green-500',
    },
    {
      label: 'Avg. Fluency',
      value: '82',
      icon: TrendingUp,
      change: '+22 points',
      color: 'bg-purple-500',
    },
    {
      label: 'Practice Streak',
      value: '12',
      icon: Target,
      change: 'days in a row',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="mb-2">Progress Dashboard</h2>
          <p className="text-muted-foreground">Track your English learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <div className="text-3xl">{stat.value}</div>
                <p className="text-xs text-green-600">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Progress Over Time */}
          <div className="bg-white rounded-3xl p-8 shadow-md">
            <h3 className="mb-6">Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pronunciation"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Pronunciation"
                />
                <Line
                  type="monotone"
                  dataKey="fluency"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Fluency"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Distribution */}
          <div className="bg-white rounded-3xl p-8 shadow-md">
            <h3 className="mb-6">Current Skill Levels</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Common Errors */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-md">
            <h3 className="mb-6">Most Common Pronunciation Errors</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={errorFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="phoneme" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-muted-foreground mt-4 text-center">
              Focus on these sounds to improve faster
            </p>
          </div>

          {/* Improvement Tips */}
          <div className="bg-white rounded-3xl p-8 shadow-md">
            <h3 className="mb-6">Focus Areas</h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="mb-2">Needs Practice</h4>
                <p className="text-muted-foreground">
                  The "th" sound (θ, ð) - Practice words: think, this, brother
                </p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <h4 className="mb-2">Improving</h4>
                <p className="text-muted-foreground">
                  The "r" sound - Continue practicing: right, wrong, career
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <h4 className="mb-2">Great Job!</h4>
                <p className="text-muted-foreground">
                  Vowel sounds - Your vowel pronunciation is excellent
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-8 shadow-md text-white">
          <h3 className="mb-6">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur">
              <Award className="w-12 h-12 mx-auto mb-3" />
              <h4>7 Day Streak</h4>
              <p className="text-white/80">Consistency Champion</p>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur">
              <TrendingUp className="w-12 h-12 mx-auto mb-3" />
              <h4>+20 Points</h4>
              <p className="text-white/80">Pronunciation Master</p>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur">
              <Target className="w-12 h-12 mx-auto mb-3" />
              <h4>20 Sessions</h4>
              <p className="text-white/80">Dedicated Learner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
