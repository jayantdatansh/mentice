"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { saveOnboarding } from "@/app/actions/onboarding";
import { EXAMS } from "@/lib/constants";

const STEPS = ["Welcome", "Your Exam", "Get Started"];

export default function OnboardingPage() {
  const [step, setStep]                 = useState(0);
  const [exam, setExam]                 = useState("");
  const [customExam, setCustomExam]     = useState("");
  const [examDate, setExamDate]         = useState("");
  const [isPending, startTransition]    = useTransition();

  function next() { setStep((s) => Math.min(s + 1, STEPS.length - 1)); }
  function back() { setStep((s) => Math.max(s - 1, 0)); }

  // Final exam value: if "OTHER" selected use the typed custom value
  const finalExam = exam === "OTHER" ? (customExam.trim() || "OTHER") : exam;

  function handleSubmit() {
    const fd = new FormData();
    fd.append("exam", finalExam);
    fd.append("examDate", examDate);
    startTransition(() => saveOnboarding(fd));
  }

  return (
    <div
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-4"
      style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-white/70" aria-hidden="true" />

      <div className="relative flex h-full w-full max-w-lg flex-col items-center justify-center py-6 overflow-y-auto">

        {/* Logo */}
        <div className="mb-4 flex flex-col items-center gap-1.5">
          <Image src="/logo.png" alt="Mentice" width={40} height={40} className="h-10 w-auto" priority />
          <span className="text-xl font-bold text-slate-900 tracking-tight">mentice</span>
        </div>

        {/* Progress dots */}
        <div className="mb-4 flex items-center justify-center gap-6" role="progressbar" aria-valuemin={0} aria-valuemax={STEPS.length - 1} aria-valuenow={step}>
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={`h-3 w-3 rounded-full transition-all duration-300 ${
                i < step ? "bg-blue-500" : i === step ? "bg-blue-600 ring-4 ring-blue-100" : "bg-slate-300"
              }`} />
              <span className={`text-xs font-medium ${i === step ? "text-blue-600" : "text-slate-400"}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">

          {/* ── STEP 0 — Welcome ── */}
          {step === 0 && (
            <div className="space-y-5 text-center">
              <div className="text-5xl">🌟</div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome to Mentice!</h1>
                <p className="mt-2 text-sm text-slate-500">
                  Your personal mental wellness companion for exam season. Let&apos;s get you set up.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-left">
                {[
                  { icon: "📊", text: "Track your mood daily" },
                  { icon: "🤖", text: "AI-powered insights" },
                  { icon: "🫁", text: "Breathing exercises" },
                  { icon: "🔥", text: "Build a wellness streak" },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-medium text-slate-700">
                    <span>{f.icon}</span><span>{f.text}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={next}
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-teal-400 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Let&apos;s Begin →
              </button>
              <p className="text-xs text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">Sign in</Link>
              </p>
            </div>
          )}

          {/* ── STEP 1 — Exam ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">What are you preparing for?</h2>
                <p className="mt-1 text-sm text-slate-500">Helps us give relevant tips and countdown your exam.</p>
              </div>

              {/* Exam grid */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Select your exam</label>
                <div className="grid grid-cols-2 gap-2">
                  {EXAMS.map((e) => (
                    <button
                      key={e.key}
                      type="button"
                      onClick={() => { setExam(e.key); if (e.key !== "OTHER") setCustomExam(""); }}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition text-left ${
                        exam === e.key
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                      }`}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom exam input — shown only when "Other" selected */}
              {exam === "OTHER" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label htmlFor="customExam" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Which exam? <span className="text-slate-400 font-normal">(type it in)</span>
                  </label>
                  <input
                    id="customExam"
                    type="text"
                    value={customExam}
                    onChange={(e) => setCustomExam(e.target.value)}
                    placeholder="e.g. SSC CGL, CLAT, NDA, CA Foundation…"
                    maxLength={60}
                    autoFocus
                    className="w-full rounded-xl border border-blue-300 bg-blue-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}

              {/* Exam date */}
              <div>
                <label htmlFor="examDate" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Exam date <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={back} className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-400">
                  ← Back
                </button>
                <button
                  onClick={next}
                  className="flex-[2] rounded-full bg-gradient-to-r from-blue-600 to-teal-400 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Continue →
                </button>
              </div>
              <button onClick={next} className="w-full text-center text-xs text-slate-400 hover:text-slate-600">
                Skip for now
              </button>
            </div>
          )}

          {/* ── STEP 2 — Final ── */}
          {step === 2 && (
            <div className="space-y-5 text-center">
              <div className="text-5xl">🚀</div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">You&apos;re all set!</h2>
                <p className="mt-2 text-sm text-slate-500">
                  {finalExam && finalExam !== "OTHER"
                    ? `We've noted your ${EXAMS.find((e) => e.key === finalExam)?.label ?? finalExam} prep. Your wellness journey starts now.`
                    : "Your wellness journey starts now. Take your first mood check-in to get personalised insights."}
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 p-4 text-left space-y-2">
                <p className="text-sm font-semibold text-slate-700">What&apos;s next:</p>
                {["✅ Complete your first daily check-in", "🤖 Get a personalised AI insight", "🫁 Try a breathing exercise"].map((t) => (
                  <p key={t} className="text-sm text-slate-600">{t}</p>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                aria-busy={isPending}
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-teal-400 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? "Setting up…" : "Go to Dashboard →"}
              </button>
              <button onClick={back} className="w-full text-xs text-slate-400 hover:text-slate-600">← Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
