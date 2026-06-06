"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getModel, getChatModel } from "@/lib/gemini";
import { MOODS, TRIGGERS } from "@/lib/constants";
import { topTrigger, avgMood } from "@/lib/utils";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

/** Generate a personalized insight after a check-in */
export async function generateCheckInInsight(checkInId: string): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) return "";

  const model = getModel();
  if (!model) return "Keep going — every day you check in is a step toward self-awareness. 💙";

  const [checkIn, recentCheckIns, user] = await Promise.all([
    prisma.checkIn.findUnique({ where: { id: checkInId } }),
    prisma.checkIn.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 7,
    }),
    prisma.user.findUnique({ where: { id: session.user.id } }),
  ]);

  if (!checkIn) return "";

  const moodLabel = MOODS.find((m) => m.value === checkIn.mood)?.label ?? "Unknown";
  const triggerLabels = checkIn.triggers
    .map((t) => TRIGGERS.find((tr) => tr.key === t)?.label ?? t)
    .join(", ") || "none";

  const avgLast7 = avgMood(recentCheckIns);
  const topT = topTrigger(recentCheckIns);
  const topTLabel = TRIGGERS.find((t: { key: string; label: string }) => t.key === topT)?.label ?? topT ?? "nothing specific";
  const examContext = user?.exam ? `preparing for ${user.exam}` : "studying";

  const prompt = `A student ${examContext} just completed their daily wellness check-in.
Today's mood: ${moodLabel} (${checkIn.mood}/5)
Today's stress triggers: ${triggerLabels}
Their note: "${checkIn.note || "none"}"
Their 7-day average mood: ${avgLast7 > 0 ? avgLast7.toFixed(1) : "not enough data"}
Their most common trigger this week: ${topTLabel}

Give them a short, warm, personalised message (3-4 sentences). Acknowledge how they feel today, notice any patterns if relevant, and offer one gentle, practical suggestion. End with encouragement.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error("[Gemini] generateCheckInInsight error:", err);
    return "You showed up for yourself today — that's what matters most. Keep going. 💙";
  }
}

/** Chat with the AI wellness coach */
export async function sendChatMessage(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) return "Please sign in to chat.";

  // Sanitise input
  const safeMessage = userMessage.trim().slice(0, 1000);
  if (!safeMessage) return "";

  const model = getChatModel();
  if (!model) return "AI is not configured. Please add your GEMINI_API_KEY.";

  // Build chat history for Gemini (max last 10 turns)
  const geminiHistory = history.slice(-10).map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  try {
    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(safeMessage);
    return result.response.text().trim();
  } catch (err) {
    console.error("[Gemini] sendChatMessage error:", err);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}
