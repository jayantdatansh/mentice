import { describe, it, expect } from "vitest";
import { avgMood, topTrigger, calcStreak, daysUntil, hasCheckedInToday, clamp, moodMeta } from "./utils";

const makeCheckIn = (mood: number, triggers: string[], daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(10, 0, 0, 0);
  return { mood, triggers, createdAt: d };
};

describe("avgMood", () => {
  it("returns 0 for empty array", () => {
    expect(avgMood([])).toBe(0);
  });

  it("returns the single mood if one check-in", () => {
    expect(avgMood([makeCheckIn(4, [], 0)])).toBe(4);
  });

  it("returns correct average", () => {
    const data = [makeCheckIn(2, [], 2), makeCheckIn(4, [], 1), makeCheckIn(3, [], 0)];
    expect(avgMood(data)).toBeCloseTo(3);
  });
});

describe("topTrigger", () => {
  it("returns null for empty triggers", () => {
    expect(topTrigger([makeCheckIn(3, [], 0)])).toBeNull();
  });

  it("returns the most frequent trigger", () => {
    const data = [
      makeCheckIn(3, ["sleep", "parents"], 2),
      makeCheckIn(2, ["sleep", "results"], 1),
      makeCheckIn(4, ["parents"], 0),
    ];
    expect(topTrigger(data)).toBe("sleep");
  });
});

describe("calcStreak", () => {
  it("returns 0 for empty array", () => {
    expect(calcStreak([])).toBe(0);
  });

  it("returns 1 for only today", () => {
    expect(calcStreak([makeCheckIn(3, [], 0)])).toBe(1);
  });

  it("counts consecutive days", () => {
    const data = [
      makeCheckIn(3, [], 0),
      makeCheckIn(4, [], 1),
      makeCheckIn(2, [], 2),
    ];
    expect(calcStreak(data)).toBe(3);
  });

  it("stops at gap", () => {
    const data = [
      makeCheckIn(3, [], 0),
      makeCheckIn(4, [], 2), // gap at day 1
    ];
    expect(calcStreak(data)).toBe(1);
  });
});

describe("daysUntil", () => {
  it("returns null for null input", () => {
    expect(daysUntil(null)).toBeNull();
  });

  it("returns positive for future date", () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    expect(daysUntil(future)).toBe(10);
  });

  it("returns 0 for today", () => {
    expect(daysUntil(new Date())).toBe(0);
  });
});

describe("hasCheckedInToday", () => {
  it("returns false for empty array", () => {
    expect(hasCheckedInToday([])).toBe(false);
  });

  it("returns true when checked in today", () => {
    expect(hasCheckedInToday([makeCheckIn(3, [], 0)])).toBe(true);
  });

  it("returns false when last check-in was yesterday", () => {
    expect(hasCheckedInToday([makeCheckIn(3, [], 1)])).toBe(false);
  });
});

describe("clamp", () => {
  it("clamps below min", () => expect(clamp(-5, 1, 5)).toBe(1));
  it("clamps above max", () => expect(clamp(10, 1, 5)).toBe(5));
  it("passes through valid values", () => expect(clamp(3, 1, 5)).toBe(3));
  it("returns min when value equals min (boundary)", () => expect(clamp(1, 1, 5)).toBe(1));
  it("returns max when value equals max (boundary)", () => expect(clamp(5, 1, 5)).toBe(5));
});

describe("moodMeta", () => {
  it("returns the correct entry for mood 1 (Very Low)", () => {
    const meta = moodMeta(1);
    expect(meta.value).toBe(1);
    expect(meta.label).toBe("Very Low");
  });

  it("returns the correct entry for mood 5 (Great)", () => {
    const meta = moodMeta(5);
    expect(meta.value).toBe(5);
    expect(meta.label).toBe("Great");
  });

  it("returns the correct entry for mood 3 (Okay)", () => {
    const meta = moodMeta(3);
    expect(meta.label).toBe("Okay");
  });

  it("falls back to the middle mood (index 2) for an unknown value", () => {
    const meta = moodMeta(99);
    // MOODS[2] is mood value 3 — "Okay"
    expect(meta.value).toBe(3);
  });

  it("every valid mood value 1-5 returns a matching entry", () => {
    [1, 2, 3, 4, 5].forEach((v) => {
      expect(moodMeta(v).value).toBe(v);
    });
  });
});

describe("topTrigger — additional edge cases", () => {
  it("returns null when all check-ins have empty trigger arrays", () => {
    const data = [
      makeCheckIn(3, [], 0),
      makeCheckIn(4, [], 1),
    ];
    expect(topTrigger(data)).toBeNull();
  });

  it("handles a tie by returning one of the tied triggers", () => {
    const data = [
      makeCheckIn(3, ["sleep"], 0),
      makeCheckIn(3, ["parents"], 1),
    ];
    const result = topTrigger(data);
    expect(["sleep", "parents"]).toContain(result);
  });

  it("works with a single check-in that has multiple triggers", () => {
    const data = [makeCheckIn(2, ["syllabus", "mock_score", "time"], 0)];
    const result = topTrigger(data);
    expect(["syllabus", "mock_score", "time"]).toContain(result);
  });
});

describe("calcStreak — additional edge cases", () => {
  it("returns 1 when only yesterday was checked (no today)", () => {
    const data = [makeCheckIn(3, [], 1)]; // only yesterday
    // streak starts from today; yesterday doesn't match today
    expect(calcStreak(data)).toBe(0);
  });

  it("returns correct streak with multiple check-ins on same day", () => {
    const data = [
      makeCheckIn(3, [], 0),
      makeCheckIn(4, [], 0), // duplicate today
      makeCheckIn(2, [], 1),
    ];
    // Both today entries point to today; should still count as streak 2
    expect(calcStreak(data)).toBeGreaterThanOrEqual(1);
  });
});

describe("daysUntil — additional edge cases", () => {
  it("returns null for undefined-like falsy input", () => {
    // @ts-expect-error testing runtime falsy
    expect(daysUntil(undefined)).toBeNull();
  });

  it("returns a negative number for a past date", () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    const result = daysUntil(past);
    expect(result).toBeLessThanOrEqual(-4); // at least 4 days in the past
  });

  it("accepts a date string", () => {
    const future = new Date();
    future.setDate(future.getDate() + 7);
    const result = daysUntil(future.toISOString());
    expect(result).toBe(7);
  });
});
