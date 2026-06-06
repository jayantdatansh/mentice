"use client";

import { useActionState, useState } from "react";
import { createCheckIn } from "@/app/actions/checkin";
import { MOODS, TRIGGERS } from "@/lib/constants";
import Link from "next/link";

type State = { error?: string } | undefined;
// createCheckIn always redirects — cast to satisfy useActionState signature
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAction = (_prevState: any, formData: FormData) => Promise<any>;

export default function CheckInPage() {
  const [state, formAction, pending] = useActionState<State, FormData>(
    createCheckIn as AnyAction,
    undefined
  );
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  function toggleTrigger(key: string) {
    setSelectedTriggers((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Daily Check-in</h1>
        <p className="mt-1 text-sm text-slate-400">
          Takes 60 seconds. It&apos;s for <em>you</em>.
        </p>
      </div>

      <form action={formAction} className="space-y-8">
        {/* Mood */}
        <fieldset>
          <legend className="mb-4 text-base font-semibold text-slate-200">
            How are you feeling right now?
          </legend>
          <div className="flex justify-between gap-2" role="radiogroup" aria-label="Mood scale from 1 to 5">
            {MOODS.map((m) => (
              <label
                key={m.value}
                className={`flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-xl border p-3 text-center transition ${
                  selectedMood === m.value
                    ? "border-indigo-500 bg-indigo-900/40 text-white"
                    : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600"
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
                <span className="text-2xl leading-none" aria-hidden="true">
                  {m.emoji}
                </span>
                <span className="text-xs">{m.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Triggers */}
        <fieldset>
          <legend className="mb-3 text-base font-semibold text-slate-200">
            What&apos;s weighing on you?{" "}
            <span className="text-sm font-normal text-slate-500">(optional)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {TRIGGERS.map((t) => {
              const checked = selectedTriggers.includes(t.key);
              return (
                <label
                  key={t.key}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${
                    checked
                      ? "border-indigo-500 bg-indigo-900/50 text-indigo-300"
                      : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600"
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

        {/* Note */}
        <div>
          <label htmlFor="note" className="mb-2 block text-base font-semibold text-slate-200">
            Anything on your mind?{" "}
            <span className="text-sm font-normal text-slate-500">(optional)</span>
          </label>
          <textarea
            id="note"
            name="note"
            rows={4}
            maxLength={500}
            placeholder="Vent here, reflect here — no judgment."
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <p className="mt-1 text-right text-xs text-slate-500">Max 500 characters</p>
        </div>

        {state?.error && (
          <p role="alert" className="rounded-xl bg-red-900/40 px-4 py-3 text-sm text-red-300">
            {state.error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save Check-in ✓"}
          </button>
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-500"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
