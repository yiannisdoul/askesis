/** Returns local calendar date as YYYY-MM-DD for Firestore daily_logs keys. */
export function todayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatStars(value: number): string {
  return value.toFixed(1);
}

export function clampStars(value: number): number {
  return Math.max(0, Math.round(value * 10) / 10);
}

export function formatTimer(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
