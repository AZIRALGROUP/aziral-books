import dayjs from 'dayjs';

export interface ReadingStats {
  currentStreak: number;
  longestStreak: number;
  /** Local calendar date of the last recorded session, `YYYY-MM-DD`. */
  lastReadDate: string;
  totalMinutesRead: number;
}

/**
 * Folds one finished reader session into the running streak/time stats.
 * Pure function — returns a new object, never mutates `prev`.
 *
 * Streak counts calendar days, not elapsed hours: a session the next local
 * day extends the streak even if under 24h have passed, and a session on
 * the same day as the last one only adds minutes without touching the
 * streak.
 */
export function recordReadingSession(
  prev: ReadingStats | undefined,
  sessionStartedAt: number,
  now: number = Date.now(),
): ReadingStats {
  const minutes = Math.max(0, Math.round((now - sessionStartedAt) / 60_000));
  const today = dayjs(now).format('YYYY-MM-DD');

  if (prev?.lastReadDate === today) {
    return { ...prev, totalMinutesRead: prev.totalMinutesRead + minutes };
  }

  const yesterday = dayjs(now).subtract(1, 'day').format('YYYY-MM-DD');
  const currentStreak = prev?.lastReadDate === yesterday ? prev.currentStreak + 1 : 1;

  return {
    currentStreak,
    longestStreak: Math.max(prev?.longestStreak ?? 0, currentStreak),
    lastReadDate: today,
    totalMinutesRead: (prev?.totalMinutesRead ?? 0) + minutes,
  };
}

/**
 * `stats.currentStreak` is only recomputed when a reader session ends, so a
 * streak the user has since let lapse (no session yesterday or today) is
 * still sitting in storage as a stale positive number until they next open
 * a book. Use this for display instead of `stats.currentStreak` directly —
 * it returns 0 once the streak has actually lapsed, without touching
 * storage (the persisted value is only corrected by the next real session).
 */
export function activeStreakCount(
  stats: ReadingStats | undefined,
  now: number = Date.now(),
): number {
  if (!stats) return 0;
  const today = dayjs(now).format('YYYY-MM-DD');
  const yesterday = dayjs(now).subtract(1, 'day').format('YYYY-MM-DD');
  return stats.lastReadDate === today || stats.lastReadDate === yesterday ? stats.currentStreak : 0;
}
