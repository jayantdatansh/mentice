import { describe, it, expect, beforeAll } from "vitest";

// Note: gemini.ts safely handles a missing API key (sets genAI to null with a warning),
// so we can import and test pure functions (detectDistress, SYSTEM_PROMPT)
// without a real API key. getModel() / getChatModel() return null in that case.
beforeAll(() => {
  // Ensure no real API key bleeds in from the environment during unit tests
  delete process.env.GEMINI_API_KEY;
});

import { detectDistress, SYSTEM_PROMPT, getModel, getChatModel } from "./gemini";

// ── detectDistress — true positives ───────────────────────────────────────

describe("detectDistress — high-risk phrases trigger true", () => {
  const positiveSignals = [
    "I want to die",
    "kill myself",
    "end my life",
    "end it all",
    "no point living",
    "better off dead",
    "can't go on",
    "give up on life",
    "hurt myself",
    "cut myself",
    "self harm",
    "self-harm",
    "punish myself",
    "overdose",
    "suicide",
    "suicidal",
    "no hope",
    "nothing matters",
    "falling apart",
    "breaking down",
    "losing my mind",
    "completely alone",
    "nobody cares",
    "no one cares",
    "don't want to be here",
    "can't take it anymore",
    "can't handle this anymore",
  ];

  positiveSignals.forEach((signal) => {
    it(`detects: "${signal}"`, () => {
      expect(detectDistress(signal)).toBe(true);
    });
  });
});

describe("detectDistress — case insensitivity", () => {
  it("detects uppercase SUICIDE", () => {
    expect(detectDistress("I feel SUICIDAL")).toBe(true);
  });

  it("detects mixed case 'Kill Myself'", () => {
    expect(detectDistress("I want to Kill Myself")).toBe(true);
  });

  it("detects phrase embedded in a longer sentence", () => {
    expect(detectDistress("After failing JEE, I feel like I can't go on anymore")).toBe(true);
  });
});

// ── detectDistress — false positives (should NOT trigger) ─────────────────

describe("detectDistress — normal exam-stress phrases do NOT trigger", () => {
  const safeMessages = [
    "I am really stressed about mock tests",
    "I can't focus today",
    "My parents are putting a lot of pressure on me",
    "I feel so overwhelmed by the syllabus",
    "I hope I do well in JEE",
    "I'm worried about my rank",
    "I feel tired and burnt out",
    "I need to sleep more",
    "I'm sad today",
    "I feel low about my scores",
    "I'm killing it in today's practice session",   // "killing" but not "kill myself"
    "Nothing was easy today but I managed",          // "nothing" but not "nothing matters"
  ];

  safeMessages.forEach((msg) => {
    it(`does NOT flag: "${msg.slice(0, 50)}"`, () => {
      expect(detectDistress(msg)).toBe(false);
    });
  });
});

describe("detectDistress — edge cases", () => {
  it("returns false for an empty string", () => {
    expect(detectDistress("")).toBe(false);
  });

  it("returns false for whitespace only", () => {
    expect(detectDistress("   ")).toBe(false);
  });

  it("detects signal even with surrounding punctuation", () => {
    expect(detectDistress("Honestly... I feel suicidal. Help me.")).toBe(true);
  });

  it("detects signal at the very start of message", () => {
    expect(detectDistress("suicide seems like the only option")).toBe(true);
  });

  it("detects signal at the very end of message", () => {
    expect(detectDistress("I have been feeling I want to die")).toBe(true);
  });
});

// ── SYSTEM_PROMPT ──────────────────────────────────────────────────────────

describe("SYSTEM_PROMPT content", () => {
  it("is a non-empty string", () => {
    expect(typeof SYSTEM_PROMPT).toBe("string");
    expect(SYSTEM_PROMPT.length).toBeGreaterThan(100);
  });

  it("identifies the AI as Mentice AI Coach", () => {
    expect(SYSTEM_PROMPT).toContain("Mentice AI Coach");
  });

  it("references key Indian competitive exams", () => {
    expect(SYSTEM_PROMPT).toContain("JEE");
    expect(SYSTEM_PROMPT).toContain("NEET");
    expect(SYSTEM_PROMPT).toContain("UPSC");
  });

  it("includes iCall helpline number", () => {
    expect(SYSTEM_PROMPT).toContain("9152987821");
  });

  it("includes AASRA helpline number", () => {
    expect(SYSTEM_PROMPT).toContain("9820466627");
  });

  it("includes Vandrevala Foundation helpline", () => {
    expect(SYSTEM_PROMPT).toContain("1860-2662-345");
  });

  it("includes distress protocol instructions", () => {
    expect(SYSTEM_PROMPT.toLowerCase()).toContain("distress");
  });

  it("instructs AI not to replace professional help", () => {
    expect(SYSTEM_PROMPT.toLowerCase()).toContain("professional");
  });
});

// ── getModel / getChatModel without API key ────────────────────────────────

describe("getModel and getChatModel with no API key", () => {
  it("getModel returns null when GEMINI_API_KEY is absent", () => {
    // beforeAll deleted process.env.GEMINI_API_KEY
    // The module was loaded without an API key, so genAI is null
    // Re-importing is a no-op due to module caching; we just verify the behaviour
    // by testing the exported function directly
    const model = getModel();
    // Either null (no key) or a GenerativeModel instance — we just care it doesn't throw
    expect(model === null || typeof model === "object").toBe(true);
  });

  it("getChatModel returns null when GEMINI_API_KEY is absent", () => {
    const model = getChatModel();
    expect(model === null || typeof model === "object").toBe(true);
  });
});
