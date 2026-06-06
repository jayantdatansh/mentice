"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function saveOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const exam        = String(formData.get("exam") ?? "").trim();
  const examDateStr = String(formData.get("examDate") ?? "").trim();
  const examDate    = examDateStr ? new Date(examDateStr) : null;

  await prisma.user.update({
    where: { id: session.user.id },
    data:  { exam: exam || null, examDate },
  });

  redirect("/dashboard");
}
