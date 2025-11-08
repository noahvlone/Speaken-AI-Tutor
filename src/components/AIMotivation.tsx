import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Target, Award } from 'lucide-react';
import { Card } from './ui/card';

interface AIMotivationProps {
  type?: 'success' | 'encouragement' | 'milestone' | 'tip';
}

const motivationMessages = {
  success: [
    {
      icon: Award,
      title: "Excellent Work!",
      message: "You're making fantastic progress! Your pronunciation has improved by 15% this week. Keep it up! 🎉",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUp,
      title: "Great Job!",
      message: "Your grammar accuracy is now at 85%! You're doing amazing! Continue practicing and you'll reach 90% soon! 💪",
      color: "from-blue-500 to-cyan-500"
    }
  ],
  encouragement: [
    {
      icon: Sparkles,
      title: "Keep Going!",
      message: "Every expert was once a beginner. You're on the right path! Practice a little each day for best results. 🌟",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "You're Doing Great!",
      message: "Remember, consistency is key! Even 15 minutes a day makes a big difference. You've got this! 🎯",
      color: "from-orange-500 to-red-500"
    }
  ],
  milestone: [
    {
      icon: Award,
      title: "Milestone Achieved!",
      message: "Congratulations! You've completed 7 days of learning streak! Keep the momentum going! 🏆",
      color: "from-yellow-500 to-orange-500"
    }
  ],
  tip: [
    {
      icon: Sparkles,
      title: "Pro Tip",
      message: "Try practicing with the Roleplay Mode! Speaking practice helps reinforce what you've learned in Chat Mode. 💡",
      color: "from-indigo-500 to-purple-500"
    }
  ]
};

export function AIMotivation({ type = 'encouragement' }: AIMotivationProps) {
  const messages = motivationMessages[type];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const Icon = randomMessage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`p-6 bg-gradient-to-r ${randomMessage.color} text-white shadow-xl relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
        
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <motion.div
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut',
              }}
            >
              <Icon className="w-6 h-6" />
            </motion.div>

            {/* Content */}
            <div className="flex-1">
              <h4 className="mb-2 text-white">{randomMessage.title}</h4>
              <p className="text-white/90 leading-relaxed">
                {randomMessage.message}
              </p>
            </div>
          </div>
        </div>

        {/* Animated sparkles */}
        <motion.div
          className="absolute top-4 right-4"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="w-5 h-5 text-white/60" />
        </motion.div>
      </Card>
    </motion.div>
  );
}
