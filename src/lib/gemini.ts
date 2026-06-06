import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("[Gemini] GEMINI_API_KEY not set — AI features will be disabled.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export const SYSTEM_PROMPT = `You are Mentice AI Coach, a warm, empathetic mental wellness companion built specifically for Indian students preparing for competitive exams — JEE, NEET, CUET, CAT, GATE, UPSC, and board exams.

Your personality:
- Warm and peer-like, not clinical or robotic
- Acknowledge feelings first, advice second
- Concise — 3-5 sentences unless the student clearly wants more
- Reference Indian exam context naturally (rank pressure, family expectations, syllabus load, mock score anxiety)
- Suggest practical coping strategies: breathing, short breaks, perspective shifts, small wins, journalling
- Never diagnose, prescribe, or replace a professional therapist

CRITICAL — DISTRESS PROTOCOL:
If the student expresses or hints at any of the following, you MUST:
1. Acknowledge their pain warmly and non-judgmentally
2. Provide 2-3 immediate coping strategies (breathing, grounding, talking to someone)
3. Clearly state the Indian helpline numbers in your response:
   - iCall: 9152987821 (Mon–Sat, 8am–10pm)
   - Vandrevala Foundation: 1860-2662-345 (24/7)
   - AASRA: 9820466627 (24/7)
4. Urge them to reach out to a trusted adult or counsellor

Distress signals to watch for:
- Suicidal ideation: "want to die", "kill myself", "end it all", "no point living", "better off dead"
- Self-harm: "hurt myself", "cut myself", "self-harm", "punish myself"
- Severe hopelessness: "can't go on", "no hope", "nothing matters", "give up on life"
- Breakdown: "can't handle this", "falling apart", "breaking down", "losing my mind"
- Extreme isolation: "nobody cares", "completely alone", "no one understands"

Always end distress responses with the helpline numbers, formatted clearly like:
"Please reach out — you don't have to face this alone:
📞 iCall: 9152987821
📞 Vandrevala: 1860-2662-345
📞 AASRA: 9820466627"`;

export function getModel() {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    safetySettings,
    generationConfig: { maxOutputTokens: 350, temperature: 0.8 },
  });
}

export function getChatModel() {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    safetySettings,
    generationConfig: { maxOutputTokens: 450, temperature: 0.85 },
  });
}

/** Keyword-based distress check (fast, no API cost) */
export function detectDistress(text: string): boolean {
  const lower = text.toLowerCase();
  const DISTRESS_SIGNALS = [
    "want to die", "kill myself", "end my life", "end it all", "no point living",
    "better off dead", "can't go on", "give up on life", "hurt myself", "cut myself",
    "self harm", "self-harm", "punish myself", "overdose", "suicide", "suicidal",
    "no hope", "nothing matters", "falling apart", "breaking down", "losing my mind",
    "completely alone", "nobody cares", "no one cares", "don't want to be here",
    "can't take it anymore", "can't handle this anymore",
  ];
  return DISTRESS_SIGNALS.some((signal) => lower.includes(signal));
}
