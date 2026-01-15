'use client';

import { useState, useEffect } from 'react';
import { getCompletedSessions, getRecentSessions, getActiveGoalProgress } from '@/lib/supabase/queries/stats';
import {
  calculateAverageAccuracy,
  getSessionsThisWeek,
  calculateModuleBreakdown,
  calculateModuleBreakdownByMode,
  type ModuleStats,
} from '@/lib/analytics/calculations';
import type { Session, GoalProgress } from '@/types';

export interface StatsData {
  totalSessions: number;
  sessionsThisWeek: number;
  averageAccuracy: number;
  moduleBreakdown: ModuleStats[];
  studyModuleBreakdown: ModuleStats[];
  testModuleBreakdown: ModuleStats[];
  recentSessions: Session[];
  goalProgress: GoalProgress | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and calculate all dashboard statistics
 * @param userId - User ID to fetch stats for
 * @returns Statistics data and loading state
 */
export function useStats(userId: string): StatsData {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [goalProgress, setGoalProgress] = useState<GoalProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    async function fetchStats(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [allSessions, recent, goal] = await Promise.all([
          getCompletedSessions(userId),
          getRecentSessions(userId, 10),
          getActiveGoalProgress(userId),
        ]);

        if (allSessions) {
          setSessions(allSessions);
        } else {
          setSessions([]);
        }

        if (recent) {
          setRecentSessions(recent);
        } else {
          setRecentSessions([]);
        }

        setGoalProgress(goal);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  // Calculate derived statistics
  const totalSessions = sessions.length;
  const sessionsThisWeek = getSessionsThisWeek(sessions);
  const averageAccuracy = calculateAverageAccuracy(sessions);
  const moduleBreakdown = calculateModuleBreakdown(sessions);

  // Calculate mode-specific breakdowns
  const studyModuleBreakdown = calculateModuleBreakdownByMode(sessions, 'study');
  const testModuleBreakdown = calculateModuleBreakdownByMode(sessions, 'test');

  return {
    totalSessions,
    sessionsThisWeek,
    averageAccuracy,
    moduleBreakdown,
    studyModuleBreakdown,
    testModuleBreakdown,
    recentSessions,
    goalProgress,
    isLoading,
    error,
  };
}
