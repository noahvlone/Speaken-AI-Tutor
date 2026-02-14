// Grammar analysis using server-side AI proxy

export interface GrammarError {
    offset: number;
    length: number;
    message: string;
    suggestion: string;
    type: "grammar" | "spelling" | "style" | "pronunciation";
}

// In-memory cache for grammar analysis results
const grammarCache = new Map<string, GrammarError[]>();
const CACHE_MAX_SIZE = 100;

// Use server proxy - API key is stored on server, not browser
export async function analyzeGrammarWithAI(text: string): Promise<GrammarError[]> {
    if (grammarCache.has(text)) {
        return grammarCache.get(text)!;
    }

    // Note: We still ask AI for start/end because it's more conceptual for LLMs, 
    // then we map to offset/length locally.
    const prompt = `Analyze this English sentence from a learner. Identify all grammar, spelling, and style errors.
Return ONLY a pure JSON array of objects with this format:
[{"start": number, "end": number, "message": "string", "suggestion": "string", "type": "grammar" | "spelling" | "style"}]

Rules:
- 'start' and 'end' are 0-based character indices.
- Provide clear, helpful messages.
- If no errors, return [].

Text to analyze: "${text}"`;

    try {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: prompt,
                model: "gemini-2.0-flash",
            }),
        });

        if (!response.ok) return [];

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";

        try {
            const cleaned = content.replace(/```json|```/g, "").trim();
            const json = JSON.parse(cleaned);
            if (Array.isArray(json)) {
                // Map start/end to offset/length
                const mapped: GrammarError[] = json.map((err: any) => ({
                    offset: err.start,
                    length: err.end - err.start,
                    message: err.message,
                    suggestion: err.suggestion,
                    type: err.type
                }));

                if (grammarCache.size >= CACHE_MAX_SIZE) {
                    const firstKey = grammarCache.keys().next().value;
                    if (firstKey) grammarCache.delete(firstKey);
                }
                grammarCache.set(text, mapped);
                return mapped;
            }
        } catch (e) {
            console.error("Failed to parse AI grammar response:", e);
        }
        return [];
    } catch (error) {
        console.error("AI grammar analysis failed:", error);
        return [];
    }
}

export function clearGrammarCache() {
    grammarCache.clear();
}
