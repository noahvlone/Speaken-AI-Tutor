import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import {
    Briefcase, Coffee, Building, Plane, Stethoscope, Users,
    ArrowLeft, ChevronRight
} from "lucide-react";

interface Scenario {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    color: string;
    bg: string;
}

const SCENARIOS: Scenario[] = [
    {
        id: "job-interview",
        title: "Job Interview",
        description: "Practice answering common interview questions for a software engineer position.",
        icon: Briefcase,
        difficulty: "Advanced",
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        id: "restaurant",
        title: "Ordering at a Restaurant",
        description: "Learn how to order food, ask for recommendations, and pay the bill.",
        icon: Coffee,
        difficulty: "Beginner",
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        id: "hotel-checkin",
        title: "Hotel Check-in",
        description: "Navigate the check-in process, ask about amenities, and resolve booking issues.",
        icon: Building,
        difficulty: "Intermediate",
        color: "text-purple-600",
        bg: "bg-purple-50"
    },
    {
        id: "airport",
        title: "Airport & Travel",
        description: "Handle check-in, security, customs, and Asking for directions at an airport.",
        icon: Plane,
        difficulty: "Intermediate",
        color: "text-sky-600",
        bg: "bg-sky-50"
    },
    {
        id: "doctor",
        title: "Doctor's Appointment",
        description: "Describe symptoms, understand diagnosis, and ask about treatments.",
        icon: Stethoscope,
        difficulty: "Advanced",
        color: "text-rose-600",
        bg: "bg-rose-50"
    },
    {
        id: "business-meeting",
        title: "Business Meeting",
        description: "Participate in a team meeting, present ideas, and handle Q&A sessions.",
        icon: Users,
        difficulty: "Advanced",
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    }
];

const SpotlightCard = ({ children, onClick, delay = 0 }: { children: React.ReactNode; onClick: () => void; delay: number }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    return (
        <motion.div
            ref={divRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-2xl cursor-pointer"
        >
            <div
                className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
                }}
            />
            <div className="relative z-10 h-full flex flex-col">{children}</div>
        </motion.div>
    );
};

export function RoleplaySelectionPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <button
                        onClick={() => navigate('/chat')}
                        className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-8 group font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Mode Selection
                    </button>

                    <div className="text-center space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
                        >
                            Choose Your Scenario
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-600 max-w-2xl mx-auto"
                        >
                            Select a real-world situation to practice your speaking skills.
                        </motion.p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SCENARIOS.map((scenario, index) => (
                        <SpotlightCard
                            key={scenario.id}
                            delay={index * 0.1}
                            onClick={() => navigate(`/chat/roleplay/${scenario.id}`)}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3.5 rounded-2xl ${scenario.bg} ${scenario.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    <scenario.icon className="w-7 h-7" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${scenario.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        scenario.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}>
                                    {scenario.difficulty}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {scenario.title}
                            </h3>
                            <p className="text-slate-500 text-base leading-relaxed mb-8 flex-1">
                                {scenario.description}
                            </p>

                            <div className="flex items-center text-blue-600 font-bold text-sm bg-blue-50 w-fit px-4 py-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:pl-5 group-hover:pr-3">
                                Start Roleplay <ChevronRight className="w-4 h-4 ml-2" />
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
