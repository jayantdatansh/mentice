"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { clamp } from "@/lib/utils";
import { generateCheckInInsight } from "./ai";

export async function createCheckIn(_prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const mood = clamp(Number(formData.get("mood")), 1, 5);
  const note = String(formData.get("note") ?? "").trim().slice(0, 500);
  const triggers = formData.getAll("triggers").map(String);

  // Validate triggers against allowed list
  const ALLOWED_TRIGGERS = [
    "syllabus", "mock_score", "sleep", "parents",
    "comparison", "results", "time", "concepts",
  ];
  const safeTriggers = triggers.filter((t) => ALLOWED_TRIGGERS.includes(t));

  // Prevent duplicate check-in on same day
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const existing = await prisma.checkIn.findFirst({
    where: { userId, createdAt: { gte: todayStart } },
  });
  if (existing) redirect("/dashboard?error=already_checked_in");

  const checkIn = await prisma.checkIn.create({
    data: { userId, mood, note: note || null, triggers: safeTriggers },
  });

  // Fire AI insight — non-blocking, errors gracefully
  const insight = await generateCheckInInsight(checkIn.id).catch(() => "");

  const params = new URLSearchParams({ success: "checked_in" });
  if (insight) params.set("insight", encodeURIComponent(insight));
  redirect(`/dashboard?${params.toString()}`);
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const exam = String(formData.get("exam") ?? "").trim();
  const examDateStr = String(formData.get("examDate") ?? "").trim();
  const examDate = examDateStr ? new Date(examDateStr) : null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { exam: exam || null, examDate },
  });

  redirect("/dashboard?success=profile_updated");
}
