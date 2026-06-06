import { CheckIn } from "@/generated/prisma/client";
import { MOODS } from "./constants";

/** Returns the average mood for an array of check-ins */
export function avgMood(checkIns: Pick<CheckIn, "mood">[]): number {
  if (!checkIns.length) return 0;
  return checkIns.reduce((s, c) => s + c.mood, 0) / checkIns.length;
}

/** Returns the most frequent trigger from an array of check-ins */
export function topTrigger(checkIns: Pick<CheckIn, "triggers">[]): string | null {
  const freq: Record<string, number> = {};
  for (const c of checkIns) {
    for (const t of c.triggers) {
      freq[t] = (freq[t] ?? 0) + 1;
    }
  }
  const entries = Object.entries(freq);
  if (!entries.length) return null;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

/** Returns the current daily check-in streak */
export function calcStreak(checkIns: Pick<CheckIn, "createdAt">[]): number {
  if (!checkIns.length) return 0;
  const sorted = [...checkIns].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let expected = today.getTime();

  for (const c of sorted) {
    const d = new Date(c.createdAt);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === expected) {
      streak++;
      expected -= 86_400_000;
    } else if (d.getTime() < expected) {
      break;
    }
  }
  return streak;
}

/** Days until an exam date */
export function daysUntil(examDate: Date | string | null): number | null {
  if (!examDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(examDate);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
  return diff;
}

/** Mood emoji + label from a numeric value */
export function moodMeta(value: number) {
  return MOODS.find((m) => m.value === value) ?? MOODS[2];
}

/** Whether a check-in already exists for today */
export function hasCheckedInToday(checkIns: Pick<CheckIn, "createdAt">[]): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return checkIns.some((c) => {
    const d = new Date(c.createdAt);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
}

/** Clamp a number between min and max */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}
