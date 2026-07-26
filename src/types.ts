export type AnalysisType = 'job_post' | 'client_message' | 'contract_terms' | 'url_domain';

export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface RedFlag {
  title: string;
  description: string;
  severity: RiskSeverity;
  category: string;
}

export interface GreenFlag {
  title: string;
  description: string;
}

export interface ScamAnalysisResult {
  id: string;
  timestamp: number;
  analysisType: AnalysisType;
  titleSnippet: string;
  riskScore: number; // 0 to 100
  riskLevel: 'Safe / Legitimate' | 'Low Risk' | 'Moderate Concern' | 'High Scam Risk' | 'Extreme Scam Warning';
  scamType: string; // e.g. "Fake Check / Equipment Purchase Scam"
  summary: string;
  redFlags: RedFlag[];
  greenFlags: GreenFlag[];
  contractConcerns?: string[];
  recommendedActions: string[];
  suggestedReply: string;
  safeQuestionsToAsk: string[];
}

export interface ScamPattern {
  id: string;
  title: string;
  category: 'Payment Scams' | 'Communication Traps' | 'Work Exploitation' | 'Identity Theft' | 'Malware & Phishing';
  tagline: string;
  riskScoreAvg: number;
  description: string;
  howItWorks: string[];
  redFlagTriggers: string[];
  howToProtect: string[];
  exampleMessage: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  context: string;
  options: {
    label: string;
    score: number; // 0 = safe, 10 = medium, 20 = high risk
    feedback: string;
  }[];
}
