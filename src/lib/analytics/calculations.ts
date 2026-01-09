import type { Session, GameModule } from '@/types';

/**
 * Calculate average accuracy across sessions
 * @param sessions - Array of completed sessions
 * @returns Average accuracy as a percentage (0-100), or 0 if no sessions
 */
export function calculateAverageAccuracy(sessions: Session[]): number {
  if (sessions.length === 0) return 0;

  const totalAccuracy = sessions.reduce((sum, session) => {
    if (session.total_attempts === 0) return sum;
    return sum + (session.correct_count / session.total_attempts) * 100;
  }, 0);

  return Math.round(totalAccuracy / sessions.length);
}

/**
 * Count sessions completed within the last 7 days
 * @param sessions - Array of sessions
 * @returns Number of sessions completed this week
 */
export function getSessionsThisWeek(sessions: Session[]): number {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return sessions.filter(session => {
    if (!session.completed_at) return false;
    return new Date(session.completed_at) > oneWeekAgo;
  }).length;
}

/**
 * Format duration in seconds to mm:ss format
 * @param seconds - Duration in seconds
 * @returns Formatted string like "3:45"
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format a date as relative time (Today, Yesterday, or date)
 * @param dateString - ISO date string
 * @returns Formatted relative date
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time components for comparison
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  if (dateDay.getTime() === todayDay.getTime()) {
    return 'Today';
  } else if (dateDay.getTime() === yesterdayDay.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

/**
 * Module breakdown statistics
 */
export interface ModuleStats {
  module: GameModule;
  sessionCount: number;
  totalCorrect: number;
  totalAttempts: number;
  accuracy: number;
}

/**
 * Calculate statistics broken down by module
 * @param sessions - Array of sessions
 * @returns Array of module statistics
 */
export function calculateModuleBreakdown(sessions: Session[]): ModuleStats[] {
  const moduleMap = new Map<GameModule, { count: number; correct: number; attempts: number }>();

  sessions.forEach(session => {
    const existing = moduleMap.get(session.module) || { count: 0, correct: 0, attempts: 0 };
    moduleMap.set(session.module, {
      count: existing.count + 1,
      correct: existing.correct + session.correct_count,
      attempts: existing.attempts + session.total_attempts,
    });
  });

  const result: ModuleStats[] = [];
  moduleMap.forEach((stats, module) => {
    result.push({
      module,
      sessionCount: stats.count,
      totalCorrect: stats.correct,
      totalAttempts: stats.attempts,
      accuracy: stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0,
    });
  });

  // Sort by session count descending
  return result.sort((a, b) => b.sessionCount - a.sessionCount);
}

/**
 * Calculate session accuracy percentage
 * @param session - A single session
 * @returns Accuracy as percentage (0-100)
 */
export function calculateSessionAccuracy(session: Session): number {
  if (session.total_attempts === 0) return 0;
  return Math.round((session.correct_count / session.total_attempts) * 100);
}
