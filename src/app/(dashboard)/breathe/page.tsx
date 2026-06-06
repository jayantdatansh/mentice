"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

type Phase = "idle" | "inhale" | "hold" | "exhale" | "rest";

const PHASES: { phase: Phase; duration: number; label: string; instruction: string }[] = [
  { phase: "inhale", duration: 4, label: "Breathe In",    instruction: "Slowly breathe in through your nose" },
  { phase: "hold",   duration: 7, label: "Hold",          instruction: "Hold your breath gently" },
  { phase: "exhale", duration: 8, label: "Breathe Out",   instruction: "Exhale completely through your mouth" },
  { phase: "rest",   duration: 1, label: "Rest",          instruction: "Relax and prepare for next breath" },
];

const GROUNDING = [
  { n: 5, sense: "things you can SEE",  icon: "👁️" },
  { n: 4, sense: "things you can TOUCH", icon: "✋" },
  { n: 3, sense: "things you can HEAR",  icon: "👂" },
  { n: 2, sense: "things you can SMELL", icon: "👃" },
  { n: 1, sense: "thing you can TASTE",  icon: "👅" },
];

export default function BreathePage() {
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);
  const [cycles, setCycles] = useState(0);
  const [tab, setTab] = useState<"breathing" | "grounding">("breathing");
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
          const nextIdx = (phaseIdx + 1) % PHASES.length;
          setPhaseIdx(nextIdx);
          if (nextIdx === 0) setCycles((c) => c + 1);
          setCountdown(PHASES[nextIdx].duration);
          return PHASES[nextIdx].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, phaseIdx]);

  const scaleClass =
    currentPhase.phase === "inhale"
      ? "scale-150"
      : currentPhase.phase === "hold"
      ? "scale-150"
      : "scale-100";

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Calm Down Corner</h1>
        <p className="mt-1 text-sm text-slate-400">
          Quick techniques to reset your nervous system.
        </p>
      </div>

      {/* Tab switcher */}
      <div
        role="tablist"
        aria-label="Wellness techniques"
        className="flex rounded-xl border border-slate-800 bg-slate-900 p-1"
      >
        {(["breathing", "grounding"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => { stop(); setTab(t); }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              tab === t
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t === "breathing" ? "🫁 4-7-8 Breathing" : "🖐️ 5-4-3-2-1 Grounding"}
          </button>
        ))}
      </div>

      {/* Breathing tab */}
      {tab === "breathing" && (
        <section aria-labelledby="breathing-heading">
          <h2 id="breathing-heading" className="sr-only">4-7-8 Breathing Exercise</h2>

          {/* Animated circle */}
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="relative flex h-48 w-48 items-center justify-center">
              {/* Outer ring */}
              <div
                className={`absolute inset-0 rounded-full bg-indigo-500/10 ring-2 ring-indigo-500/30 transition-transform duration-1000 ${
                  active ? scaleClass : "scale-100"
                }`}
                aria-hidden="true"
                style={{ transitionDuration: active ? `${currentPhase.duration * 1000}ms` : "500ms" }}
              />
              {/* Inner circle — respects prefers-reduced-motion via CSS class */}
              <div
                className={`h-28 w-28 rounded-full bg-indigo-600/80 shadow-lg shadow-indigo-500/30 transition-transform ${
                  active ? (currentPhase.phase === "inhale" || currentPhase.phase === "hold" ? "scale-125" : "scale-90") : "scale-100"
                }`}
                aria-hidden="true"
                style={{
                  transitionDuration: active ? `${currentPhase.duration * 1000}ms` : "500ms",
                  transitionTimingFunction: "ease-in-out",
                }}
              />
              {/* Counter */}
              <div className="absolute flex flex-col items-center gap-0.5">
                <span
                  className="text-4xl font-bold tabular-nums text-white"
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label={`${countdown} seconds`}
                >
                  {active ? countdown : ""}
                </span>
                {!active && (
                  <span className="text-sm text-slate-400" aria-hidden="true">Ready</span>
                )}
              </div>
            </div>

            {/* Phase label */}
            <div className="text-center" aria-live="polite" aria-atomic="true">
              <p className="text-lg font-semibold text-white">
                {active ? currentPhase.label : "4-7-8 Breathing"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {active
                  ? currentPhase.instruction
                  : "Inhale 4s → Hold 7s → Exhale 8s"}
              </p>
              {cycles > 0 && (
                <p className="mt-2 text-xs text-indigo-400">
                  {cycles} {cycles === 1 ? "cycle" : "cycles"} completed 🎉
                </p>
              )}
            </div>

            <div className="flex gap-3">
              {!active ? (
                <button
                  onClick={() => { setCycles(0); setPhaseIdx(0); setCountdown(PHASES[0].duration); setActive(true); }}
                  className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={stop}
                  className="rounded-xl border border-slate-700 px-8 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-500"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Grounding tab */}
      {tab === "grounding" && (
        <section aria-labelledby="grounding-heading">
          <h2 id="grounding-heading" className="mb-2 text-base font-semibold text-white">
            The 5-4-3-2-1 Grounding Technique
          </h2>
          <p className="mb-6 text-sm text-slate-400">
            Feeling overwhelmed? This anchors you back in the present moment.
            Work through each sense slowly.
          </p>
          <ol className="space-y-4" aria-label="Grounding steps">
            {GROUNDING.map((g) => (
              <li key={g.n} className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-900/60 text-lg font-bold text-indigo-300">
                  {g.n}
                </span>
                <div>
                  <p className="font-medium text-white">
                    <span className="mr-2" aria-hidden="true">{g.icon}</span>
                    Name <strong>{g.n}</strong> {g.sense}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-slate-500 italic">
            Breathe naturally throughout. There&apos;s no rush.
          </p>
        </section>
      )}

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
