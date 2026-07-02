import { describe, it, expect } from 'vitest';
import {
  activeStreakCount,
  recordReadingSession,
  type ReadingStats,
} from '../../utils/readingStats';

// Local-time anchor (streak is based on the reader's own calendar day, not
// UTC), so every timestamp below is built with `new Date(...)` rather than
// `Date.UTC(...)` to stay consistent with the implementation's local-time
// formatting regardless of the test runner's timezone.
const NOON = new Date(2026, 6, 2, 12, 0, 0).getTime();

describe('recordReadingSession', () => {
  it('starts a 1-day streak on the very first recorded session', () => {
    const stats = recordReadingSession(undefined, NOON - 5 * 60_000, NOON);
    expect(stats).toEqual<ReadingStats>({
      currentStreak: 1,
      longestStreak: 1,
      lastReadDate: '2026-07-02',
      totalMinutesRead: 5,
    });
  });

  it('does not change the streak for a second session on the same day, but adds minutes', () => {
    const prev: ReadingStats = {
      currentStreak: 3,
      longestStreak: 5,
      lastReadDate: '2026-07-02',
      totalMinutesRead: 20,
    };
    const later = NOON + 3 * 60 * 60 * 1000;
    const stats = recordReadingSession(prev, later - 10 * 60_000, later);
    expect(stats).toEqual<ReadingStats>({
      currentStreak: 3,
      longestStreak: 5,
      lastReadDate: '2026-07-02',
      totalMinutesRead: 30,
    });
  });

  it('increments the streak when the previous read was exactly yesterday', () => {
    const prev: ReadingStats = {
      currentStreak: 3,
      longestStreak: 3,
      lastReadDate: '2026-07-01',
      totalMinutesRead: 20,
    };
    const stats = recordReadingSession(prev, NOON - 10 * 60_000, NOON);
    expect(stats).toEqual<ReadingStats>({
      currentStreak: 4,
      longestStreak: 4,
      lastReadDate: '2026-07-02',
      totalMinutesRead: 30,
    });
  });

  it('resets the streak to 1 when a day was missed', () => {
    const prev: ReadingStats = {
      currentStreak: 6,
      longestStreak: 6,
      lastReadDate: '2026-06-28',
      totalMinutesRead: 100,
    };
    const stats = recordReadingSession(prev, NOON - 2 * 60_000, NOON);
    expect(stats).toEqual<ReadingStats>({
      currentStreak: 1,
      longestStreak: 6,
      lastReadDate: '2026-07-02',
      totalMinutesRead: 102,
    });
  });

  it('keeps the longest streak even after it resets', () => {
    const prev: ReadingStats = {
      currentStreak: 1,
      longestStreak: 10,
      lastReadDate: '2026-06-01',
      totalMinutesRead: 500,
    };
    const stats = recordReadingSession(prev, NOON, NOON);
    expect(stats.longestStreak).toBe(10);
    expect(stats.currentStreak).toBe(1);
  });

  it('rounds session duration to the nearest minute', () => {
    const stats = recordReadingSession(undefined, NOON - 90_000, NOON);
    expect(stats.totalMinutesRead).toBe(2);
  });

  it('handles a session that starts and ends within the same minute as 0 minutes', () => {
    const stats = recordReadingSession(undefined, NOON - 10_000, NOON);
    expect(stats.totalMinutesRead).toBe(0);
    expect(stats.currentStreak).toBe(1);
  });

  it('is a pure function: it does not mutate the previous stats object', () => {
    const prev: ReadingStats = {
      currentStreak: 1,
      longestStreak: 1,
      lastReadDate: '2026-07-01',
      totalMinutesRead: 5,
    };
    const frozen = Object.freeze({ ...prev });
    expect(() => recordReadingSession(frozen, NOON - 60_000, NOON)).not.toThrow();
  });

  it('treats the next calendar day as consecutive even if under 24h has elapsed', () => {
    const prev: ReadingStats = {
      currentStreak: 1,
      longestStreak: 1,
      lastReadDate: '2026-07-01',
      totalMinutesRead: 5,
    };
    // 2026-07-02T00:30 local — still "yesterday + 1 day" by calendar date
    // even though it's under 24h since a NOON session the prior day.
    const earlyNextDay = new Date(2026, 6, 2, 0, 30, 0).getTime();
    const stats = recordReadingSession(prev, earlyNextDay - 60_000, earlyNextDay);
    expect(stats.currentStreak).toBe(2);
    expect(stats.lastReadDate).toBe('2026-07-02');
  });
});

describe('activeStreakCount', () => {
  it('returns 0 for undefined stats', () => {
    expect(activeStreakCount(undefined, NOON)).toBe(0);
  });

  it('returns the streak when the last read was today', () => {
    const stats: ReadingStats = {
      currentStreak: 4,
      longestStreak: 4,
      lastReadDate: '2026-07-02',
      totalMinutesRead: 30,
    };
    expect(activeStreakCount(stats, NOON)).toBe(4);
  });

  it('returns the streak when the last read was yesterday (not yet lapsed today)', () => {
    const stats: ReadingStats = {
      currentStreak: 4,
      longestStreak: 4,
      lastReadDate: '2026-07-01',
      totalMinutesRead: 30,
    };
    expect(activeStreakCount(stats, NOON)).toBe(4);
  });

  it('returns 0 once the streak has lapsed (no session in the last 2+ days)', () => {
    const stats: ReadingStats = {
      currentStreak: 4,
      longestStreak: 6,
      lastReadDate: '2026-06-28',
      totalMinutesRead: 30,
    };
    expect(activeStreakCount(stats, NOON)).toBe(0);
  });
});
