import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Helper to instantiate Gemini AI on demand
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Route: Analyze Freelance Listing / Message / Contract / URL
app.post("/api/analyze", async (req, res) => {
  try {
    const { analysisType, content, additionalInfo, imageB64, imageMime } = req.body;

    if (!content && !imageB64) {
      return res.status(400).json({ error: "Please provide text content or upload an image to analyze." });
    }

    const ai = getGeminiClient();

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

    let userPromptText = `
Analysis Type: ${analysisType || "general"}
Primary Content / Text to Evaluate:
"""
${content || "(No text provided, see screenshot image)"}
"""

Additional Context:
- Platform / Channel: ${additionalInfo?.clientPlatform || "Unspecified"}
- Offered Pay / Rate: ${additionalInfo?.offeredPay || "Unspecified"}
- Proposed Payment Method: ${additionalInfo?.paymentMethod || "Unspecified"}
- Communication Channel: ${additionalInfo?.communicationChannel || "Unspecified"}
`;

    const contents: any[] = [];

    if (imageB64) {
      const mime = imageMime || "image/png";
      // Extract pure base64
      const pureBase64 = imageB64.includes(",") ? imageB64.split(",")[1] : imageB64;
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
              description: "A short 4-8 word title describing this scan context (e.g., 'Data Entry Job with Telegram Redirect')",
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
              description: "Primary scam pattern name identified (e.g., 'Check Cashing Scam', 'Off-Platform Migration', 'Unpaid Spec Work Demand', 'Legitimate Opportunity')",
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
                  category: { type: Type.STRING, description: "e.g., 'Payment & Banking', 'Communication', 'Unrealistic Pay', 'Off-Platform Risk', 'Identity Theft', 'Free Work Demand'" },
                },
                required: ["title", "description", "severity", "category"],
              },
            },
            greenFlags: {
              type: Type.ARRAY,
              description: "List of positive, legitimate signs found in the input (if any).",
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
              description: "Specific unfair or risky contract/payment clauses if applicable.",
              items: { type: Type.STRING },
            },
            recommendedActions: {
              type: Type.ARRAY,
              description: "Step-by-step actionable safety advice for the freelancer.",
              items: { type: Type.STRING },
            },
            suggestedReply: {
              type: Type.STRING,
              description: "A professional, protective response message the freelancer can copy and send to the client.",
            },
            safeQuestionsToAsk: {
              type: Type.ARRAY,
              description: "3-4 probing questions the freelancer can ask the client to test their legitimacy.",
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
      return res.status(500).json({ error: "No response text received from Gemini." });
    }

    const parsedResult = JSON.parse(responseText);

    const fullResult = {
      id: "scan_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      analysisType: analysisType || "job_post",
      ...parsedResult,
    };

    return res.json(fullResult);
  } catch (err: any) {
    console.error("Error in /api/analyze:", err);
    return res.status(500).json({
      error: err.message || "An unexpected error occurred during analysis.",
    });
  }
});

// Start Express + Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Freelance Scam Checker server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
