import React from 'react';
import { BEGINNER_PROMPTS } from '../lib/aiPrompts';

export interface BeginnerScenario {
    id: string;
    title: string;
    titleId: string;
    description: string;
    difficulty: 'Beginner';
    icon: string;
    suggestedResponses: string[];
    systemPrompt: string;
}

export const BEGINNER_SCENARIOS: BeginnerScenario[] = [
    {
        id: 'say-hello',
        title: 'Say Hello',
        titleId: 'Menyapa',
        description: 'Learn to greet people',
        difficulty: 'Beginner',
        icon: '👋',
        suggestedResponses: ['Hello!', 'Hi!', 'Good morning!', 'My name is...'],
        systemPrompt: BEGINNER_PROMPTS.sayHello,
    },
    {
        id: 'thank-you',
        title: 'Thank You',
        titleId: 'Terima Kasih',
        description: 'Practice being polite',
        difficulty: 'Beginner',
        icon: '🙏',
        suggestedResponses: ['Thank you!', 'Thanks!', 'Please', "You're welcome"],
        systemPrompt: BEGINNER_PROMPTS.thankYou,
    },
    {
        id: 'introduce-yourself',
        title: 'About Me',
        titleId: 'Tentang Saya',
        description: 'Tell about yourself',
        difficulty: 'Beginner',
        icon: '🙋',
        suggestedResponses: ['My name is...', 'I am from...', 'I like...', 'I am ... years old'],
        systemPrompt: BEGINNER_PROMPTS.introduce,
    },
    {
        id: 'numbers',
        title: 'Numbers',
        titleId: 'Angka',
        description: 'Learn numbers 1-20',
        difficulty: 'Beginner',
        icon: '🔢',
        suggestedResponses: ['One', 'Two', 'Five', 'Ten', 'Twenty'],
        systemPrompt: BEGINNER_PROMPTS.numbers,
    },
    {
        id: 'colors',
        title: 'Colors',
        titleId: 'Warna',
        description: 'Learn color names',
        difficulty: 'Beginner',
        icon: '🎨',
        suggestedResponses: ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'],
        systemPrompt: BEGINNER_PROMPTS.colors,
    },
    {
        id: 'family',
        title: 'Family',
        titleId: 'Keluarga',
        description: 'Talk about family',
        difficulty: 'Beginner',
        icon: '👨‍👩‍👧‍👦',
        suggestedResponses: ['My mother', 'My father', 'My sister', 'My brother'],
        systemPrompt: `You are teaching family vocabulary to beginners.
      - Start with: "Let's talk about family! 👨‍👩‍👧‍👦 Do you have a mother?"
      - Teach: mother, father, sister, brother, grandmother, grandfather
      - Use simple questions: "How many brothers do you have?"
      - Keep it personal and relatable`,
    },
    {
        id: 'daily-routine',
        title: 'Daily Routine',
        titleId: 'Rutinitas Harian',
        description: 'Talk about your day',
        difficulty: 'Beginner',
        icon: '🌅',
        suggestedResponses: ['I wake up', 'I eat breakfast', 'I go to school', 'I sleep'],
        systemPrompt: `You are teaching daily routine vocabulary.
      - Start with: "What do you do every day? 🌅"
      - Teach: wake up, eat breakfast, go to school/work, come home, sleep
      - Use present simple tense only
      - Ask: "What time do you wake up?"`,
    },
    {
        id: 'food',
        title: 'Food',
        titleId: 'Makanan',
        description: 'Talk about food you like',
        difficulty: 'Beginner',
        icon: '🍕',
        suggestedResponses: ['I like pizza', 'I eat rice', 'I drink water', 'Delicious!'],
        systemPrompt: `You are teaching food vocabulary.
      - Start with: "What food do you like? 🍕"
      - Teach: rice, noodles, bread, pizza, chicken, fish, vegetables, fruit
      - Teach: I like..., I don't like..., I eat..., I drink...
      - Make it fun and relatable to Indonesian food too`,
    },
];

interface BeginnerScenariosListProps {
    onSelectScenario: (scenario: BeginnerScenario) => void;
}

export function BeginnerScenariosList({ onSelectScenario }: BeginnerScenariosListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BEGINNER_SCENARIOS.map((scenario) => (
                <button
                    key={scenario.id}
                    onClick={() => onSelectScenario(scenario)}
                    className="flex flex-col text-left bg-white border-2 border-green-200 rounded-2xl p-5 
                     hover:shadow-lg hover:border-green-400 transition-all group"
                >
                    <div className="text-4xl mb-3">{scenario.icon}</div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">
                        {scenario.titleId}
                    </h3>
                    <p className="text-sm text-slate-500 mb-3">{scenario.description}</p>
                    <div className="mt-auto">
                        <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 
                           text-xs font-bold rounded-full">
                            Pemula
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
}
