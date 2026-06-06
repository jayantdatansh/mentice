import { updateProfile } from "@/app/actions/checkin";
import { EXAMS } from "@/lib/constants";
import { daysUntil } from "@/lib/utils";

interface Props {
  exam: string | null;
  examDate: Date | null;
}

function getExamTip(days: number): string {
  if (days <= 0)  return "Exam day! Take a deep breath — you've got this. 💪";
  if (days <= 7)  return "Final week. Revise, sleep well, eat right.";
  if (days <= 30) return "Last stretch! Prioritise weak areas.";
  if (days <= 90) return "Steady pace wins. Consistency beats cramming.";
  return "Build good habits now — they'll carry you through.";
}

export function ExamCountdown({ exam, examDate }: Props) {
  const days = daysUntil(examDate);
  const examLabel = EXAMS.find((e) => e.key === exam)?.label ?? exam;

  return (
    <section aria-labelledby="exam-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 id="exam-heading" className="mb-3 text-sm font-semibold text-slate-700">🎯 Exam Countdown</h2>

      {exam && days !== null ? (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">
            Preparing for <span className="font-semibold text-indigo-600">{examLabel}</span>
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tabular-nums text-slate-900">{days > 0 ? days : 0}</span>
            <span className="text-sm text-slate-500">days to go</span>
          </div>
          <p className="text-xs text-slate-500 italic">{getExamTip(days)}</p>
        </div>
      ) : (
        <p className="mb-3 text-sm text-slate-400">Set your exam to start the countdown.</p>
      )}

      <details className="mt-4 group">
        <summary className="cursor-pointer list-none flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
          <span>{exam ? "Update exam" : "Set your exam"}</span>
          <span className="transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
        </summary>
        <form action={updateProfile} className="mt-3 space-y-2.5">
          <div>
            <label htmlFor="exam-select" className="mb-1 block text-xs text-slate-500">Exam</label>
            <select
              id="exam-select"
              name="exam"
              defaultValue={exam ?? ""}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
            >
              <option value="">Select exam…</option>
              {EXAMS.map((e) => <option key={e.key} value={e.key}>{e.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="exam-date" className="mb-1 block text-xs text-slate-500">Exam Date</label>
            <input
              id="exam-date"
              name="examDate"
              type="date"
              defaultValue={examDate ? examDate.toISOString().slice(0, 10) : ""}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
            />
          </div>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700">
            Save
          </button>
        </form>
      </details>
    </section>
  );
}
