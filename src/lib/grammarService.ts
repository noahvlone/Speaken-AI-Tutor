import { STT_LANGUAGE_LIST } from "../app/lib/constants";

export interface FeedbackItem {
    original: string; // The specific word/phrase in the user's text
    suggestion: string; // The better alternative
    explanation?: string; // Short reason
    type: 'grammar' | 'vocab';
}

export interface AnalysisResult {
    items: FeedbackItem[];
    pronunciationTips?: string[];
    generalFeedback?: string;
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function analyzeText(text: string, userLevel: number): Promise<AnalysisResult> {
    if (!OPENROUTER_API_KEY) {
        console.warn("OpenRouter API Key is missing. Skipping analysis.");
        return { items: [] };
    }

    // Determine complexity based on level
    let levelDesc = "Beginner (A1-A2)";
    if (userLevel > 5 && userLevel <= 15) levelDesc = "Intermediate (B1-B2)";
    if (userLevel > 15) levelDesc = "Advanced (C1-C2)";

    const prompt = `
    Analyze the following English sentence spoken by a ${levelDesc} learner:
    "${text}"

    Goal: Identify specific grammar errors and vocabulary improvements.
    
    Provide output in valid JSON format ONLY with this structure:
    {
      "items": [
        {
          "original": "exact substring from text",
          "suggestion": "corrected version",
          "type": "grammar" or "vocab",
          "explanation": "brief reason"
        }
      ],
      "pronunciationTips": ["general tip 1"],
      "generalFeedback": "Optional encouraging comment"
    }

    Rules:
    1. "original" MUST be the EXACT substring found in the input text. If the error implies a missing word, match the closest surrounding words.
    2. "grammar": Fix errors. "vocab": Suggest better words.
    3. Keep explanations very short.
    4. If no errors, return empty "items".
    5. Do NOT output markdown code blocks, JUST the raw JSON string.
  `;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini", // Fast & Cheap
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error("OpenRouter Error:", data.error);
            return { items: [] };
        }

        const content = data.choices?.[0]?.message?.content?.trim();

        // Clean up potential markdown code blocks if the model ignores the prompt
        const jsonStr = content.replace(/^```json/, '').replace(/```$/, '').trim();

        return JSON.parse(jsonStr) as AnalysisResult;
    } catch (error) {
        console.error("Grammar Analysis Error:", error);
        return { items: [] };
    }
}
