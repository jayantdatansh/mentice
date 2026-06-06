"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getModel, getChatModel, detectDistress } from "@/lib/gemini";
import { MOODS, TRIGGERS } from "@/lib/constants";
import { topTrigger, avgMood } from "@/lib/utils";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface ChatResponse {
  text: string;
  distress: boolean;
}

/** Generate a personalised insight after a check-in */
export async function generateCheckInInsight(checkInId: string): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) return "";

  const model = getModel();
  if (!model) return "Keep going — every day you check in is a step toward self-awareness. 💙";

  const [checkIn, recentCheckIns, user] = await Promise.all([
    prisma.checkIn.findUnique({ where: { id: checkInId } }),
    prisma.checkIn.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 7 }),
    prisma.user.findUnique({ where: { id: session.user.id } }),
  ]);
  if (!checkIn) return "";

  const moodLabel    = MOODS.find((m) => m.value === checkIn.mood)?.label ?? "Unknown";
  const triggerLabels = checkIn.triggers.map((t) => TRIGGERS.find((tr: { key: string; label: string }) => tr.key === t)?.label ?? t).join(", ") || "none";
  const avgLast7     = avgMood(recentCheckIns);
  const topT         = topTrigger(recentCheckIns);
  const topTLabel    = TRIGGERS.find((t: { key: string; label: string }) => t.key === topT)?.label ?? topT ?? "nothing specific";
  const examContext  = user?.exam ? `preparing for ${user.exam}` : "studying";

  const prompt = `A student ${examContext} just completed their daily wellness check-in.
Today's mood: ${moodLabel} (${checkIn.mood}/5)
Today's stress triggers: ${triggerLabels}
Their note: "${checkIn.note || "none"}"
7-day average mood: ${avgLast7 > 0 ? avgLast7.toFixed(1) : "not enough data"}
Most common trigger this week: ${topTLabel}

Give them a short, warm, personalised message (3-4 sentences). Acknowledge how they feel today, notice any patterns if relevant, offer one gentle practical suggestion. End with encouragement.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error("[Gemini] generateCheckInInsight error:", err);
    return "You showed up for yourself today — that's what matters most. 💙";
  }
}

/** Build a student context string from the past 7 days of check-ins */
async function buildStudentContext(userId: string): Promise<string> {
  const [user, recentCheckIns] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.checkIn.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 7,
    }),
  ]);

  if (!recentCheckIns.length) return "";

  const avg      = avgMood(recentCheckIns);
  const topT     = topTrigger(recentCheckIns);
  const topTLabel = TRIGGERS.find((t: { key: string; label: string }) => t.key === topT)?.label ?? topT;
  const examCtx  = user?.exam ? `preparing for ${user.exam}` : "studying for exams";
  const streak   = recentCheckIns.length;

  const moodTrend = recentCheckIns
    .slice(0, 5)
    .reverse()
    .map((c) => {
      const label = MOODS.find((m) => m.value === c.mood)?.label ?? c.mood;
      const date  = new Date(c.createdAt).toLocaleDateString("en-IN", { weekday: "short" });
      const note  = c.note ? ` ("${c.note.slice(0, 60)}")` : "";
      const trigs = c.triggers.length
        ? ` [stressed about: ${c.triggers.map((t) => TRIGGERS.find((tr: { key: string; label: string }) => tr.key === t)?.label ?? t).join(", ")}]`
        : "";
      return `  ${date}: ${label}${trigs}${note}`;
    })
    .join("\n");

  return `[STUDENT CONTEXT — use this to personalise your response, do NOT repeat it back verbatim]
The student is ${examCtx}.
Past ${streak} check-ins (most recent first trend):
${moodTrend}
7-day average mood: ${avg.toFixed(1)}/5
Top stress trigger this week: ${topTLabel ?? "none identified"}
${user?.examDate ? `Exam date: ${new Date(user.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : ""}
[END CONTEXT]`;
}

/** Chat with Mentice AI Coach — returns reply + distress flag */
export async function sendChatMessage(
  history: ChatMessage[],
  userMessage: string,
): Promise<ChatResponse> {
  const session = await auth();
  if (!session?.user?.id) return { text: "Please sign in to chat.", distress: false };

  const safeMessage = userMessage.trim().slice(0, 1000);
  if (!safeMessage) return { text: "", distress: false };

  // Fast keyword distress check — fires before any API call
  const distress = detectDistress(safeMessage);

  const model = getChatModel();
  if (!model) return { text: "AI is not configured. Please add your GEMINI_API_KEY.", distress };

  // Inject student context on the first turn only (history is empty = fresh conversation)
  let geminiHistory = history.slice(-10).map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  if (history.length === 0) {
    // First message — prepend context as a silent model primer
    const ctx = await buildStudentContext(session.user.id);
    if (ctx) {
      geminiHistory = [
        { role: "user",  parts: [{ text: ctx }] },
        { role: "model", parts: [{ text: "Understood. I'll keep this context in mind while supporting this student." }] },
      ];
    }
  }

  try {
    const chat   = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(safeMessage);
    const text   = result.response.text().trim();
    return { text, distress };
  } catch (err) {
    console.error("[Gemini] sendChatMessage error:", err);
    return { text: "I'm having trouble connecting right now. Please try again in a moment.", distress };
  }
}
