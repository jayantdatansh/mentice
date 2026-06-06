import { describe, it, expect } from "vitest";
import { avgMood, topTrigger, calcStreak, daysUntil, hasCheckedInToday, clamp } from "./utils";

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
});
