import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Video, BarChart3, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar3DMascot } from './Avatar3DMascot';

interface OnboardingPageProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: MessageSquare,
    title: 'Chat Mode',
    description: 'Latihan menulis dengan analisis grammar otomatis. Dapatkan koreksi dan saran perbaikan instan.',
    features: [
      'Grammar correction & suggestions',
      'Vocabulary enhancement',
      'Real-time feedback'
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Video,
    title: 'Roleplay 3D Mode',
    description: 'Video call dengan AI tutor. Evaluasi pronunciation & fluency secara real-time seperti SpeechAce.',
    features: [
      'Pronunciation scoring',
      'Fluency analysis',
      'Detailed phoneme feedback',
      'Speech replay & comparison'
    ],
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: BarChart3,
    title: 'Track Your Progress',
    description: 'Pantau perkembangan belajar Anda dari waktu ke waktu dengan analitik detail.',
    features: [
      'Weekly progress charts',
      'Improvement trends',
      'Common mistakes identification',
      'Achievement badges'
    ],
    color: 'from-green-500 to-emerald-500'
  }
];

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
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
                {/* Avatar Mascot */}
                <div className="flex justify-center mb-8">
                  <div className="w-40 h-40">
                    <Avatar3DMascot mood="happy" />
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {currentStepData.features.map((feature, index) => (
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
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
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
