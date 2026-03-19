import { GoogleGenAI, Type } from "@google/genai";
import { SummaryResult } from "../types";

const API_KEY = process.env.GEMINI_API_KEY || "";

export async function summarizeText(text: string): Promise<SummaryResult> {
  if (!text.trim()) {
    throw new Error("Input text is empty");
  }

  if (!API_KEY) {
    throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          text: `Analyze the following text and provide a structured summary.
          
          Text:
          "${text}"`
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            oneSentenceSummary: {
              type: Type.STRING,
              description: "A concise one-sentence summary of the text.",
            },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly three key points extracted from the text.",
            },
            sentiment: {
              type: Type.STRING,
              enum: ["positive", "neutral", "negative"],
              description: "The overall sentiment of the text.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "A confidence score between 0 and 1 for the analysis.",
            }
          },
          required: ["oneSentenceSummary", "keyPoints", "sentiment"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response received from the AI model.");
    }

    return JSON.parse(resultText) as SummaryResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to summarize text: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during summarization.");
  }
}
