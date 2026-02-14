import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Mic, Volume2, ArrowLeft, CheckCircle2, XCircle, Trophy, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useUserLevel } from '../contexts/LevelContext';
import { useDailyChallenges } from '../hooks/useDailyChallenges';
import { getCurrentUser } from '../utils/supabase/client';
import { generatePronunciationChallenges } from '../lib/challengeGenerator';

// Simple voice synthesis
const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
};

export function PronunciationChallengePage() {
    const navigate = useNavigate();
    const { userLevel } = useUserLevel();
    const [userId, setUserId] = useState<string | null>(null);
    const { completeQuest } = useDailyChallenges(userId);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
    const [score, setScore] = useState(0);

    // Dynamic Content
    const [sessionContent, setSessionContent] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const recognitionRef = useRef<any>(null);

    // Get mode from URL
    const [searchParams] = useSearchParams();
    const mode = (searchParams.get('mode') as 'daily' | 'weekly' | 'monthly') || 'daily';

    // Detect if we are in "Speaking" mode (from URL path)
    const isSpeakingMode = location.pathname.includes('speaking');
    const challengeCategory = isSpeakingMode ? 'Speaking' : 'Pronunciation';

    // Initialize session content on mount
    useEffect(() => {
        getCurrentUser().then(user => {
            if (user) setUserId(user.id);
        });

        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const level = userLevel?.toLowerCase() || 'beginner';
                // Generates items based on mode
                // For Speaking mode (monthly), we might want even longer sentences
                const challenges = await generatePronunciationChallenges(level, 10, mode);
                setSessionContent(challenges.map((c: any) => c.word));
                setCurrentIndex(0);
                setFeedback('idle');
                setTranscript('');
            } catch (error) {
                console.error("Failed to fetch content", error);
                toast.error("Using fallback content due to error.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, [userLevel, mode]); // Added mode dependency

    const currentTarget = sessionContent[currentIndex];
    const totalItems = sessionContent.length;

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                verifyPronunciation(text);
                setIsRecording(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsRecording(false);
                toast.error('Voice not detected. Try again.');
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        } else {
            // toast.error('Browser does not support Speech Recognition.');
        }
    }, [currentTarget]);

    const startRecording = () => {
        if (recognitionRef.current) {
            setTranscript('');
            setFeedback('idle');
            setIsRecording(true);
            recognitionRef.current.start();
        } else {
            toast.error('Device does not support speech recognition');
            // Fallback for testing on non-supported browsers
            // verifyPronunciation(currentTarget); 
        }
    };

    const verifyPronunciation = (spokenText: string) => {
        if (!currentTarget) return;

        // Clean punctuation and lowercase
        const clean = (str: string) => str.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();

        const cleanSpoken = clean(spokenText);
        const cleanTarget = clean(currentTarget);

        // Logic: 
        // 1. Exact match (cleaned)
        // 2. Target contains spoken (if spoken is substantial length) -> Good effort
        // 3. Spoken contains target -> Good effort

        const isMatch = cleanSpoken === cleanTarget ||
            (cleanTarget.includes(cleanSpoken) && cleanSpoken.length > cleanTarget.length * 0.7) ||
            (cleanSpoken.includes(cleanTarget));

        if (isMatch) {
            setFeedback('correct');
            setScore(prev => prev + 1);
            toast.success('Excellent!');
        } else {
            setFeedback('incorrect');
            toast.error('Try again!');
        }
    };

    const nextItem = async () => {
        if (currentIndex < totalItems - 1) {
            setCurrentIndex(prev => prev + 1);
            setFeedback('idle');
            setTranscript('');
        } else {
            // Finish challenge
            await completeQuest(challengeCategory, mode);
            toast.success(`Challenge Complete! XP Earned!`);
            setTimeout(() => navigate('/challenge'), 2000);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
                <p className="text-slate-600 font-medium">Generating {challengeCategory.toLowerCase()} challenges...</p>
                <p className="text-slate-400 text-sm mt-2">Powered by AI</p>
            </div>
        );
    }

    if (!currentTarget) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
                <p className="text-slate-600 mb-4">No content available.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const isSentence = currentTarget.includes(' ');

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col font-sans">
            {/* Header */}
            <div className="max-w-md mx-auto w-full mb-8 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => navigate('/challenge')}>
                    <ArrowLeft className="w-6 h-6 text-slate-700" />
                </Button>
                <div className="flex flex-col items-center">
                    <h1 className="font-bold text-lg text-slate-900">{isSpeakingMode ? 'Speaking Challenge' : 'Pronunciation'}</h1>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{mode} • {userLevel} Level</span>
                </div>
                <div className="w-10" />
            </div>

            <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
                <Card className="border-none shadow-lg overflow-hidden flex-1 flex flex-col">
                    {/* Progress */}
                    <div className="h-2 bg-slate-100 w-full">
                        <div
                            className="h-full bg-pink-500 transition-all duration-300"
                            style={{ width: `${((currentIndex) / totalItems) * 100}%` }}
                        />
                    </div>

                    <CardContent className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">

                        <div className="text-center space-y-4 w-full">
                            <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">
                                {isSentence ? 'Say this sentence' : 'Say this word'}
                            </span>
                            <div className="bg-pink-50 p-6 rounded-2xl border-2 border-pink-100 min-h-[160px] flex items-center justify-center">
                                <h2 className={`${isSentence ? 'text-2xl' : 'text-4xl'} font-black text-slate-900 tracking-tight leading-tight`}>
                                    {currentTarget}
                                </h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-pink-600 hover:bg-pink-50"
                                onClick={() => speak(currentTarget)}
                            >
                                <Volume2 className="w-5 h-5 mr-2" /> Listen
                            </Button>
                        </div>

                        {/* Feedback Area */}
                        <div className="h-24 flex items-center justify-center w-full">
                            {feedback === 'correct' && (
                                <div className="flex flex-col items-center text-green-600 animate-in fade-in zoom-in">
                                    <CheckCircle2 className="w-12 h-12 mb-2" />
                                    <span className="font-bold">Correct!</span>
                                </div>
                            )}
                            {feedback === 'incorrect' && (
                                <div className="flex flex-col items-center text-red-500 animate-in fade-in zoom-in text-center px-4">
                                    <XCircle className="w-12 h-12 mb-2 mx-auto" />
                                    <span className="font-bold block">Incorrect</span>
                                    <span className="text-sm text-slate-400 block mt-1">You said: "{transcript}"</span>
                                </div>
                            )}
                            {feedback === 'idle' && transcript && (
                                <p className="text-slate-400 text-sm">Waiting for result...</p>
                            )}
                        </div>

                        {/* Mic Button */}
                        <div className="relative">
                            {isRecording && (
                                <div className="absolute inset-0 bg-pink-500 rounded-full animate-ping opacity-20"></div>
                            )}
                            <Button
                                size="lg"
                                className={`h-24 w-24 rounded-full shadow-xl transition-all duration-200 ${isRecording
                                    ? 'bg-pink-600 scale-110'
                                    : 'bg-gradient-to-br from-pink-500 to-pink-600 hover:scale-105'
                                    }`}
                                onClick={startRecording}
                                disabled={feedback === 'correct'}
                            >
                                <Mic className={`w-10 h-10 text-white ${isRecording ? 'animate-pulse' : ''}`} />
                            </Button>
                        </div>
                        <p className="text-slate-400 text-sm">
                            {isRecording ? 'Listening...' : 'Tap to Speak'}
                        </p>

                    </CardContent>

                    {/* Footer Actions */}
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                        <div className="font-bold text-slate-400">
                            {currentIndex + 1} / {totalItems}
                        </div>
                        {feedback === 'correct' && (
                            <Button onClick={nextItem} className="bg-slate-900 text-white px-8 rounded-xl shadow-lg hover:bg-slate-800">
                                Next <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                        {feedback === 'incorrect' && (
                            <Button onClick={() => { setFeedback('idle'); setTranscript(''); }} variant="outline" className="rounded-xl">
                                <RefreshCw className="w-4 h-4 mr-2" /> Retry
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
