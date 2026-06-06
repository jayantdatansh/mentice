import { updateProfile } from "@/app/actions/checkin";
import { EXAMS } from "@/lib/constants";
import { daysUntil } from "@/lib/utils";

interface Props {
  exam: string | null;
  examDate: Date | null;
}

function getExamTip(days: number): string {
  if (days <= 0) return "Exam day is here! Take a deep breath. You've got this. 💪";
  if (days <= 7) return "Final week! Focus on revision, sleep well, eat right.";
  if (days <= 30) return "Last stretch! Prioritise weak areas. Rest is part of prep.";
  if (days <= 90) return "Steady pace wins the race. Consistency beats cramming.";
  return "You have time — build good habits now and they'll carry you through.";
}

export function ExamCountdown({ exam, examDate }: Props) {
  const days = daysUntil(examDate);

  return (
    <section aria-labelledby="exam-heading" className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 id="exam-heading" className="mb-4 text-base font-semibold text-slate-200">
        🎯 Exam Countdown
      </h2>

      {exam && days !== null ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">
            Preparing for <span className="font-semibold text-indigo-300">{exam}</span>
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tabular-nums text-white">
              {days > 0 ? days : 0}
            </span>
            <span className="text-slate-400">days to go</span>
          </div>
          <p className="mt-2 text-sm text-slate-400 italic">{getExamTip(days)}</p>
        </div>
      ) : (
        <p className="mb-4 text-sm text-slate-400">
          Set your exam to track your countdown.
        </p>
      )}

      <details className="mt-4 group">
        <summary className="cursor-pointer text-sm font-medium text-indigo-400 hover:text-indigo-300 list-none flex items-center gap-1">
          <span>{exam ? "Update exam" : "Set your exam"}</span>
          <span className="transition group-open:rotate-180" aria-hidden="true">▾</span>
        </summary>
        <form action={updateProfile} className="mt-3 space-y-3">
          <div>
            <label htmlFor="exam" className="mb-1 block text-xs text-slate-400">
              Exam
            </label>
            <select
              id="exam"
              name="exam"
              defaultValue={exam ?? ""}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Select exam…</option>
              {EXAMS.map((e) => (
                <option key={e.key} value={e.key}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="examDate" className="mb-1 block text-xs text-slate-400">
              Exam Date
            </label>
            <input
              id="examDate"
              name="examDate"
              type="date"
              defaultValue={examDate ? examDate.toISOString().slice(0, 10) : ""}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Save
          </button>
        </form>
      </details>
    </section>
  );
}
