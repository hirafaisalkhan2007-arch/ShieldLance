import { ScamPattern, QuizQuestion } from "../types";

export const COMMON_SCAM_PATTERNS: ScamPattern[] = [
  {
    id: "check-equipment",
    title: "The Fake Check & Equipment Purchase Scam",
    category: "Payment Scams",
    tagline: "Client sends a fake check for 'home office equipment' and directs you to their preferred vendor.",
    riskScoreAvg: 98,
    description: "The scammer hires you quickly (often without a video interview) and promises to send a check to purchase equipment (laptop, monitor, software) from a specific 'authorized vendor'. The check is fraudulent, but takes several days for your bank to bounce. Meanwhile, you send your real money to the vendor (who is the scammer).",
    howItWorks: [
      "Immediate hire for high hourly pay ($45-$80/hr) with little or no screening.",
      "Client insists on sending a check or direct deposit for $2,000-$5,000 to buy gear.",
      "Instructs you to wire or Zelle/Venmo the money to a specific 'certified IT supplier'.",
      "Days later, the check bounces at your bank and you are out thousands of dollars."
    ],
    redFlagTriggers: [
      "Receiving a check before doing any work",
      "Demands to buy equipment from a specific unverified vendor",
      "Pay rate far above market average for basic tasks",
      "Communicating solely via Telegram, WhatsApp, or Signal"
    ],
    howToProtect: [
      "Never accept check payments for purchasing gear on behalf of a new client.",
      "Legitimate remote employers ship equipment directly to your address or provide corporate purchase orders.",
      "Wait at least 10-14 business days for any physical check to clear completely before making financial moves."
    ],
    exampleMessage: "Congratulations! You have been selected for the Data Entry Specialist role. We are sending a cashier check of $3,450 to your address. Please deposit it into your mobile banking app immediately and purchase your equipment from our designated vendor list."
  },
  {
    id: "off-platform-telegram",
    title: "Off-Platform Telegram / WhatsApp Migration Trap",
    category: "Communication Traps",
    tagline: "Clients immediately ask to leave Upwork/Fiverr/LinkedIn for encrypted chat apps before contract.",
    riskScoreAvg: 92,
    description: "Scammers posted jobs on legitimate platforms like Upwork or LinkedIn, then force you to move to Telegram, WhatsApp, or Google Chat for the 'HR Interview'. Once off-platform, platform payment protections and moderation do not apply.",
    howItWorks: [
      "Job post contains a message: 'Kindly contact Mrs. Sarah on Telegram @hr_hiring_dept'.",
      "Interview takes place entirely via text messaging on Telegram with scripted generic questions.",
      "Job offer given immediately at the end of the text chat.",
      "Client requests upfront payment, ID documents, or check deposit."
    ],
    redFlagTriggers: [
      "Keywords like 'Kindly text HR on Telegram'",
      "Refusal to conduct a voice/video interview or platform message",
      "Urgency to communicate outside platform before contract is active"
    ],
    howToProtect: [
      "Insist on keeping all pre-contract communications on the official freelance platform.",
      "Never accept text-only interviews via Telegram or WhatsApp for corporate roles.",
      "Report platform posts that explicitly list external handle names in the description."
    ],
    exampleMessage: "Hello candidate! To schedule your text-based interview with our Hiring Manager, kindly add @Recruiter_Manager_2026 on Telegram app right away."
  },
  {
    id: "unpaid-spec-work",
    title: "The Massive Free 'Test Work' / Spec Work Exploitation",
    category: "Work Exploitation",
    tagline: "Client requests a full, finished project as a 'free trial' or 'qualification assessment'.",
    riskScoreAvg: 85,
    description: "The client posts a job for a website design, 5 articles, or video edit, and asks 20 applicants to complete a 'sample task' that happens to be actual client deliverables. They collect free work from everyone and vanish.",
    howItWorks: [
      "Client posts a job and invites many freelancers.",
      "Sends a message: 'To test your skills, please complete this 1,500-word article / design 3 logo concepts'.",
      "Promises high pay if you pass the test.",
      "Takes your work, provides no feedback, closes job without hiring anyone."
    ],
    redFlagTriggers: [
      "Test task takes more than 30 minutes to complete",
      "Task is a real production asset rather than a generic or watermarked exercise",
      "Refusal to pay a small fixed fee for custom sample work"
    ],
    howToProtect: [
      "Offer portfolio work or a short 15-minute paid test contract.",
      "Watermark sample graphics or provide low-res previews.",
      "Never submit complete, un-watermarked source files without a funded milestone."
    ],
    exampleMessage: "We like your profile! Before we sign the $5,000 monthly contract, please design the complete homepage mockups for client X so our team can evaluate your style."
  },
  {
    id: "security-deposit-fee",
    title: "The Security Deposit / Registration Fee Scam",
    category: "Payment Scams",
    tagline: "You are asked to pay a 'refundable fee', 'ID verification fee', or 'convert currency fee' to get paid.",
    riskScoreAvg: 99,
    description: "After completing a task (often simple typing or translation), the client claims your payment of $1,500 is ready, but you must pay $50-$200 first for 'account activation', 'international transfer clearance', or 'insurance'.",
    howItWorks: [
      "Freelancer completes simple task (e.g. retyping 30 images to Word).",
      "Client sends a fake bank receipt or portal screenshot showing $2,000 balance.",
      "Client says: 'Our bank requires a $100 security fee from you to unlock your $2,000 transfer'.",
      "Once you pay, client asks for more fees or blocks you."
    ],
    redFlagTriggers: [
      "Paying money to receive money",
      "Phrases like 'Account activation fee', 'Security deposit', 'Crypto gas fee reimbursement'",
      "Fake bank dashboard screenshots"
    ],
    howToProtect: [
      "GOLDEN RULE: You should NEVER pay money to get paid for your work.",
      "Legitimate platforms deduct transaction fees directly from the client or from your earnings.",
      "If a client asks for any deposit, walk away immediately."
    ],
    exampleMessage: "Your payment of $1,200 is approved! However, as a new freelancer on our network, you must wire a refundable $75 account activation fee to our finance gateway."
  },
  {
    id: "phishing-malware-link",
    title: "The Malicious Attachment / Phishing Contract Link",
    category: "Malware & Phishing",
    tagline: "Client sends a ZIP file, SCR file, or suspicious link containing malware disguised as project specs.",
    riskScoreAvg: 96,
    description: "Scammers send a link to 'Google Drive' or 'Dropbox' that actually points to a credential harvester or executable file (.exe, .scr, .iso) claiming it's project assets or design brief.",
    howItWorks: [
      "Client reaches out with an urgent project inquiry.",
      "Attaches a file named 'Project_Details_Spec.zip' or provides a link to 'brief-download-login.com'.",
      "Opening the file runs password stealer malware that hacks your crypto wallet, browser cookies, and bank accounts."
    ],
    redFlagTriggers: [
      "Executable files (.exe, .scr, .vbs, .bat, .iso) disguised as documents",
      "Links asking you to login with Google/Upwork to view a document",
      "Urgency and insistence on downloading external files immediately"
    ],
    howToProtect: [
      "Never open .exe, .scr, or password-protected ZIP files from prospective clients.",
      "Verify URL domains carefully (e.g., google.com vs g00gle-drive-docs.net).",
      "Scan all downloaded files on VirusTotal before opening."
    ],
    exampleMessage: "Hi! Please download our brand guidelines and project assets here: www.freelance-brand-specs-download.xyz/brief.zip and run the installer to view the confidential brief."
  },
  {
    id: "overpayment-refund",
    title: "The Overpayment & Crypto Refund Scam",
    category: "Payment Scams",
    tagline: "Client 'accidentally' overpays you and asks you to refund the difference via Crypto or wire.",
    riskScoreAvg: 97,
    description: "The client hires you for $500, but sends $2,500 using a stolen credit card, fake wire, or compromised account. They contact you in panic, asking you to refund the $2,000 excess immediately via Bitcoin, Zelle, or gift cards.",
    howItWorks: [
      "Client sends $2,500 instead of $500.",
      "Claims it was an administrative mistake by their payroll department.",
      "Asks you to send back $2,000 via untraceable method (Crypto, Wire, Gift cards).",
      "The original payment is later reversed due to fraud, leaving your balance -$2,000."
    ],
    redFlagTriggers: [
      "Overpayment on milestone or invoice",
      "Urgent request to refund money via untraceable payment channels",
      "Refusal to let the bank handle the transaction reversal"
    ],
    howToProtect: [
      "Do not touch or transfer overpaid funds.",
      "Instruct the client to issue a chargeback or dispute through their financial institution.",
      "Report the transaction to platform support immediately."
    ],
    exampleMessage: "OH NO! My accountant sent $3,000 instead of $300 by mistake! Please keep $400 for your trouble and transfer the remaining $2,600 back to my Bitcoin wallet right now!"
  }
];

export const SAFETY_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "A client on LinkedIn hires you immediately for $60/hour data entry and asks you to message their HR manager on Telegram for onboarding. What should you do?",
    context: "Client has a generic company logo and insists on Telegram communication.",
    options: [
      {
        label: "Message the HR manager on Telegram — it might be a big company using Telegram for team chat.",
        score: 20,
        feedback: "HIGH RISK! Off-platform Telegram migrations for high-pay entry-level roles are almost 100% check cashing or identity theft scams."
      },
      {
        label: "Request a video call and ask to keep communications on LinkedIn / official corporate email.",
        score: 0,
        feedback: "CORRECT! Legitimate clients will happily meet on Zoom, Google Meet, or communicate via verified corporate email domain."
      },
      {
        label: "Ask them to pay you $50 upfront on Telegram before starting.",
        score: 15,
        feedback: "RISKY! Simply moving to Telegram off-platform removes all platform protections."
      }
    ]
  },
  {
    id: 2,
    question: "A client sends you a $3,000 cashier's check to buy a laptop and home studio setup from their 'preferred vendor'. What is the safest choice?",
    context: "The check deposited successfully in your mobile banking app, but pending clearance.",
    options: [
      {
        label: "Wait 1 day then wire money to the vendor, since the funds show in your bank balance.",
        score: 20,
        feedback: "DANGER! Showing in 'available balance' does NOT mean the check cleared. Fake checks can take 7-14 days to bounce back, leaving you liable for thousands."
      },
      {
        label: "Refuse the check and insist that the company ship equipment directly or buy it themselves.",
        score: 0,
        feedback: "CORRECT! Real companies buy gear directly and ship it to you. Freelancers never buy equipment for clients using client checks."
      },
      {
        label: "Ask the client to send the equipment money via PayPal Friends & Family instead.",
        score: 15,
        feedback: "INCORRECT! Friends & Family payments offer zero buyer/seller protection and cannot be disputed."
      }
    ]
  },
  {
    id: 3,
    question: "A prospective client asks you to complete a 'sample task' that involves writing a complete 2,000-word blog post or designing 3 logo options for free. How should you respond?",
    context: "You really want the client, but the sample work takes 6+ hours.",
    options: [
      {
        label: "Do the work quickly so you stand out among competitors.",
        score: 20,
        feedback: "EXPLOITATION WARNING! Unpaid test tasks requiring full production deliverables are frequently used to harvest free work without hiring."
      },
      {
        label: "Offer your existing portfolio, watermarked concepts, or propose a paid short test milestone.",
        score: 0,
        feedback: "EXCELLENT! Professional freelancers set boundaries by offering past portfolio work or paid test milestones."
      },
      {
        label: "Send half the article and ask for $10 to unlock the rest.",
        score: 10,
        feedback: "MODERATE RISK. Better to establish a formal paid contract first."
      }
    ]
  },
  {
    id: 4,
    question: "You complete a translation project and the client sends a screenshot showing $1,500 sent. However, they say you must pay a $50 'international security fee' to release funds. What should you do?",
    context: "Client claims their bank requires this fee from new contractors.",
    options: [
      {
        label: "Pay $50 since $1,500 is a much bigger reward.",
        score: 20,
        feedback: "CRITICAL SCAM! You should NEVER pay money to receive payment for completed work. Once you pay $50, they will invent another fee."
      },
      {
        label: "Tell the client to deduct any fees from the $1,500 or cancel the transaction.",
        score: 0,
        feedback: "CORRECT! Legitimate payment processors deduct fees automatically from the payout balance."
      }
    ]
  }
];
