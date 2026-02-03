import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Video, BarChart3, ArrowRight, Check, Sparkles, Target, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar3DMascot } from './Avatar3DMascot';
import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from '../utils/supabase/client';

interface OnboardingPageProps {
  onComplete: () => void;
}

const steps = [
  {
    type: 'welcome',
    icon: Sparkles,
    title: 'Selamat Datang di Speaken!',
    description: 'Belajar bahasa Inggris dengan AI tutor yang sabar dan menyenangkan.',
    features: [
      'Chat dengan AI tutor',
      'Roleplay dengan avatar 3D',
      'Track progress belajarmu'
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    type: 'level-select',
    icon: Award,
    title: 'Pilih Level Kemampuanmu',
    description: 'Kami akan menyesuaikan pelajaran dengan levelmu.',
    color: 'from-purple-500 to-pink-500',
    options: [
      {
        id: 'beginner',
        title: 'Pemula',
        emoji: '🌱',
        description: 'Belum bisa / baru mulai belajar',
        details: 'Mulai dari dasar: greetings, numbers, colors'
      },
      {
        id: 'intermediate',
        title: 'Menengah',
        emoji: '🌿',
        description: 'Bisa percakapan sederhana',
        details: 'Practice: daily conversations, travel, work'
      },
      {
        id: 'advanced',
        title: 'Mahir',
        emoji: '🌳',
        description: 'Ingin improve lebih lanjut',
        details: 'Master: business, debates, presentations'
      }
    ]
  },
  {
    type: 'goal-select',
    icon: Target,
    title: 'Target Harian',
    description: 'Berapa lama mau belajar tiap hari?',
    color: 'from-amber-500 to-orange-500',
    options: [
      { id: 'casual', title: 'Santai', xp: 20, time: '5 menit', emoji: '☕' },
      { id: 'regular', title: 'Reguler', xp: 50, time: '15 menit', emoji: '📚' },
      { id: 'serious', title: 'Serius', xp: 100, time: '30 menit', emoji: '🔥' }
    ]
  },
  {
    type: 'features',
    icon: MessageSquare,
    title: 'Chat Mode',
    description: 'Latihan menulis dengan analisis grammar otomatis.',
    features: [
      'Grammar correction & suggestions',
      'Vocabulary enhancement',
      'Real-time feedback'
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    type: 'features',
    icon: Video,
    title: 'Roleplay 3D Mode',
    description: 'Video call dengan AI tutor untuk practice speaking.',
    features: [
      'Pronunciation scoring',
      'Fluency analysis',
      'Detailed feedback'
    ],
    color: 'from-purple-500 to-pink-500'
  }
];

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<number>(50);

  const saveSettings = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        console.log('Saving onboarding settings:', { selectedLevel, selectedGoal });

        // Default to 'beginner' if no level selected
        const levelToSave = selectedLevel || 'beginner';

        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id, // Needed for upsert
            english_level: levelToSave,
            daily_xp_goal: selectedGoal,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' }); // Conflict on user_id

        if (error) {
          console.error('Error saving settings to Supabase:', error);
        } else {
          console.log('Settings saved successfully');
        }
      }
    } catch (error) {
      console.error('Error in saveSettings:', error);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      await saveSettings();
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await saveSettings();
    onComplete();
  };


  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${currentStepData.color} p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

            <div className="relative z-10">
              <button
                onClick={handleSkip}
                className="absolute top-0 right-0 text-white/80 hover:text-white transition-colors"
              >
                Skip
              </button>

              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Icon className="w-10 h-10" />
                </div>
              </div>

              <h1 className="text-center mb-2">{currentStepData.title}</h1>
              <p className="text-center text-white/90">{currentStepData.description}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                {/* Conditional Content based on step type */}
                {currentStepData.type === 'level-select' && currentStepData.options ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {currentStepData.options.map((option: any) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedLevel(option.id)}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedLevel === option.id
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-slate-200 hover:border-purple-300 hover:shadow-md'
                          }`}
                      >
                        <div className="text-4xl mb-3">{option.emoji}</div>
                        <h3 className="font-bold text-lg mb-1">{option.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{option.description}</p>
                        <p className="text-xs text-slate-500">{option.details}</p>
                      </button>
                    ))}
                  </div>
                ) : currentStepData.type === 'goal-select' && currentStepData.options ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {currentStepData.options.map((option: any) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedGoal(option.xp)}
                        className={`p-6 rounded-2xl border-2 transition-all text-center ${selectedGoal === option.xp
                          ? 'border-amber-500 bg-amber-50 shadow-lg'
                          : 'border-slate-200 hover:border-amber-300 hover:shadow-md'
                          }`}
                      >
                        <div className="text-4xl mb-3">{option.emoji}</div>
                        <h3 className="font-bold text-lg mb-1">{option.title}</h3>
                        <p className="text-sm text-slate-600 mb-1">{option.time}</p>
                        <p className="text-xs text-slate-500">{option.xp} XP/hari</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Avatar Mascot - only for feature steps */}
                    {currentStepData.type === 'features' && (
                      <div className="flex justify-center mb-8">
                        <div className="w-40 h-40">
                          <Avatar3DMascot />
                        </div>
                      </div>
                    )}

                    {/* Features List */}
                    {currentStepData.features && (
                      <div className="space-y-4 mb-8">
                        {currentStepData.features.map((feature: string, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 bg-secondary/50 rounded-xl p-4"
                          >
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentStepData.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentStep ? 1 : -1);
                    setCurrentStep(index);
                  }}
                  className={`h-2 rounded-full transition-all ${index === currentStep
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-border hover:bg-primary/50'
                    }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {currentStep > 0 && (
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  className="px-8 py-6 rounded-xl"
                >
                  Previous
                </Button>
              )}

              <Button
                onClick={handleNext}
                className={`flex-1 py-6 rounded-xl shadow-md hover:shadow-lg bg-gradient-to-r ${currentStepData.color}`}
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
