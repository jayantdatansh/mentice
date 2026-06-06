"use client";

import { useActionState, useState } from "react";
import { createCheckIn } from "@/app/actions/checkin";
import { MOODS, TRIGGERS } from "@/lib/constants";
import Link from "next/link";

type State = { error?: string } | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAction = (_prevState: any, formData: FormData) => Promise<any>;

export default function CheckInPage() {
  const [state, formAction, pending] = useActionState<State, FormData>(createCheckIn as AnyAction, undefined);
  const [selectedMood, setSelectedMood]       = useState<number>(3);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  function toggleTrigger(key: string) {
    setSelectedTriggers((prev) => prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Daily Check-in</h1>
        <p className="mt-1 text-sm text-slate-500">Takes 60 seconds. Just for you.</p>
      </div>

      <form action={formAction} className="space-y-6" noValidate>

        {/* Mood */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <fieldset>
            <legend className="mb-4 text-sm font-semibold text-slate-700">How are you feeling right now?</legend>
            <div className="flex gap-2" role="radiogroup" aria-label="Mood from 1 to 5">
              {MOODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex flex-1 cursor-pointer flex-col items-center gap-1.5 rounded-xl border py-3 text-center transition ${
                    selectedMood === m.value
                      ? "border-indigo-400 bg-indigo-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="mood"
                    value={m.value}
                    checked={selectedMood === m.value}
                    onChange={() => setSelectedMood(m.value)}
                    className="sr-only"
                    aria-label={m.label}
                  />
                  <span className="text-2xl leading-none" aria-hidden="true">{m.emoji}</span>
                  <span className={`text-xs font-medium ${selectedMood === m.value ? "text-indigo-700" : "text-slate-500"}`}>{m.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Triggers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-700">
              What&apos;s weighing on you?{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map((t) => {
                const checked = selectedTriggers.includes(t.key);
                return (
                  <label
                    key={t.key}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      checked
                        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="triggers"
                      value={t.key}
                      checked={checked}
                      onChange={() => toggleTrigger(t.key)}
                      className="sr-only"
                      aria-label={t.label}
                    />
                    {t.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Note */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label htmlFor="note" className="mb-2 block text-sm font-semibold text-slate-700">
            Anything on your mind?{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            maxLength={500}
            placeholder="Vent here, reflect here — no judgment."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200"
          />
          <p className="mt-1 text-right text-xs text-slate-400">Max 500 characters</p>
        </div>

        {state?.error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save Check-in ✓"}
          </button>
          <Link href="/dashboard" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
