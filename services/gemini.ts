import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLuxuryGreeting = async (name: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are "Moon", the curator of the "Arix Signature" holiday collection.
      Write a warm, luxurious, and slightly playful Christmas 2025 greeting for a VIP named "${name}".
      
      Constraints:
      1. Context: Christmas 2025.
      2. Tone: Sophisticated but warm, colorful, and enchanting (cute but expensive).
      3. Vocabulary: Use words like "sparkle", "joy", "colorful", "magic", "2025".
      4. Length: Maximum 25 words.
      5. Format: Just the message text. Do not include "From Moon" in the text, that is handled by the UI.
      
      Example output: "May your 2025 be as vibrant as a box of jewels and as sweet as holiday magic."
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Moon is currently away. Please try again later.");
  }
};