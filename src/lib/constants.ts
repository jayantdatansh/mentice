export const MOODS = [
  { value: 1, emoji: "😞", label: "Very Low" },
  { value: 2, emoji: "😔", label: "Low" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
] as const;

export const TRIGGERS = [
  { key: "syllabus", label: "Heavy Syllabus" },
  { key: "mock_score", label: "Mock Score" },
  { key: "sleep", label: "Sleep Issues" },
  { key: "parents", label: "Family Pressure" },
  { key: "comparison", label: "Peer Comparison" },
  { key: "results", label: "Result Anxiety" },
  { key: "time", label: "Time Pressure" },
  { key: "concepts", label: "Tough Concepts" },
] as const;

export const EXAMS = [
  { key: "JEE", label: "JEE (Mains/Advanced)" },
  { key: "NEET", label: "NEET-UG" },
  { key: "CUET", label: "CUET" },
  { key: "CAT", label: "CAT" },
  { key: "GATE", label: "GATE" },
  { key: "UPSC", label: "UPSC" },
  { key: "BOARD", label: "Board Exams" },
  { key: "OTHER", label: "Other" },
] as const;

export const HELPLINES = [
  {
    name: "iCall",
    number: "9152987821",
    desc: "Mon–Sat, 8am–10pm",
  },
  {
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    desc: "24/7 helpline",
  },
  {
    name: "AASRA",
    number: "9820466627",
    desc: "24/7 crisis support",
  },
] as const;

export type TriggerKey = (typeof TRIGGERS)[number]["key"];
export type ExamKey = (typeof EXAMS)[number]["key"];
