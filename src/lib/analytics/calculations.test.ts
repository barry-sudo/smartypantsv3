import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateAverageAccuracy,
  getSessionsThisWeek,
  formatDuration,
  formatRelativeDate,
  calculateModuleBreakdown,
  calculateSessionAccuracy,
} from './calculations';
import type { Session } from '@/types';

// Helper to create test sessions
function createSession(overrides: Partial<Session> = {}): Session {
  return {
    id: 'test-id',
    user_id: 'user-1',
    module: 'addition',
    mode: 'study',
    started_at: '2025-01-01T10:00:00Z',
    completed_at: '2025-01-01T10:05:00Z',
    duration_seconds: 300,
    correct_count: 20,
    total_attempts: 25,
    completed: true,
    created_at: '2025-01-01T10:00:00Z',
    ...overrides,
  };
}

describe('calculateAverageAccuracy', () => {
  it('returns 0 for empty array', () => {
    expect(calculateAverageAccuracy([])).toBe(0);
  });

  it('calculates accuracy for single session', () => {
    const sessions = [createSession({ correct_count: 20, total_attempts: 25 })];
    expect(calculateAverageAccuracy(sessions)).toBe(80);
  });

  it('calculates average accuracy across multiple sessions', () => {
    const sessions = [
      createSession({ correct_count: 25, total_attempts: 25 }), // 100%
      createSession({ correct_count: 20, total_attempts: 25 }), // 80%
    ];
    expect(calculateAverageAccuracy(sessions)).toBe(90);
  });

  it('handles sessions with 0 attempts', () => {
    const sessions = [
      createSession({ correct_count: 0, total_attempts: 0 }),
      createSession({ correct_count: 25, total_attempts: 25 }),
    ];
    expect(calculateAverageAccuracy(sessions)).toBe(50);
  });

  it('rounds to nearest integer', () => {
    const sessions = [
      createSession({ correct_count: 23, total_attempts: 25 }), // 92%
      createSession({ correct_count: 22, total_attempts: 25 }), // 88%
    ];
    expect(calculateAverageAccuracy(sessions)).toBe(90);
  });
});

describe('getSessionsThisWeek', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 for empty array', () => {
    expect(getSessionsThisWeek([])).toBe(0);
  });

  it('counts sessions from today', () => {
    const sessions = [createSession({ completed_at: '2025-01-15T10:00:00Z' })];
    expect(getSessionsThisWeek(sessions)).toBe(1);
  });

  it('counts sessions from within last 7 days', () => {
    const sessions = [
      createSession({ completed_at: '2025-01-15T10:00:00Z' }), // Today
      createSession({ completed_at: '2025-01-14T10:00:00Z' }), // Yesterday
      createSession({ completed_at: '2025-01-09T10:00:00Z' }), // 6 days ago
    ];
    expect(getSessionsThisWeek(sessions)).toBe(3);
  });

  it('excludes sessions older than 7 days', () => {
    const sessions = [
      createSession({ completed_at: '2025-01-15T10:00:00Z' }), // Today - included
      createSession({ completed_at: '2025-01-07T10:00:00Z' }), // 8 days ago - excluded
      createSession({ completed_at: '2025-01-01T10:00:00Z' }), // 14 days ago - excluded
    ];
    expect(getSessionsThisWeek(sessions)).toBe(1);
  });

  it('excludes sessions with null completed_at', () => {
    const sessions = [
      createSession({ completed_at: '2025-01-15T10:00:00Z' }),
      createSession({ completed_at: null }),
    ];
    expect(getSessionsThisWeek(sessions)).toBe(1);
  });
});

describe('formatDuration', () => {
  it('formats 0 seconds', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('formats seconds only', () => {
    expect(formatDuration(45)).toBe('0:45');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(185)).toBe('3:05');
  });

  it('pads single digit seconds', () => {
    expect(formatDuration(65)).toBe('1:05');
  });

  it('handles large durations', () => {
    expect(formatDuration(3661)).toBe('61:01');
  });
});

describe('formatRelativeDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Today" for today', () => {
    expect(formatRelativeDate('2025-01-15T10:00:00Z')).toBe('Today');
  });

  it('returns "Yesterday" for yesterday', () => {
    expect(formatRelativeDate('2025-01-14T10:00:00Z')).toBe('Yesterday');
  });

  it('returns formatted date for older dates', () => {
    expect(formatRelativeDate('2025-01-10T10:00:00Z')).toBe('Jan 10');
  });
});

describe('calculateModuleBreakdown', () => {
  it('returns empty array for no sessions', () => {
    expect(calculateModuleBreakdown([])).toEqual([]);
  });

  it('groups sessions by module', () => {
    const sessions = [
      createSession({ module: 'addition', correct_count: 25, total_attempts: 25 }),
      createSession({ module: 'addition', correct_count: 20, total_attempts: 25 }),
      createSession({ module: 'subtraction', correct_count: 22, total_attempts: 25 }),
    ];

    const breakdown = calculateModuleBreakdown(sessions);

    expect(breakdown).toHaveLength(2);

    const addition = breakdown.find(b => b.module === 'addition');
    expect(addition?.sessionCount).toBe(2);
    expect(addition?.totalCorrect).toBe(45);
    expect(addition?.totalAttempts).toBe(50);
    expect(addition?.accuracy).toBe(90);

    const subtraction = breakdown.find(b => b.module === 'subtraction');
    expect(subtraction?.sessionCount).toBe(1);
    expect(subtraction?.totalCorrect).toBe(22);
    expect(subtraction?.totalAttempts).toBe(25);
    expect(subtraction?.accuracy).toBe(88);
  });

  it('sorts by session count descending', () => {
    const sessions = [
      createSession({ module: 'spelling' }),
      createSession({ module: 'addition' }),
      createSession({ module: 'addition' }),
      createSession({ module: 'addition' }),
      createSession({ module: 'subtraction' }),
      createSession({ module: 'subtraction' }),
    ];

    const breakdown = calculateModuleBreakdown(sessions);

    expect(breakdown[0].module).toBe('addition');
    expect(breakdown[1].module).toBe('subtraction');
    expect(breakdown[2].module).toBe('spelling');
  });

  it('handles sessions with 0 attempts', () => {
    const sessions = [
      createSession({ module: 'addition', correct_count: 0, total_attempts: 0 }),
    ];

    const breakdown = calculateModuleBreakdown(sessions);
    expect(breakdown[0].accuracy).toBe(0);
  });
});

describe('calculateSessionAccuracy', () => {
  it('returns 0 for session with 0 attempts', () => {
    const session = createSession({ correct_count: 0, total_attempts: 0 });
    expect(calculateSessionAccuracy(session)).toBe(0);
  });

  it('calculates percentage correctly', () => {
    const session = createSession({ correct_count: 20, total_attempts: 25 });
    expect(calculateSessionAccuracy(session)).toBe(80);
  });

  it('returns 100 for perfect session', () => {
    const session = createSession({ correct_count: 25, total_attempts: 25 });
    expect(calculateSessionAccuracy(session)).toBe(100);
  });

  it('rounds to nearest integer', () => {
    const session = createSession({ correct_count: 23, total_attempts: 25 });
    expect(calculateSessionAccuracy(session)).toBe(92);
  });
});
