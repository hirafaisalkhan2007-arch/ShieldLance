import { AnalysisType } from "../types";

export interface PresetSample {
  id: string;
  label: string;
  category: string;
  analysisType: AnalysisType;
  content: string;
  additionalInfo: {
    clientPlatform: string;
    offeredPay: string;
    paymentMethod: string;
    communicationChannel: string;
  };
}

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: "preset-check-scam",
    label: "Fake Equipment Check Scam",
    category: "Job Posting & Chat",
    analysisType: "job_post",
    content: `Job Title: Remote Executive Data Assistant & PDF Specialist
Pay Rate: $55.00 per hour (W2 with full medical benefits)
Location: Remote (US / Canada)

Job Description:
We are hiring an immediate Data Entry & Administrative Assistant to organize customer records and convert scanned PDF reports into Excel spreadsheets. Flexible hours (15-30 hours/week).

Requirements:
- Must have basic computer knowledge
- Must be available immediately
- Must complete onboarding via Telegram

To Apply:
Kindly send your resume or message our Hiring Director Mr. Robert Miller directly on Telegram at @Robert_HR_Miller to schedule your interview today!`,
    additionalInfo: {
      clientPlatform: "LinkedIn / Indeed",
      offeredPay: "$55/hr",
      paymentMethod: "Check deposit for home office equipment",
      communicationChannel: "Telegram (@Robert_HR_Miller)"
    }
  },
  {
    id: "preset-telegram-interview",
    label: "Telegram HR Interview Trap",
    category: "Client Message",
    analysisType: "client_message",
    content: `Client Message:
"Greetings! We reviewed your profile on Upwork and we are impressed by your credentials. We have an immediate position for Content Writer at $45/hour.

Please note that our pre-employment interview will take place via text chat on Telegram for security and record-keeping purposes. Kindly download Telegram and contact our Senior Recruiter @Recruiter_Manager_Jane right now to answer 5 questionnaire questions.

After the text interview, if passed, you will receive an official employment letter and $2,500 check to purchase your company laptop from our IT vendor."`,
    additionalInfo: {
      clientPlatform: "Upwork Direct Message",
      offeredPay: "$45/hr",
      paymentMethod: "Unspecified Check",
      communicationChannel: "Telegram App"
    }
  },
  {
    id: "preset-unpaid-spec",
    label: "Massive Free 'Test Task' Demand",
    category: "Job Posting & Message",
    analysisType: "job_post",
    content: `Client Request:
"Hi! We loved your portfolio. We are hiring a lead UI/UX designer for a $12,000 redesign project.

Before we select a candidate, we require all top 5 applicants to submit a complete 6-page Figma wireframe and high-fidelity prototype for our live website dashboard (including User Settings, Billing Portal, and Analytics page).

Please submit your complete Figma file link by tomorrow 5 PM EST. We will select the winner and pay $12,000 for the full contract. Unselected candidates will not be compensated as this is part of our standard interview test."`,
    additionalInfo: {
      clientPlatform: "Fiverr / Upwork",
      offeredPay: "$12,000 (after unpaid test)",
      paymentMethod: "Platform Milestone",
      communicationChannel: "Platform Chat"
    }
  },
  {
    id: "preset-fake-escrow-url",
    label: "Suspicious Payment Link / URL",
    category: "URL / Domain Link",
    analysisType: "url_domain",
    content: `https://upwork-escrow-release-portal-verify.xyz/login?session=982341&client=global_tech_corp`,
    additionalInfo: {
      clientPlatform: "Direct Email / WhatsApp",
      offeredPay: "$1,800",
      paymentMethod: "External Escrow Portal Link",
      communicationChannel: "Email"
    }
  },
  {
    id: "preset-unreasonable-contract",
    label: "Predatory Contract Clause",
    category: "Contract Terms",
    analysisType: "contract_terms",
    content: `Clause 4.2 - Work Revisions & Compensation:
"The Freelancer agrees to provide unlimited revisions until the Client is 100% satisfied with no extra fee. In the event the Client cancels the project at any stage, the Freelancer agrees to refund 100% of all previously paid milestones.

Clause 7.1 - Intellectual Property & Non-Compete:
Freelancer assigns all intellectual property immediately upon creation. Freelancer agrees not to perform any freelance or contract work for any company in the same industry worldwide for a period of 3 years following termination."`,
    additionalInfo: {
      clientPlatform: "Direct Contract",
      offeredPay: "Fixed $500",
      paymentMethod: "Direct Bank Wire",
      communicationChannel: "Email"
    }
  }
];
