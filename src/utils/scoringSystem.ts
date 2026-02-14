
/**
 * Deterministic Scoring System for SpeakenAI
 * 
 * Provides consistent, rule-based grading for Writing and Speaking metrics
 * based on transcript analysis.
 */

import { GrammarError } from "../components/GrammarHighlight";

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export interface SpeakingScoringResult {
    scores: {
        fluency: number;       // Fluency & Coherence
        lexical: number;       // Lexical Resource
        grammar: number;       // Grammatical Range & Accuracy
        pronunciation: number; // Pronunciation
        taskResponse: number;  // Content/Task Response
    };
    finalScore: number;
    feedback: string[];
    mistakes: { mistake: string; correction: string; explanation: string }[];
}

interface ScoringResult {
    scores: {
        taskAchievement: number;
        coherence: number;
        lexical: number;
        grammar: number;
        mechanics: number;
    };
    finalScore: number;
    feedback: string[];
    mistakes: { mistake: string; correction: string; explanation: string }[];
}

// Helper: Calculate readability score (Flesch-Kincaid Grade Level approximation)
function calculateReadability(text: string): number {
    const words = text.trim().split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    // Approximation: syllabes usually ~1.5 per word for intermediate text
    // Flesch-Kincaid Grade Level = 0.39 (total words / total sentences) + 11.8 (total syllables / total words) - 15.59
    const syllables = words * 1.4;
    const score = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
    return Math.min(100, Math.max(0, (score / 12) * 100)); // Normalize 0-12 grade to 0-100
}

// Helper: Count advanced words (length > 6 or specific list if we had one)
function countAdvancedWords(text: string): number {
    const words = text.trim().split(/\s+/);
    return words.filter(w => w.length > 6).length;
}

// Strict Blacklist for Informal Vocabulary
const SLANG_BLACKLIST = [
    "wanna", "gonna", "cuz", "cos", "fav", "idk", "tbh", "btw", "imma", "finna",
    "u", "ur", "r", "b4", "gr8", "thx", "pls", "plz", "yea", "yeah", "nah", "nop",
    "fud"
];

const FORMAL_CONNECTORS = [
    "however", "therefore", "furthermore", "consequently", "moreover", "nonetheless",
    "additionally", "thus", "hence", "nevertheless"
];

function checkVocabulary(text: string): { score: number, mistakes: { word: string, correction: string }[] } {
    const lower = text.toLowerCase();
    const words = lower.split(/\s+/); // crude tokenization
    const mistakes: { word: string, correction: string }[] = [];
    let slangCount = 0;
    let advancedCount = 0;

    words.forEach(w => {
        const clean = w.replace(/[^\w]/g, "");
        if (SLANG_BLACKLIST.includes(clean)) {
            slangCount++;
            mistakes.push({ word: w, correction: "Avoid slang in formal writing." });
        }
        if (FORMAL_CONNECTORS.includes(clean)) {
            advancedCount++;
        }
    });

    // Base 100. Deduct 15 per slang word. Add 5 per formal connector (max 20 bonus).
    let score = 100 - (slangCount * 15);
    score += Math.min(20, advancedCount * 5);

    return {
        score: Math.max(0, Math.min(100, score)),
        mistakes
    };
}

// Strict Local Grammar Checker
export function checkGrammarLocally(text: string): GrammarError[] {
    const errors: GrammarError[] = [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    let currentIndex = 0;

    // 1. Check capitalization at start of text
    if (text.length > 0 && /^[a-z]/.test(text)) {
        errors.push({
            offset: 0,
            length: 1,
            message: "Start sentences with a capital letter.",
            suggestion: text.charAt(0).toUpperCase(),
            type: "style",
            category: "mechanics"
        });
    }

    // 2. I should be capitalized
    const iRegex = /\b(i)\b/g;
    let match;
    while ((match = iRegex.exec(text)) !== null) {
        errors.push({
            offset: match.index,
            length: 1,
            message: "'I' should always be capitalized.",
            suggestion: "I",
            type: "grammar",
            category: "mechanics"
        });
    }

    // 3. Punctuation Check (Strict)
    if (!/[.!?]$/.test(text.trim())) {
        errors.push({
            offset: text.length - 1,
            length: 1,
            message: "End sentence with proper punctuation (. ! ?).",
            suggestion: ".",
            type: "grammar",
            category: "mechanics"
        });
    }

    // 4. A vs An (Simple heuristic)
    const aAnRegex = /\b(a|an)\s+([a-z]+)/gi;
    while ((match = aAnRegex.exec(text)) !== null) {
        const article = match[1].toLowerCase();
        const nextWord = match[2].toLowerCase();
        const isVowelStart = /^[aeiou]/.test(nextWord);

        if (article === 'a' && isVowelStart && !['university', 'honest', 'hour', 'union', 'one'].some(e => nextWord.startsWith(e))) {
            errors.push({
                offset: match.index,
                length: match[0].length,
                message: "Use 'an' before vowel sounds.",
                suggestion: `an ${match[2]}`,
                type: "grammar",
                category: "grammar"
            });
        } else if (article === 'an' && !isVowelStart && !['hour', 'heir', 'honest'].includes(nextWord)) {
            errors.push({
                offset: match.index,
                length: match[0].length,
                message: "Use 'a' before consonant sounds.",
                suggestion: `a ${match[2]}`,
                type: "grammar",
                category: "grammar"
            });
        }
    }

    // 5. Double spaces
    const doubleSpaceRegex = /\s{2,}/g;
    while ((match = doubleSpaceRegex.exec(text)) !== null) {
        errors.push({
            offset: match.index,
            length: match[0].length,
            message: "Avoid double spaces.",
            suggestion: " ",
            type: "style",
            category: "mechanics"
        });
    }

    // 6. Repeated words (e.g. "the the")
    const repeatRegex = /\b(\w+)\s+\1\b/gi;
    while ((match = repeatRegex.exec(text)) !== null) {
        errors.push({
            offset: match.index,
            length: match[0].length,
            message: "Repeated word detected.",
            suggestion: match[1],
            type: "style",
            category: "grammar"
        });
    }

    // 6. Common Slang/Spelling detections as local grammar errors
    const commonSlangMap: { [key: string]: string } = {
        "fud": "food",
        "u": "you",
        "ur": "your",
        "r": "are",
        "thx": "thanks",
        "pls": "please"
    };

    Object.keys(commonSlangMap).forEach(slang => {
        const regex = new RegExp(`\\b${slang}\\b`, 'gi');
        while ((match = regex.exec(text)) !== null) {
            errors.push({
                offset: match.index,
                length: match[0].length,
                message: `Avoid slang. Use '${commonSlangMap[slang]}'.`,
                suggestion: commonSlangMap[slang],
                type: "style",
                category: "lexical"
            });
        }
    });

    return errors;
}

export function evaluateWritingPerformance(
    chatHistory: ChatMessage[],
    grammarErrors: Record<string, GrammarError[]> // This parameter is no longer used in the new logic
): WritingScoringResult {
    const userMessages = chatHistory.filter(m => m.role === 'user');
    const fullText = userMessages.map(m => m.content).join(" ");
    const wordCount = fullText.split(/\s+/).length;

    // 0. Safety Check
    if (wordCount < 3) {
        return {
            scores: { taskAchievement: 1, coherence: 1, lexical: 1, grammar: 1, mechanics: 1 },
            finalScore: 0,
            feedback: ["Please write more to get an assessment."],
            mistakes: []
        };
    }

    // --- 1. Task Achievement (Isi) ---
    // Adjusted to be VERY lenient: > 10 words = 5
    let taskScore = 1;
    if (wordCount > 10) taskScore = 5;
    else if (wordCount > 5) taskScore = 4;
    else if (wordCount > 2) taskScore = 3;
    else taskScore = 2;

    // --- 2. Coherence & Cohesion (Struktur) ---
    // Connector usage
    const connectors = ['because', 'therefore', 'however', 'but', 'and', 'so', 'then', 'although', 'while', 'next', 'finally', 'first', 'second', 'also', 'or', 'if', 'when'];
    const connectorCount = connectors.reduce((acc, note) => acc + (fullText.toLowerCase().includes(note) ? 1 : 0), 0);

    // Adjusted: >= 1 connector OR long enough text = 5
    let coherenceScore = 1;
    if (connectorCount >= 1 || wordCount > 15) coherenceScore = 5;
    else if (wordCount > 8) coherenceScore = 4;
    else if (wordCount > 3) coherenceScore = 3;
    else coherenceScore = 2;

    // --- 3. Lexical Resource (Kosakata) ---
    // Slang check + Diversity
    const vocabCheck = checkVocabulary(fullText); // Returns score 0-100 & mistakes
    const slangCount = vocabCheck.mistakes.length;
    // Base 5. -1 per slang.
    let lexicalScore = 5 - Math.min(4, slangCount);
    // Penalty if vocab is too simple (unique words < 30% of total)
    const uniqueWords = new Set(fullText.toLowerCase().split(/\s+/).filter(w => w.length > 0)).size; // Filter empty strings
    if (uniqueWords / wordCount < 0.3) lexicalScore = Math.max(1, lexicalScore - 1);

    // --- 4. Grammatical Range & Accuracy (Tata Bahasa) ---
    // & 5. Mechanics (Kerapian)
    const allErrors = checkGrammarLocally(fullText); // We need to classify these

    let grammarErrorsCount = 0;
    let mechanicsErrorsCount = 0;
    let lexicalErrorsCount = 0; // For errors caught by checkGrammarLocally that are lexical

    allErrors.forEach(e => {
        if (e.category === "mechanics") {
            mechanicsErrorsCount++;
        } else if (e.category === "grammar") {
            grammarErrorsCount++;
        } else if (e.category === "lexical") {
            lexicalErrorsCount++;
        }
    });

    // Grammar Score: VERY Lenient
    let grammarScore = 1;
    if (grammarErrorsCount <= 2) grammarScore = 5;
    else if (grammarErrorsCount <= 4) grammarScore = 4;
    else if (grammarErrorsCount <= 6) grammarScore = 3;
    else grammarScore = 2;

    // Mechanics Score
    let mechanicsScore = 1;
    if (mechanicsErrorsCount <= 2) mechanicsScore = 5;
    else if (mechanicsErrorsCount <= 4) mechanicsScore = 4;
    else if (mechanicsErrorsCount <= 6) mechanicsScore = 3;
    else mechanicsScore = 2;

    // Add lexical errors from checkGrammarLocally to lexicalScore penalty
    lexicalScore = Math.max(1, lexicalScore - lexicalErrorsCount);

    // --- Final Calculation ---
    const totalScore = taskScore + coherenceScore + lexicalScore + grammarScore + mechanicsScore;
    const finalScoreRaw = (totalScore / 25) * 100;

    // Compile Mistakes
    const mistakes = [
        ...vocabCheck.mistakes.map(m => ({
            mistake: m.word,
            correction: m.correction,
            explanation: "Informal/Slang usage detected."
        })),
        ...allErrors.slice(0, 5).map(e => ({
            mistake: "Grammar/Mechanics", // Can be more specific if needed
            correction: e.suggestion || "",
            explanation: e.message
        }))
    ];

    const getRubricLabel = (s: number) => {
        if (s === 5) return "Excellent";
        if (s === 4) return "Good";
        if (s === 3) return "Fair";
        return "Poor";
    };

    return {
        scores: {
            taskAchievement: taskScore,
            coherence: coherenceScore,
            lexical: lexicalScore,
            grammar: grammarScore,
            mechanics: mechanicsScore
        },
        finalScore: Math.round(finalScoreRaw),
        mistakes: mistakes.slice(0, 5),
        feedback: [
            `Task Achievement: ${getRubricLabel(taskScore)}`,
            `Coherence: ${getRubricLabel(coherenceScore)}`,
            `Lexical: ${getRubricLabel(lexicalScore)}`,
            `Grammar: ${getRubricLabel(grammarScore)}`,
            `Mechanics: ${getRubricLabel(mechanicsScore)}`
        ]
    };
}

export function evaluateSpeakingPerformance(
    chatHistory: ChatMessage[],
    durationMinutes: number
): SpeakingScoringResult {
    const userMessages = chatHistory.filter(m => m.role === 'user');
    const fullText = userMessages.map(m => m.content).join(" ");
    const words = fullText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // Safety check for minimal input
    if (wordCount < 5) {
        return {
            scores: { fluency: 1, lexical: 1, grammar: 1, pronunciation: 1, taskResponse: 1 },
            finalScore: 1,
            feedback: ["Session duration too short for valid IELTS assessment."],
            mistakes: []
        };
    }

    // --- 1. Fluency & Coherence (WPM based) ---
    // Ideal IELTS speed is ~100-140 WPM for Band 7-9.
    const wpm = wordCount / Math.max(0.5, durationMinutes);
    let fluencyBand = 4.0;
    if (wpm > 130) fluencyBand = 9.0;
    else if (wpm > 110) fluencyBand = 8.0;
    else if (wpm > 90) fluencyBand = 7.0;
    else if (wpm > 70) fluencyBand = 6.0;
    else if (wpm > 50) fluencyBand = 5.0;
    else fluencyBand = 4.0;

    // Bonus for connector variety
    const connectors = ['however', 'therefore', 'consequently', 'furthermore', 'nevertheless', 'additionally'];
    const uniqueConnectors = connectors.filter(c => fullText.toLowerCase().includes(c)).length;
    fluencyBand += Math.min(1.0, uniqueConnectors * 0.2);

    // --- 2. Lexical Resource (Variety & Complexity) ---
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const varietyRatio = uniqueWords / wordCount;
    const advancedWords = words.filter(w => w.length > 7).length;
    const advancedRatio = advancedWords / wordCount;

    let lexicalBand = 4.0;
    if (varietyRatio > 0.6 && advancedRatio > 0.15) lexicalBand = 8.5;
    else if (varietyRatio > 0.5 && advancedRatio > 0.10) lexicalBand = 7.5;
    else if (varietyRatio > 0.4) lexicalBand = 6.0;
    else lexicalBand = 5.0;

    // --- 3. Grammatical Range & Accuracy (Error density) ---
    const grammarErrors = checkGrammarLocally(fullText);
    const errorCount = grammarErrors.filter(e => e.category === 'grammar').length;
    const errorsPer100 = (errorCount / wordCount) * 100;

    let grammarBand = 9.0;
    if (errorsPer100 === 0 && wordCount > 30) grammarBand = 9.0;
    else if (errorsPer100 < 2) grammarBand = 8.0;
    else if (errorsPer100 < 5) grammarBand = 7.0;
    else if (errorsPer100 < 10) grammarBand = 6.0;
    else if (errorsPer100 < 15) grammarBand = 5.0;
    else grammarBand = 4.0;

    // --- 4. Pronunciation Proxy (Complexity success) ---
    // If you use complex words and the STT captures them, it implies clear pronunciation.
    let pronunciationBand = 5.5;
    if (advancedWords > 8) pronunciationBand = 8.5;
    else if (advancedWords > 4) pronunciationBand = 7.5;
    else if (advancedWords > 2) pronunciationBand = 6.5;

    // --- Final Calculation ---
    const rawAverage = (fluencyBand + lexicalBand + grammarBand + pronunciationBand) / 4;
    const finalBand = Math.round(rawAverage * 2) / 2; // Round to nearest 0.5

    // Mistakes mapping
    const mistakes = grammarErrors.slice(0, 3).map(e => ({
        mistake: "Grammar Error",
        correction: e.suggestion || "Check grammar",
        explanation: e.message
    }));

    return {
        scores: {
            fluency: Math.min(9, fluencyBand),
            lexical: Math.min(9, lexicalBand),
            grammar: Math.min(9, grammarBand),
            pronunciation: Math.min(9, pronunciationBand),
            taskResponse: finalBand
        },
        finalScore: finalBand,
        mistakes,
        feedback: [
            `Speech Rate: ${Math.round(wpm)} words per minute.`,
            `Lexical Variety: ${Math.round(varietyRatio * 100)}% unique vocabulary used.`,
            `Grammatical Accuracy: ${Math.round(100 - (errorsPer100))}% error-free sentences (estimated).`,
            `Complexity Score: ${advancedWords} advanced linguistic tokens detected.`
        ]
    };
}
