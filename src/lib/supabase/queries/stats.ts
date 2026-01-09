import { supabase } from '../client';
import type { Session, GoalProgress } from '@/types';

/**
 * Get all completed sessions for a user, ordered by most recent
 * @param userId - User ID
 * @returns Array of sessions or null on error
 */
export async function getCompletedSessions(userId: string): Promise<Session[] | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Failed to get sessions:', error);
    return null;
  }

  return data;
}

/**
 * Get recent sessions for a user (limit to specified count)
 * @param userId - User ID
 * @param limit - Maximum number of sessions to return
 * @returns Array of sessions or null on error
 */
export async function getRecentSessions(
  userId: string,
  limit: number = 10
): Promise<Session[] | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to get recent sessions:', error);
    return null;
  }

  return data;
}

/**
 * Get active goal progress for a user
 * Uses the goal_progress view which calculates completion status
 * @param userId - User ID
 * @returns Goal progress data or null if no active goal
 */
export async function getActiveGoalProgress(userId: string): Promise<GoalProgress | null> {
  // First get the active goal with all fields
  const { data: goal, error: goalError } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .single();

  if (goalError || !goal) {
    // No active goal is not an error
    return null;
  }

  // Then get the progress from the view
  const { data: progress, error: progressError } = await supabase
    .from('goal_progress')
    .select('*')
    .eq('goal_id', goal.id)
    .single();

  if (progressError) {
    console.error('Failed to get goal progress:', progressError);
    return null;
  }

  // Combine goal and progress data
  return {
    ...progress,
    description: goal.description,
    prize_image_path: goal.prize_image_path,
    min_accuracy: goal.min_accuracy,
    active: goal.active,
  };
}

/**
 * Get total session count for a user
 * @param userId - User ID
 * @returns Total number of completed sessions
 */
export async function getTotalSessionCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true);

  if (error) {
    console.error('Failed to get session count:', error);
    return 0;
  }

  return count || 0;
}
