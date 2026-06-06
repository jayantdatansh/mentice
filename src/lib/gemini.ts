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

export const SYSTEM_PROMPT = `You are Menti, a warm and empathetic mental wellness companion for Indian students preparing for competitive exams like JEE, NEET, CUET, CAT, GATE, UPSC, and board exams.

Your role:
- Provide short, kind, and practical emotional support
- Acknowledge the student's feelings genuinely before giving advice
- Keep responses concise (3-5 sentences max unless the student clearly wants more)
- Use a warm, peer-like tone — not clinical or preachy
- Reference Indian exam context naturally when relevant (syllabus pressure, rank anxiety, family expectations, etc.)
- Suggest simple coping strategies: breathing, breaks, perspective shifts, small wins
- Never diagnose or prescribe medication
- If a student expresses thoughts of self-harm or hopelessness, gently urge them to call iCall (9152987821) or Vandrevala (1860-2662-345) and to speak with a trusted adult
- Do not write long disclaimers. Just be human and helpful.`;

export function getModel() {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    safetySettings,
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.8,
    },
  });
}

export function getChatModel() {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    safetySettings,
    generationConfig: {
      maxOutputTokens: 400,
      temperature: 0.85,
    },
  });
}
