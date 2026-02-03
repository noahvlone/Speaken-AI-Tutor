import { chatOpenRouter } from "./openrouter";

export interface GrammarError {
    start: number;
    end: number;
    message: string;
    suggestion: string;
    type: "grammar" | "spelling" | "style";
}

// In-memory cache for grammar analysis results
const grammarCache = new Map<string, GrammarError[]>();
const CACHE_MAX_SIZE = 100; // Limit cache size to prevent memory issues

export async function analyzeGrammarWithAI(text: string): Promise<GrammarError[]> {
    // Check cache first
    if (grammarCache.has(text)) {
        console.log('✅ Grammar cache hit for:', text.substring(0, 30) + '...');
        return grammarCache.get(text)!;
    }

    const apiKey = (import.meta as any).env?.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
        console.warn("VITE_OPENROUTER_API_KEY is missing for grammar analysis");
        return [];
    }

    const prompt = `Analyze this English sentence from a learner. Identity all grammar, spelling, and style errors.
Return ONLY a pure JSON array of objects with this format:
[{"start": number, "end": number, "message": "string", "suggestion": "string", "type": "grammar" | "spelling" | "style"}]

Rules:
- 'start' and 'end' are 0-based character indices.
- Provide clear, helpful messages.
- If no errors, return [].

Text to analyze: "${text}"`;

    try {
        const response = await chatOpenRouter(
            apiKey,
            [{ role: "user", content: prompt }],
            {
                model: "liquid/lfm-2.5-1.2b-instruct:free",
                temperature: 0.1,
                stream: false
            }
        );

        // If it's a non-streaming response
        if ("text" in response) {
            const content = response.text;
            try {
                // Clean markdown code blocks if any
                const cleaned = content.replace(/```json|```/g, "").trim();
                const json = JSON.parse(cleaned);
                if (Array.isArray(json)) {
                    // Cache the result
                    if (grammarCache.size >= CACHE_MAX_SIZE) {
                        // Remove oldest entry (first key)
                        const firstKey = grammarCache.keys().next().value;
                        if (firstKey) grammarCache.delete(firstKey);
                    }
                    grammarCache.set(text, json);
                    return json;
                }
            } catch (e) {
                console.error("Failed to parse AI grammar response:", content, e);
            }
        }
        return [];
    } catch (error) {
        console.error("AI grammar analysis failed:", error);
        return [];
    }
}

// Export function to clear cache if needed
export function clearGrammarCache() {
    grammarCache.clear();
}
