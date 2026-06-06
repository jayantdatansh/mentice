import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  validateName,
  sanitizeInput,
  isValidPhoneNumber,
} from "./validation";

// ── validateEmail ──────────────────────────────────────────────────────────

describe("validateEmail", () => {
  it("returns error for empty string", () => {
    expect(validateEmail("")).not.toBeNull();
  });

  it("returns error for whitespace-only string", () => {
    expect(validateEmail("   ")).not.toBeNull();
  });

  it("returns error for missing @ symbol", () => {
    expect(validateEmail("userexample.com")).not.toBeNull();
  });

  it("returns error for missing domain", () => {
    expect(validateEmail("user@")).not.toBeNull();
  });

  it("returns error for missing TLD", () => {
    expect(validateEmail("user@domain")).not.toBeNull();
  });

  it("returns null for valid email", () => {
    expect(validateEmail("student@example.com")).toBeNull();
  });

  it("returns null for valid email with subdomains", () => {
    expect(validateEmail("ravi.sharma@iit.ac.in")).toBeNull();
  });

  it("returns null for email with plus addressing", () => {
    expect(validateEmail("user+jee@gmail.com")).toBeNull();
  });

  it("returns error for email with spaces", () => {
    expect(validateEmail("user @example.com")).not.toBeNull();
  });
});

// ── validatePassword ───────────────────────────────────────────────────────

describe("validatePassword", () => {
  it("returns error for empty string", () => {
    expect(validatePassword("")).not.toBeNull();
  });

  it("returns error for password shorter than 8 characters", () => {
    expect(validatePassword("abc123")).not.toBeNull();
  });

  it("returns error for 7-char password (boundary)", () => {
    expect(validatePassword("abcdefg")).not.toBeNull();
  });

  it("returns null for exactly 8 characters (boundary)", () => {
    expect(validatePassword("abcdefgh")).toBeNull();
  });

  it("returns null for a long strong password", () => {
    expect(validatePassword("MyStr0ng!Password#2024")).toBeNull();
  });

  it("returns null for a numeric-only 8+ char password", () => {
    expect(validatePassword("12345678")).toBeNull();
  });
});

// ── validateName ───────────────────────────────────────────────────────────

describe("validateName", () => {
  it("returns error for empty string", () => {
    expect(validateName("")).not.toBeNull();
  });

  it("returns error for whitespace-only string", () => {
    expect(validateName("  ")).not.toBeNull();
  });

  it("returns error for single character name", () => {
    expect(validateName("R")).not.toBeNull();
  });

  it("returns null for exactly 2 characters (boundary)", () => {
    expect(validateName("Ro")).toBeNull();
  });

  it("returns null for a normal Indian name", () => {
    expect(validateName("Arjun")).toBeNull();
  });

  it("returns null for a full name with spaces", () => {
    expect(validateName("Priya Sharma")).toBeNull();
  });
});

// ── sanitizeInput ──────────────────────────────────────────────────────────

describe("sanitizeInput", () => {
  it("trims leading and trailing whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });

  it("truncates to default 500 characters", () => {
    const long = "a".repeat(600);
    expect(sanitizeInput(long)).toHaveLength(500);
  });

  it("truncates to custom maxLength", () => {
    expect(sanitizeInput("hello world", 5)).toBe("hello");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeInput("")).toBe("");
  });

  it("preserves internal whitespace", () => {
    expect(sanitizeInput("hello   world")).toBe("hello   world");
  });

  it("respects custom length of 0", () => {
    expect(sanitizeInput("hello", 0)).toBe("");
  });
});

// ── isValidPhoneNumber ─────────────────────────────────────────────────────

describe("isValidPhoneNumber", () => {
  it("accepts a plain 10-digit Indian number", () => {
    expect(isValidPhoneNumber("9152987821")).toBe(true);
  });

  it("accepts a number with dashes", () => {
    expect(isValidPhoneNumber("1860-2662-345")).toBe(true);
  });

  it("accepts a number with plus country code", () => {
    expect(isValidPhoneNumber("+91 9820466627")).toBe(true);
  });

  it("rejects a string with letters", () => {
    expect(isValidPhoneNumber("call-me")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidPhoneNumber("")).toBe(false);
  });

  it("rejects a too-short number", () => {
    expect(isValidPhoneNumber("12345")).toBe(false);
  });
});
