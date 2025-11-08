import { MessageSquare, Video, CheckCircle2, BarChart3, Mic, Zap, TrendingUp, Trophy, Target, Star, Clock, Award } from 'lucide-react';
import { Button } from './ui/button';
import { AIMotivation } from './AIMotivation';

interface HomePageProps {
  onNavigate: (page: 'chat' | 'roleplay' | 'challenge' | 'progress') => void;
  userName?: string;
}

export function HomePage({ onNavigate, userName = 'User' }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Welcome Banner with Stats */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 shadow-xl mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8" />
              <div>
                <h2>Welcome to Speaken.AI, {userName}! 👋</h2>
                <p className="text-white/90">Great job on your learning streak! Keep it up!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Current Streak</p>
                    <p className="text-2xl">7 Days 🔥</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Learning Time</p>
                    <p className="text-2xl">12.5 hrs</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Level</p>
                    <p className="text-2xl">B1 Intermediate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Chat Mode */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="mb-3">Chat Mode</h2>
            <p className="text-muted-foreground mb-6">
              Latihan menulis dengan analisis grammar otomatis. Dapatkan koreksi dan saran perbaikan instan.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Grammar correction & suggestions</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Vocabulary enhancement</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Real-time feedback</span>
              </li>
            </ul>
            <Button
              onClick={() => onNavigate('chat')}
              className="w-full py-6 rounded-xl shadow-md hover:shadow-lg"
            >
              Start Chat Mode
            </Button>
          </div>

          {/* Roleplay Mode */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all border-2 border-primary/20">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs">Featured</span>
            </div>
            <h2 className="mb-3">Roleplay Mode</h2>
            <p className="text-muted-foreground mb-6">
              Video call dengan AI tutor. Evaluasi pronunciation & fluency secara real-time seperti SpeechAce.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Pronunciation scoring</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Fluency analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Detailed phoneme feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Speech replay & comparison</span>
              </li>
            </ul>
            <Button
              onClick={() => onNavigate('roleplay')}
              className="w-full py-6 rounded-xl shadow-md hover:shadow-lg bg-primary"
            >
              Start Roleplay Mode
            </Button>
          </div>
        </div>

        {/* Daily Challenge Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-md border-2 border-yellow-200 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="mb-1">Daily Challenge</h3>
                <p className="text-muted-foreground">Uji kemampuan bahasa Inggris Anda hari ini! 🎯</p>
              </div>
            </div>
            <Button
              onClick={() => onNavigate('challenge')}
              className="w-full md:w-auto px-8 py-6 rounded-xl shadow-md hover:shadow-lg bg-gradient-to-r from-yellow-500 to-orange-500"
            >
              <Target className="w-5 h-5 mr-2" />
              Start Challenge
            </Button>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-md">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h2>Evaluasi Pronunciation & Fluency Otomatis</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mic className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="mb-2">Real-time Analysis</h4>
              <p className="text-muted-foreground">Analisis pronunciation dan fluency secara langsung</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="mb-2">Detailed Feedback</h4>
              <p className="text-muted-foreground">Feedback spesifik untuk setiap fonem dan intonasi</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="mb-2">Progress Tracking</h4>
              <p className="text-muted-foreground">Pantau perkembangan dari waktu ke waktu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
