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
    prisma.checkIn.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "asc" } }),
  ]);
  if (!user) redirect("/login");

  const last7        = checkIns.slice(-7);
  const streak       = calcStreak(checkIns);
  const avg          = avgMood(last7);
  const trigger      = topTrigger(last7);
  const triggerLabel = TRIGGERS.find((t) => t.key === trigger)?.label ?? trigger ?? "None";
  const checkedToday = hasCheckedInToday(checkIns);
  const moodInfo     = checkIns.at(-1) ? moodMeta(checkIns.at(-1)!.mood) : null;
  const sparkData    = last7.map((c: CheckIn) => ({ date: c.createdAt.toISOString().slice(0, 10), mood: c.mood }));

  return (
    <div className="space-y-5">

      {/* ── Welcome bar ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Good {getTimeOfDay()}, {user.name.split(" ")[0]} {moodInfo?.emoji ?? "👋"}
          </h1>
          <p className="text-sm text-slate-500">
            {checkedToday ? "You've checked in today — keep the streak going!" : "Start with a quick mood check-in."}
          </p>
        </div>
        {!checkedToday && (
          <Link href="/checkin" className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
            + Daily Check-in
          </Link>
        )}
      </div>

      {/* ── Toasts ── */}
      {params.success === "checked_in" && (
        <div role="status" aria-live="polite" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 space-y-0.5">
          <p className="text-sm font-semibold text-emerald-700">✅ Check-in saved!</p>
          {params.insight && (
            <p className="text-sm text-slate-700 leading-relaxed">{decodeURIComponent(params.insight)}</p>
          )}
        </div>
      )}
      {params.error === "already_checked_in" && (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          You&apos;ve already checked in today. Come back tomorrow!
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Streak",        value: `${streak}d`,                           icon: "🔥", bg: "bg-orange-50",  text: "text-orange-600" },
          { label: "7-day Avg",     value: avg > 0 ? `${avg.toFixed(1)}/5` : "–",  icon: "📊", bg: "bg-blue-50",    text: "text-blue-600"   },
          { label: "Top Trigger",   value: trigger ? triggerLabel : "None",         icon: "⚡", bg: "bg-violet-50",  text: "text-violet-600" },
          { label: "Total Logs",    value: String(checkIns.length),                 icon: "📝", bg: "bg-slate-100",  text: "text-slate-600"  },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border border-slate-200 ${s.bg} p-4`}>
            <p className="text-lg" aria-hidden="true">{s.icon}</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${s.text}`}>{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { href: "/checkin", icon: "✍️",  label: "Check-in",  desc: "Log your mood",      bg: "bg-indigo-50  border-indigo-100",  accent: "text-indigo-700" },
          { href: "/chat",    icon: "🤖",  label: "AI Coach",   desc: "Talk to Menti",      bg: "bg-violet-50  border-violet-100",  accent: "text-violet-700" },
          { href: "/breathe", icon: "🫁",  label: "Breathe",    desc: "Calm exercises",     bg: "bg-teal-50    border-teal-100",    accent: "text-teal-700"   },
          { href: "#history", icon: "📅",  label: "History",    desc: "Past check-ins",     bg: "bg-amber-50   border-amber-100",   accent: "text-amber-700"  },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`flex flex-col gap-1.5 rounded-2xl border ${a.bg} p-4 transition hover:shadow-md`}
          >
            <span className="text-2xl leading-none" aria-hidden="true">{a.icon}</span>
            <span className={`text-sm font-bold ${a.accent}`}>{a.label}</span>
            <span className="text-xs text-slate-500">{a.desc}</span>
          </Link>
        ))}
      </div>

      {/* ── Bottom grid ── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Sparkline — 2 cols */}
        <section aria-labelledby="trend-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 id="trend-heading" className="mb-3 text-sm font-semibold text-slate-700">📈 Mood Trend — last 7 days</h2>
          <MoodSparkline data={sparkData} />
        </section>

        {/* Exam countdown — 1 col */}
        <ExamCountdown exam={user.exam} examDate={user.examDate} />
      </div>

      {/* ── Recent check-ins ── */}
      <section id="history" aria-labelledby="history-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 id="history-heading" className="mb-4 text-sm font-semibold text-slate-700">🗓️ Recent Check-ins</h2>
        {checkIns.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="text-4xl">😊</span>
            <p className="text-sm text-slate-500">No check-ins yet.</p>
            <Link href="/checkin" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Take your first one →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100" role="list">
            {[...checkIns].reverse().slice(0, 5).map((c: CheckIn) => {
              const m = moodMeta(c.mood);
              return (
                <li key={c.id} className="flex items-start gap-3 py-3 text-sm">
                  <span className="text-xl leading-none mt-0.5" aria-hidden="true">{m.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-800">{m.label}</span>
                      <time dateTime={c.createdAt.toISOString()} className="shrink-0 text-xs text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </time>
                    </div>
                    {c.note && <p className="mt-0.5 truncate text-slate-500">{c.note}</p>}
                    {c.triggers.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {c.triggers.map((t: string) => (
                          <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
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
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
