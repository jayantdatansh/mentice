"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

type Phase = "idle" | "inhale" | "hold" | "exhale" | "rest";

const PHASES: { phase: Phase; duration: number; label: string; ringColor: string; instruction: string }[] = [
  { phase: "inhale", duration: 4, label: "Breathe In",  ringColor: "ring-blue-400",   instruction: "Slowly breathe in through your nose" },
  { phase: "hold",   duration: 7, label: "Hold",        ringColor: "ring-violet-400", instruction: "Hold your breath gently" },
  { phase: "exhale", duration: 8, label: "Breathe Out", ringColor: "ring-teal-400",   instruction: "Exhale fully through your mouth" },
  { phase: "rest",   duration: 1, label: "Rest",        ringColor: "ring-slate-300",  instruction: "Relax…" },
];

const GROUNDING = [
  { n: 5, sense: "things you can SEE",   icon: "👁️",  bg: "bg-blue-50   border-blue-200",   text: "text-blue-700"   },
  { n: 4, sense: "things you can TOUCH", icon: "✋",  bg: "bg-violet-50 border-violet-200", text: "text-violet-700" },
  { n: 3, sense: "things you can HEAR",  icon: "👂",  bg: "bg-teal-50   border-teal-200",   text: "text-teal-700"   },
  { n: 2, sense: "things you can SMELL", icon: "👃",  bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
  { n: 1, sense: "thing you can TASTE",  icon: "👅",  bg: "bg-amber-50  border-amber-200",  text: "text-amber-700"  },
];

export default function BreathePage() {
  const [active,    setActive]    = useState(false);
  const [phaseIdx,  setPhaseIdx]  = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);
  const [cycles,    setCycles]    = useState(0);
  const [tab,       setTab]       = useState<"breathing" | "grounding">("breathing");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPhase = PHASES[phaseIdx];

  const stop = useCallback(() => {
    setActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setPhaseIdx(0);
    setCountdown(PHASES[0].duration);
  }, []);

  useEffect(() => {
    if (!active) return;
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const next = (phaseIdx + 1) % PHASES.length;
          setPhaseIdx(next);
          if (next === 0) setCycles((c) => c + 1);
          setCountdown(PHASES[next].duration);
          return PHASES[next].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, phaseIdx]);

  const expanding = active && (currentPhase.phase === "inhale" || currentPhase.phase === "hold");

  return (
    <div className="mx-auto max-w-xl space-y-5">

      <div>
        <h1 className="text-xl font-bold text-slate-900">Calm Down Corner</h1>
        <p className="mt-1 text-sm text-slate-500">Quick techniques to reset during study sessions.</p>
      </div>

      {/* Tab switcher */}
      <div role="tablist" className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        {(["breathing", "grounding"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => { stop(); setTab(t); }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              tab === t ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t === "breathing" ? "🫁  4-7-8 Breathing" : "🖐️  5-4-3-2-1 Grounding"}
          </button>
        ))}
      </div>

      {/* ── BREATHING ── */}
      {tab === "breathing" && (
        <section aria-labelledby="breathing-heading" className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 id="breathing-heading" className="sr-only">4-7-8 Breathing Exercise</h2>

          <div className="flex flex-col items-center gap-6">
            {/* Circle */}
            <div className="relative flex h-48 w-48 items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full ring-4 transition-all ${
                  active ? currentPhase.ringColor : "ring-slate-200"
                } ${expanding ? "scale-110" : "scale-100"}`}
                style={{ transitionDuration: active ? `${currentPhase.duration * 900}ms` : "500ms", transitionTimingFunction: "ease-in-out" }}
                aria-hidden="true"
              />
              <div
                className={`h-32 w-32 rounded-full transition-all ${
                  active ? "bg-indigo-100 shadow-inner" : "bg-slate-100"
                } ${expanding ? "scale-125" : "scale-90"}`}
                style={{ transitionDuration: active ? `${currentPhase.duration * 900}ms` : "500ms", transitionTimingFunction: "ease-in-out" }}
                aria-hidden="true"
              />
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold tabular-nums text-slate-800" aria-live="polite" aria-atomic="true">
                  {active ? countdown : <span className="text-3xl">🌬️</span>}
                </span>
              </div>
            </div>

            {/* Label */}
            <div className="text-center" aria-live="polite">
              <p className="text-lg font-semibold text-slate-800">
                {active ? currentPhase.label : "4-7-8 Breathing"}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                {active ? currentPhase.instruction : "Inhale 4s → Hold 7s → Exhale 8s"}
              </p>
              {cycles > 0 && (
                <p className="mt-2 text-sm font-medium text-indigo-600">
                  🎉 {cycles} {cycles === 1 ? "cycle" : "cycles"} complete
                </p>
              )}
            </div>

            {/* Phase indicators */}
            {active && (
              <div className="flex gap-2" aria-hidden="true">
                {PHASES.filter((p) => p.phase !== "rest").map((p) => (
                  <div
                    key={p.phase}
                    className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${
                      currentPhase.phase === p.phase ? "bg-indigo-500" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            )}

            {!active ? (
              <button
                onClick={() => { setCycles(0); setPhaseIdx(0); setCountdown(PHASES[0].duration); setActive(true); }}
                className="rounded-full bg-indigo-600 px-12 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Start
              </button>
            ) : (
              <button
                onClick={stop}
                className="rounded-full border border-slate-300 px-12 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-400"
              >
                Stop
              </button>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">Technique by Dr. Andrew Weil · Reduces anxiety in minutes</p>
        </section>
      )}

      {/* ── GROUNDING ── */}
      {tab === "grounding" && (
        <section aria-labelledby="grounding-heading" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 id="grounding-heading" className="mb-1 text-base font-semibold text-slate-800">5-4-3-2-1 Grounding</h2>
          <p className="mb-5 text-sm text-slate-500">Overwhelmed? This anchors you to the present. Work through each step slowly.</p>
          <ol className="space-y-2.5">
            {GROUNDING.map((g) => (
              <li key={g.n} className={`flex items-center gap-4 rounded-xl border ${g.bg} px-4 py-3`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-base font-black shadow-sm ${g.text}`}>
                  {g.n}
                </span>
                <p className="text-sm font-medium text-slate-700">
                  <span className="mr-1.5" aria-hidden="true">{g.icon}</span>
                  Name <strong>{g.n}</strong> {g.sense}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-center text-xs text-slate-400 italic">Breathe naturally. There&apos;s no rush.</p>
        </section>
      )}

      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-700">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
