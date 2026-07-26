import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisType, ScamAnalysisResult } from "../types";

export interface AnalysisPayload {
  analysisType: AnalysisType;
  content: string;
  additionalInfo: {
    clientPlatform: string;
    offeredPay: string;
    paymentMethod: string;
    communicationChannel: string;
  };
  imageB64?: string;
  imageMime?: string;
}

export async function analyzeWithClientGemini(payload: AnalysisPayload): Promise<ScamAnalysisResult> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API Key is required for client-side analysis. Please add VITE_GEMINI_API_KEY to your Netlify / environment variables."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
You are an expert Freelance & Remote Work Scam Investigator and Legal/Contract Safety Specialist.
Your task is to analyze freelance job postings, client messages, payment requests, contract clauses, or platform URLs for potential scams, fraud patterns, and exploitation.

Analyze the input thoroughly looking for red flags such as:
1. Fake Check / Equipment Purchase scams (asking freelancer to deposit check & buy equipment from "approved vendors").
2. Off-platform migration traps (insisting on moving from Upwork/Fiverr to Telegram, WhatsApp, Google Chat immediately before hire).
3. Security deposit / Application fee / ID verification fee scams.
4. Unpaid test tasks or massive spec work demands (asking for free finished work).
5. Unrealistic hourly rate vs skills ratio (e.g., $60/hr for simple data entry / retyping PDF).
6. Crypto / Wire Transfer / Zelle / Cash App payment insistences without escrow protection.
7. Overpayment / Refund traps.
8. Identity theft (demanding SSN, passport, bank login upfront).
9. Suspicious phishing links, fake domain spoofs, or suspicious download packages (.exe, .scr files).
10. Unfair contract terms (e.g., perpetual unlimited revision without pay, non-competes, extreme indemnification).

You MUST evaluate objectively, assign an accurate Risk Score (0 = Completely Legitimate, 100 = Definitive Scam), provide categorized red flags and green flags, outline actionable recommended safety steps, and draft a polite, boundary-setting reply the freelancer can copy-paste to stay safe.
`;

  const userPromptText = `
Analysis Type: ${payload.analysisType || "general"}
Primary Content / Text to Evaluate:
"""
${payload.content || "(No text provided, see screenshot image)"}
"""

Additional Context:
- Platform / Channel: ${payload.additionalInfo?.clientPlatform || "Unspecified"}
- Offered Pay / Rate: ${payload.additionalInfo?.offeredPay || "Unspecified"}
- Proposed Payment Method: ${payload.additionalInfo?.paymentMethod || "Unspecified"}
- Communication Channel: ${payload.additionalInfo?.communicationChannel || "Unspecified"}
`;

  const contents: any[] = [];

  if (payload.imageB64) {
    const mime = payload.imageMime || "image/png";
    const pureBase64 = payload.imageB64.includes(",") ? payload.imageB64.split(",")[1] : payload.imageB64;
    contents.push({
      inlineData: {
        mimeType: mime,
        data: pureBase64,
      },
    });
  }

  contents.push({ text: userPromptText });

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titleSnippet: {
            type: Type.STRING,
            description: "A short 4-8 word title describing this scan context",
          },
          riskScore: {
            type: Type.INTEGER,
            description: "Score from 0 to 100 representing scam risk probability",
          },
          riskLevel: {
            type: Type.STRING,
            description: "One of: 'Safe / Legitimate', 'Low Risk', 'Moderate Concern', 'High Scam Risk', 'Extreme Scam Warning'",
          },
          scamType: {
            type: Type.STRING,
            description: "Primary scam pattern name identified",
          },
          summary: {
            type: Type.STRING,
            description: "Clear 2-3 sentence overview of the analysis findings and safety verdict.",
          },
          redFlags: {
            type: Type.ARRAY,
            description: "List of identified red flags and suspicious elements.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING, description: "One of: 'critical', 'high', 'medium', 'low'" },
                category: { type: Type.STRING, description: "Category string" },
              },
              required: ["title", "description", "severity", "category"],
            },
          },
          greenFlags: {
            type: Type.ARRAY,
            description: "List of positive, legitimate signs found in the input.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["title", "description"],
            },
          },
          contractConcerns: {
            type: Type.ARRAY,
            description: "Specific unfair contract clauses.",
            items: { type: Type.STRING },
          },
          recommendedActions: {
            type: Type.ARRAY,
            description: "Step-by-step actionable safety advice.",
            items: { type: Type.STRING },
          },
          suggestedReply: {
            type: Type.STRING,
            description: "A professional response message.",
          },
          safeQuestionsToAsk: {
            type: Type.ARRAY,
            description: "3-4 probing questions to ask the client.",
            items: { type: Type.STRING },
          },
        },
        required: [
          "titleSnippet",
          "riskScore",
          "riskLevel",
          "scamType",
          "summary",
          "redFlags",
          "greenFlags",
          "recommendedActions",
          "suggestedReply",
          "safeQuestionsToAsk",
        ],
      },
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("No response text received from Gemini AI.");
  }

  const parsedResult = JSON.parse(responseText);

  return {
    id: "scan_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now(),
    analysisType: payload.analysisType || "job_post",
    ...parsedResult,
  };
}
