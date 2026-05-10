import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function scoreContributor(
  contributorName: string,
  events: string[]
) {
  const prompt = `
You are evaluating contributor activity for a creator-token community.

Your goal is to identify meaningful contributions that improve:
- community education
- member growth
- member retention
- culture health

Avoid rewarding:
- spam
- engagement farming
- repetitive low-effort content
- toxic behavior

Scoring weights:
- Education Quality: 30%
- Growth Impact: 25%
- Retention Signal: 25%
- Culture Health: 20%

Contributor Name:
${contributorName}

Contributor Events:
${events.map((e, i) => `${i + 1}. ${e}`).join("\n")}

Return ONLY valid JSON in this exact format:

{
  "education_score": 0,
  "growth_score": 0,
  "retention_score": 0,
  "culture_score": 0,
  "final_score": 0,
  "badge": "string",
  "reasoning": "string"
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Empty Gemini response");
  }

  // Remove Markdown code fences if present.
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(cleaned);
}