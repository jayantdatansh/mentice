import { describe, it, expect } from "vitest";
import { MOODS, TRIGGERS, EXAMS, HELPLINES } from "./constants";

// ── MOODS ──────────────────────────────────────────────────────────────────

describe("MOODS", () => {
  it("has exactly 5 mood levels", () => {
    expect(MOODS).toHaveLength(5);
  });

  it("covers values 1 through 5", () => {
    const values = MOODS.map((m) => m.value).sort();
    expect(values).toEqual([1, 2, 3, 4, 5]);
  });

  it("every mood has a non-empty emoji", () => {
    MOODS.forEach((m) => {
      expect(m.emoji.length).toBeGreaterThan(0);
    });
  });

  it("every mood has a non-empty label", () => {
    MOODS.forEach((m) => {
      expect(m.label.length).toBeGreaterThan(0);
    });
  });

  it("mood values are unique", () => {
    const values = MOODS.map((m) => m.value);
    const unique = new Set(values);
    expect(unique.size).toBe(MOODS.length);
  });

  it("mood labels are unique", () => {
    const labels = MOODS.map((m) => m.label);
    const unique = new Set(labels);
    expect(unique.size).toBe(MOODS.length);
  });

  it("includes a 'Great' mood at value 5", () => {
    const great = MOODS.find((m) => m.value === 5);
    expect(great).toBeDefined();
    expect(great?.label).toBe("Great");
  });

  it("includes a 'Very Low' mood at value 1", () => {
    const low = MOODS.find((m) => m.value === 1);
    expect(low).toBeDefined();
    expect(low?.label).toBe("Very Low");
  });
});

// ── TRIGGERS ───────────────────────────────────────────────────────────────

describe("TRIGGERS", () => {
  it("has at least 6 stress triggers", () => {
    expect(TRIGGERS.length).toBeGreaterThanOrEqual(6);
  });

  it("every trigger has a non-empty key", () => {
    TRIGGERS.forEach((t) => {
      expect(t.key.length).toBeGreaterThan(0);
    });
  });

  it("every trigger has a non-empty label", () => {
    TRIGGERS.forEach((t) => {
      expect(t.label.length).toBeGreaterThan(0);
    });
  });

  it("trigger keys are unique", () => {
    const keys = TRIGGERS.map((t) => t.key);
    const unique = new Set(keys);
    expect(unique.size).toBe(TRIGGERS.length);
  });

  it("trigger keys contain only lowercase letters and underscores", () => {
    TRIGGERS.forEach((t) => {
      expect(t.key).toMatch(/^[a-z_]+$/);
    });
  });

  it("includes exam-relevant triggers (sleep, syllabus, results)", () => {
    const keys = TRIGGERS.map((t) => t.key);
    expect(keys).toContain("sleep");
    expect(keys).toContain("syllabus");
    expect(keys).toContain("results");
  });
});

// ── EXAMS ──────────────────────────────────────────────────────────────────

describe("EXAMS", () => {
  it("includes JEE, NEET, GATE, UPSC, CAT, CUET", () => {
    const keys = EXAMS.map((e) => e.key);
    expect(keys).toContain("JEE");
    expect(keys).toContain("NEET");
    expect(keys).toContain("GATE");
    expect(keys).toContain("UPSC");
    expect(keys).toContain("CAT");
    expect(keys).toContain("CUET");
  });

  it("includes an 'OTHER' catch-all option", () => {
    const keys = EXAMS.map((e) => e.key);
    expect(keys).toContain("OTHER");
  });

  it("includes Board Exams for school students", () => {
    const keys = EXAMS.map((e) => e.key);
    expect(keys).toContain("BOARD");
  });

  it("every exam has a non-empty key and label", () => {
    EXAMS.forEach((e) => {
      expect(e.key.length).toBeGreaterThan(0);
      expect(e.label.length).toBeGreaterThan(0);
    });
  });

  it("exam keys are unique", () => {
    const keys = EXAMS.map((e) => e.key);
    const unique = new Set(keys);
    expect(unique.size).toBe(EXAMS.length);
  });
});

// ── HELPLINES ──────────────────────────────────────────────────────────────

describe("HELPLINES", () => {
  it("has at least 2 helplines", () => {
    expect(HELPLINES.length).toBeGreaterThanOrEqual(2);
  });

  it("every helpline has a name, number, and description", () => {
    HELPLINES.forEach((h) => {
      expect(h.name.length).toBeGreaterThan(0);
      expect(h.number.length).toBeGreaterThan(0);
      expect(h.desc.length).toBeGreaterThan(0);
    });
  });

  it("helpline names are unique", () => {
    const names = HELPLINES.map((h) => h.name);
    const unique = new Set(names);
    expect(unique.size).toBe(HELPLINES.length);
  });

  it("includes iCall (established Indian mental health helpline)", () => {
    const found = HELPLINES.some((h) => h.name.toLowerCase().includes("icall"));
    expect(found).toBe(true);
  });

  it("includes AASRA crisis helpline", () => {
    const found = HELPLINES.some((h) => h.name.toUpperCase().includes("AASRA"));
    expect(found).toBe(true);
  });

  it("phone numbers contain only digits, dashes, or spaces", () => {
    HELPLINES.forEach((h) => {
      expect(h.number).toMatch(/^[\d\s\-]+$/);
    });
  });

  it("iCall number is correct (9152987821)", () => {
    const iCall = HELPLINES.find((h) => h.name.toLowerCase().includes("icall"));
    expect(iCall?.number.replace(/\D/g, "")).toBe("9152987821");
  });
});
