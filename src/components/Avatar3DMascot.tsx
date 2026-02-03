import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface Avatar3DMascotProps {
  message?: string;
  variant?: 'greeting' | 'reading';
}

export function Avatar3DMascot({ message = "Ready to learn English today?", variant = 'greeting' }: Avatar3DMascotProps) {
  const [float, setFloat] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloat((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle at center, #00d4ff, transparent)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative">
        {/* Main avatar container */}
        <motion.div
          className="relative w-48 h-64 md:w-56 md:h-72"
          animate={{
            y: Math.sin(float * (Math.PI / 180)) * 10,
          }}
          transition={{ duration: 0.1 }}
        >
          {/* Head */}
          <div
            className="absolute inset-x-0 top-0 h-40 md:h-48 rounded-t-full bg-gradient-to-br from-cyan-100 via-blue-50 to-white"
            style={{
              boxShadow:
                '0 20px 50px rgba(0, 212, 255, 0.3), inset 0 2px 20px rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Face */}
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
              {/* Eyes */}
              <div className="flex gap-6 mb-4">
                <motion.div
                  className="w-10 h-10 bg-white rounded-full shadow-inner overflow-hidden"
                  animate={{
                    scaleY: [1, 0.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mt-2.5 mx-auto relative">
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </motion.div>
                <motion.div
                  className="w-10 h-10 bg-white rounded-full shadow-inner overflow-hidden"
                  animate={{
                    scaleY: [1, 0.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mt-2.5 mx-auto relative">
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </motion.div>
              </div>

              {/* Nose */}
              <div className="w-3 h-4 bg-blue-100 rounded-full mb-3" />

              {/* Mouth */}
              <motion.div
                className="w-16 h-8 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full"
                style={{
                  boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.2)',
                }}
                animate={{
                  scaleX: variant === 'greeting' ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <div className="w-full h-1/2 bg-gradient-to-b from-red-300 to-red-400 rounded-t-full" />
              </motion.div>
            </div>
          </div>

          {/* Body/Neck */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-gradient-to-b from-cyan-50 to-blue-100 rounded-b-3xl"
            style={{
              boxShadow: '0 10px 30px rgba(0, 212, 255, 0.2)',
            }}
          >
            {/* Book (for reading variant) */}
            {variant === 'reading' && (
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-12 bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg border-2 border-orange-400"
                animate={{
                  rotateZ: [-5, 5, -5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-orange-400" />
              </motion.div>
            )}
          </div>

          {/* Hand waving (for greeting variant) */}
          {variant === 'greeting' && (
            <motion.div
              className="absolute right-0 top-32 w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full"
              style={{
                boxShadow: '0 5px 15px rgba(0, 212, 255, 0.3)',
              }}
              animate={{
                rotate: [0, 20, -20, 0],
                x: [0, 5, -5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <div className="w-3 h-8 bg-gradient-to-b from-cyan-100 to-blue-100 absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
            </motion.div>
          )}
        </motion.div>

        {/* Speech bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute -right-4 -top-4 md:-right-12 md:-top-8"
        >
          <div className="relative bg-white rounded-3xl px-6 py-4 shadow-xl border-2 border-cyan-200 max-w-[200px]">
            <p className="text-sm text-gray-700">{message}</p>
            <div className="absolute -bottom-2 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
            <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-cyan-200" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
