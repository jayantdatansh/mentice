import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckIn } from "@/generated/prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MoodSparkline } from "@/components/MoodSparkline";
import { ExamCountdown } from "@/components/ExamCountdown";
import { avgMood, topTrigger, calcStreak, moodMeta, hasCheckedInToday } from "@/lib/utils";
import { TRIGGERS } from "@/lib/constants";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;

  const [user, checkIns] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.checkIn.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (!user) redirect("/login");

  const last7 = checkIns.slice(-7);
  const streak = calcStreak(checkIns);
  const avg = avgMood(last7);
  const trigger = topTrigger(last7);
  const triggerLabel =
    TRIGGERS.find((t) => t.key === trigger)?.label ?? trigger ?? "None";
  const checkedToday = hasCheckedInToday(checkIns);

  const sparkData = last7.map((c: CheckIn) => ({
    date: c.createdAt.toISOString().slice(0, 10),
    mood: c.mood,
  }));

  const latestMood = checkIns.at(-1);
  const moodInfo = latestMood ? moodMeta(latestMood.mood) : null;

  return (
    <div className="space-y-6">
      {/* Welcome / banner */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hey, {user.name.split(" ")[0]} {moodInfo ? moodInfo.emoji : "👋"}
          </h1>
          <p className="text-sm text-slate-400">
            {checkedToday
              ? "You've checked in today. Keep it up!"
              : "How are you feeling today?"}
          </p>
        </div>
        {!checkedToday && (
          <Link
            href="/checkin"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-500"
          >
            + Daily Check-in
          </Link>
        )}
      </div>

      {/* Toast messages */}
      {params.success === "checked_in" && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-700 bg-emerald-900/30 px-5 py-4 space-y-1"
        >
          <p className="text-sm font-semibold text-emerald-300">✅ Check-in saved!</p>
          {params.insight && (
            <p className="text-sm text-slate-200 leading-relaxed">
              {decodeURIComponent(params.insight)}
            </p>
          )}
        </div>
      )}
      {params.error === "already_checked_in" && (
        <div
          role="alert"
          className="rounded-xl bg-amber-900/40 border border-amber-700 px-4 py-3 text-sm text-amber-300"
        >
          You&apos;ve already checked in today. Come back tomorrow!
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Check-in Streak",
            value: `${streak} ${streak === 1 ? "day" : "days"}`,
            icon: "🔥",
          },
          {
            label: "7-day Avg Mood",
            value: avg > 0 ? `${avg.toFixed(1)} / 5` : "–",
            icon: "📊",
          },
          {
            label: "Top Trigger",
            value: trigger ? triggerLabel : "None",
            icon: "⚡",
          },
          {
            label: "Total Check-ins",
            value: checkIns.length.toString(),
            icon: "📝",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
          >
            <p className="text-lg" aria-hidden="true">
              {stat.icon}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-white">
              {stat.value}
            </p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mood sparkline */}
      <section
        aria-labelledby="trend-heading"
        className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
      >
        <h2 id="trend-heading" className="mb-4 text-base font-semibold text-slate-200">
          📈 Mood Trend (last 7 days)
        </h2>
        <MoodSparkline data={sparkData} />
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Exam countdown */}
        <ExamCountdown exam={user.exam} examDate={user.examDate} />

        {/* Recent check-ins */}
        <section
          aria-labelledby="history-heading"
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <h2 id="history-heading" className="mb-4 text-base font-semibold text-slate-200">
            🗓️ Recent Check-ins
          </h2>
          {checkIns.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No check-ins yet.</p>
          ) : (
            <ul className="space-y-3" role="list">
              {[...checkIns].reverse().slice(0, 5).map((c) => {
                const m = moodMeta(c.mood);
                return (
                  <li key={c.id} className="flex items-start gap-3 text-sm">
                    <span className="text-xl leading-none" aria-hidden="true">
                      {m.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-slate-200">
                          {m.label}
                        </span>
                        <time
                          dateTime={c.createdAt.toISOString()}
                          className="shrink-0 text-xs text-slate-500"
                        >
                          {new Date(c.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </time>
                      </div>
                      {c.note && (
                        <p className="mt-0.5 truncate text-slate-400">{c.note}</p>
                      )}
                      {c.triggers.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1" aria-label="Triggers">
                          {c.triggers.map((t: string) => (
                            <span
                              key={t}
                              className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400"
                            >
                              {TRIGGERS.find((tr) => tr.key === t)?.label ?? t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/breathe"
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-indigo-500 hover:text-white"
        >
          🫁 Breathing Exercise
        </Link>
        <Link
          href="/checkin"
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-indigo-500 hover:text-white"
        >
          ✍️ New Check-in
        </Link>
        <Link
          href="/chat"
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-indigo-500 hover:text-white"
        >
          🤖 Talk to AI Coach
        </Link>
      </div>
    </div>
  );
}
