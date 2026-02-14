import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, LogIn, Chrome, Sparkles, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Avatar3DMascot } from "./Avatar3DMascot";
import { signIn, signInWithGoogle } from "../utils/supabase/client";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back to Speaken.AI! 🎉');
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Note: Redirect happens automatically via Supabase OAuth
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to login with Google');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-cyan-200 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/60 shadow-2xl">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Speaken.AI</h2>
                </div>

                {/* Header */}
                <div className="mb-8">
                  <h1 className="mb-2">
                    Welcome Back!
                  </h1>
                  <p className="text-muted-foreground">
                    Masuk untuk melanjutkan belajar dengan AI assistant kamu.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Email */}
                  <div>
                    <Label
                      htmlFor="email"
                      className="mb-2 block"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="nama@email.com"
                        className="pl-12 h-14 rounded-xl bg-white/60 border-white/80 focus:border-cyan-400 focus:ring-cyan-400/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <Label
                      htmlFor="password"
                      className="mb-2 block"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="••••••••"
                        className="pl-12 h-14 rounded-xl bg-white/60 border-white/80 focus:border-cyan-400 focus:ring-cyan-400/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Remember me & Forgot password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="remember"
                        className="cursor-pointer text-sm"
                      >
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Login button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Login
                      </>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/40 text-muted-foreground">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Social login buttons */}
                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white/60 border border-gray-200 hover:bg-white hover:border-cyan-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
                  </button>
                </div>

                {/* Sign up link */}
                <p className="mt-8 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-cyan-600 hover:text-cyan-700 transition-colors"
                  >
                    Sign Up here
                  </button>
                </p>
              </div>
            </motion.div>

            {/* Right side - 3D Avatar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="w-full h-[500px]">
                <Avatar3DMascot
                  message="Ready to learn English today?"
                  variant="greeting"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}