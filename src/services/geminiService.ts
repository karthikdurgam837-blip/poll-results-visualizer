import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

export async function generatePollInsights(dataSummary: string) {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    You are a Senior Data Analyst. I will provide you with a summary of poll results.
    Your task is to provide:
    1. A concise overview of the leading trends.
    2. Key demographic patterns (which group prefers what?).
    3. Actionable recommendations based on the data.
    4. A sentiment summary of the textual feedback.
    
    Keep the response professional, data-driven, and brief. Use bullet points.
    
    POLL SUMMARY:
    ${dataSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Failed to generate AI insights. Please check your connection or API key.";
  }
}
