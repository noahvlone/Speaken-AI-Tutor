import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar3DMascot } from './Avatar3DMascot';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <div>
                    <h3>Confirm Logout</h3>
                    <p className="text-white/80">See you next time!</p>
                  </div>
                </div>
              </div>

              {/* Avatar with waving animation */}
              <div className="relative p-8 bg-gradient-to-br from-blue-50 to-purple-50">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 14, -8, 14, -4, 10, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: 'easeInOut',
                    }}
                    className="w-32 h-32"
                  >
                    <Avatar3DMascot mood="happy" />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mt-6"
                >
                  <p className="text-lg mb-2">
                    Thanks for learning with us today! 👋
                  </p>
                  <p className="text-muted-foreground">
                    Are you sure you want to logout?
                  </p>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-white space-y-3">
                <Button
                  onClick={onConfirm}
                  className="w-full py-6 rounded-xl shadow-md hover:shadow-lg bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Yes, Logout
                </Button>
                
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full py-6 rounded-xl"
                >
                  Stay Logged In
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
