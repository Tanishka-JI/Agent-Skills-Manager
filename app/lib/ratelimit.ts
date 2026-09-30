// Simple in-memory rate limiter
// Tracks attempts per IP address

interface AttemptRecord {
  count: number;
  firstAttempt: number;
}

const attempts = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
} {
  const now = Date.now();
  const record = attempts.get(identifier);

  // No record yet, or window expired — reset
  if (!record || now - record.firstAttempt > WINDOW_MS) {
    attempts.set(identifier, { count: 1, firstAttempt: now });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // Within window — check count
  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, remainingAttempts: 0 };
  }

  record.count += 1;
  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - record.count };
}