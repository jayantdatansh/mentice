/**
 * Pure, framework-agnostic validation helpers.
 * Extracted so they can be unit-tested independently of Next.js / Prisma.
 */

/** Validates an email string. Returns an error message or null if valid. */
export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Invalid email address.";
  return null;
}

/** Validates a password string. Returns an error message or null if valid. */
export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}

/** Validates a display name. Returns an error message or null if valid. */
export function validateName(name: string): string | null {
  if (!name || !name.trim()) return "Name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  return null;
}

/**
 * Sanitizes a free-text string: trims whitespace and enforces a max length.
 * Safe for user-provided notes and chat messages.
 */
export function sanitizeInput(input: string, maxLength = 500): string {
  return input.trim().slice(0, maxLength);
}

/**
 * Returns true if the given string is a non-empty phone number string
 * (digits, spaces, dashes, plus sign — no letters).
 */
export function isValidPhoneNumber(number: string): boolean {
  return /^[\d\s\-+()]{7,15}$/.test(number.trim());
}
