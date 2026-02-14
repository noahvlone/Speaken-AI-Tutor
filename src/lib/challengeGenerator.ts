
export interface GrammarChallenge {
    instruction: string;
    hint: string;
    example?: string;
}

export interface PronunciationChallenge {
    word: string;
    phonetic?: string; // Optional
    translation?: string; // Optional context
}

export interface VocabularyChallenge {
    word: string;
    definition: string;
    example: string;
    context: string;
}

// Cache to prevent spamming API on re-renders
const challengeCache = new Map<string, any>();

export async function generateGrammarChallenges(level: string, count: number = 10, mode: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<GrammarChallenge[]> {
    const cacheKey = `grammar-${level}-${count}-${mode}`;
    if (challengeCache.has(cacheKey)) {
        return challengeCache.get(cacheKey);
    }

    // Adjust count based on mode
    let targetCount = count;
    if (mode === 'daily') targetCount = 10;
    if (mode === 'weekly') targetCount = 15;
    if (mode === 'monthly') targetCount = 25;

    let difficultyContext = "";
    if (mode === 'weekly') {
        difficultyContext = "Generate slightly more complex challenges. Focus on compound sentences and specific grammar nuances suitable for the level.";
    } else if (mode === 'monthly') {
        difficultyContext = "Generate comprehensive challenges covering various grammar rules. Include some tricky questions to test mastery. Use engaging themes.";
    }

    const prompt = `Generate ${targetCount} engaging grammar practice challenges for ${level} level English learners. ${difficultyContext}
    Return ONLY a JSON array of objects with this format:
    [{"instruction": "Write a sentence using...", "hint": "Use words like...", "example": "Optional example sentence (REQUIRED for beginner level)"}]
    
    Make the instructions varied and fun. Gamify the experience by using interesting topics (travel, technology, adventures, pop culture).
    For 'beginner' level, YOU MUST provide a simple 'example' sentence in the JSON.
    Do not use markdown formatting.`;

    try {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: prompt,
                model: "gemini-2.0-flash",
            }),
        });

        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "[]";

        // Clean and parse
        const cleaned = content.replace(/```json|```/g, "").trim();
        const json = JSON.parse(cleaned);

        if (Array.isArray(json)) {
            // Ensure we have at least the requested number, or whatever API returned
            challengeCache.set(cacheKey, json);
            return json;
        }
        return getFallbackGrammar(level);
    } catch (e) {
        console.error("Failed to generate grammar challenges:", e);
        return getFallbackGrammar(level);
    }
}

export async function generatePronunciationChallenges(level: string, count: number = 10, mode: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<PronunciationChallenge[]> {
    const cacheKey = `pronunciation-${level}-${count}-${mode}`;

    // Adjust count
    let targetCount = count;
    if (mode === 'daily') targetCount = 10;
    if (mode === 'weekly') targetCount = 15;
    if (mode === 'monthly') targetCount = 25;

    let difficultyContext = "";
    if (mode === 'weekly') {
        difficultyContext = "Include longer words (3+ syllables) and some short phrases.";
    } else if (mode === 'monthly') {
        difficultyContext = "Include complex sentences, tongue twisters, and advanced vocabulary words used in professional contexts.";
    }

    const prompt = `Generate ${targetCount} English words or short phrases for pronunciation practice for ${level} level learners. ${difficultyContext}
    Return ONLY a JSON array of objects:
    [{"word": "example", "translation": "optional definition"}]
    
    Focus on words that are challenging but fun for that level.
    Do not use markdown.`;

    try {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: prompt,
                model: "gemini-2.0-flash",
            }),
        });

        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "[]";

        const cleaned = content.replace(/```json|```/g, "").trim();
        const json = JSON.parse(cleaned);

        if (Array.isArray(json)) {
            return json.map((item: any) => ({
                word: item.word || item.phrase,
                translation: item.translation
            }));
        }
        return getFallbackPronunciation(level);
    } catch (e) {
        console.error("Failed to generate pronunciation challenges:", e);
        return getFallbackPronunciation(level);
    }
}

export async function generateVocabularyChallenges(level: string, count: number = 5): Promise<VocabularyChallenge[]> {
    const cacheKey = `vocab-${level}-${count}`;

    const prompt = `Generate ${count} English vocabulary words (mix of useful nouns, verbs, idioms) for ${level} level learners.
    Return ONLY a JSON array of objects with this format:
    [{"word": "example", "definition": "simple definition", "example": "Sentence using the word.", "context": "When to use it (e.g. Formal, Casual, Business)"}]
    
    Do not use markdown formatting.`;

    try {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: prompt,
                model: "gemini-2.0-flash",
            }),
        });

        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "[]";
        const cleaned = content.replace(/```json|```/g, "").trim();
        const json = JSON.parse(cleaned);

        if (Array.isArray(json)) return json;
        return [];
    } catch (e) {
        console.error("Failed to load vocabulary:", e);
        return [
            { word: "Resilient", definition: "Able to recover quickly from difficult conditions", example: "She is very resilient and never gives up.", context: "General/Personality" },
            { word: "Brainstorm", definition: "Produce an idea or way of solving a problem by holding a spontaneous group discussion", example: "Let's brainstorm some ideas for the project.", context: "Business/Study" },
            { word: "Inevitable", definition: "Certain to happen; unavoidable", example: "Change is inevitable in life.", context: "General" }
        ];
    }
}

// Fallbacks (moved from original static files basically)
function getFallbackGrammar(level: string): GrammarChallenge[] {
    if (level === 'beginner') {
        return [
            { instruction: "Write a sentence about your daily routine.", hint: "Use simple present tense.", example: "I wake up at 7 AM every day." },
            { instruction: "Describe your family.", hint: "Use 'have' and 'is/are'.", example: "I have two brothers and my mother is a teacher." },
            { instruction: "What did you do yesterday?", hint: "Use past tense.", example: "I played soccer with my friends." }
        ];
    }
    return [
        { instruction: "Explain your future career plans.", hint: "Use future tense forms." },
        { instruction: "Describe a hypothetical situation.", hint: "Use conditional sentences (if...)." }
    ];
}

function getFallbackPronunciation(level: string): PronunciationChallenge[] {
    return [
        { word: "Through" },
        { word: "Although" },
        { word: "Successfully" },
        { word: "Particular" },
        { word: "Vocabulary" }
    ];
}
