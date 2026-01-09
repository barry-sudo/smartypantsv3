import { supabase } from '../client';
import type { Goal, GameModule } from '@/types';

export interface CreateGoalData {
  title: string;
  description?: string | null;
  prize_image_path: string;
  sessions_required: number;
  min_accuracy?: number | null;
  module_filter?: GameModule | null;
}

/**
 * Create a new goal, deactivating any existing active goals first
 * Only one goal can be active at a time
 */
export async function createGoal(
  userId: string,
  goalData: CreateGoalData
): Promise<Goal | null> {
  // First, deactivate any existing active goals
  await supabase
    .from('goals')
    .update({ active: false })
    .eq('user_id', userId)
    .eq('active', true);

  // Create new goal
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      title: goalData.title,
      description: goalData.description || null,
      prize_image_path: goalData.prize_image_path,
      sessions_required: goalData.sessions_required,
      min_accuracy: goalData.min_accuracy || null,
      module_filter: goalData.module_filter || null,
      active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create goal:', error);
    return null;
  }

  return data;
}

/**
 * Get the currently active goal for a user
 */
export async function getActiveGoal(userId: string): Promise<Goal | null> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .single();

  if (error) {
    // No active goal is not an error
    return null;
  }

  return data;
}

/**
 * Get all goals for a user (active and inactive)
 */
export async function getAllGoals(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to get goals:', error);
    return [];
  }

  return data || [];
}

/**
 * End/deactivate a goal
 */
export async function endGoal(goalId: string): Promise<boolean> {
  const { error } = await supabase
    .from('goals')
    .update({ active: false })
    .eq('id', goalId);

  if (error) {
    console.error('Failed to end goal:', error);
    return false;
  }

  return true;
}

/**
 * Delete a goal permanently
 */
export async function deleteGoal(goalId: string): Promise<boolean> {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);

  if (error) {
    console.error('Failed to delete goal:', error);
    return false;
  }

  return true;
}

/**
 * Mark a goal as achieved
 */
export async function markGoalAchieved(goalId: string): Promise<boolean> {
  const { error } = await supabase
    .from('goals')
    .update({
      active: false,
      achieved_at: new Date().toISOString(),
    })
    .eq('id', goalId);

  if (error) {
    console.error('Failed to mark goal achieved:', error);
    return false;
  }

  return true;
}
