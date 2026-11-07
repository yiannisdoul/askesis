/** Returns local calendar date as YYYY-MM-DD for Firestore daily_logs keys. */
export function todayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatStars(value: number): string {
  const rounded = roundStars(value);
  if (Number.isInteger(rounded)) return String(rounded);
  const fixed = rounded.toFixed(3).replace(/\.?0+$/, '');
  return fixed;
}

/**
 * Round to 3 decimal places. Negatives are allowed — no bankruptcy floor.
 * (Supersedes the old clamp-at-0 guardrail.)
 */
export function roundStars(value: number): number {
  return Math.round(value * 1000) / 1000;
}

/** @deprecated Use roundStars — kept for call-sites during migration. */
export function clampStars(value: number): number {
  return roundStars(value);
}

export function formatTimer(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
