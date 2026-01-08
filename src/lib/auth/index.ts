import { supabase } from '../supabase/client';
import type { User } from '@/types';

/**
 * Get current authenticated user
 * For MVP: Queries the first user from database (single-user app)
 * Note: RLS is disabled for MVP, allowing unauthenticated queries
 * Future: Implement real auth flow with supabase.auth.signIn()
 */
export async function getCurrentUser(): Promise<User | null> {
  // For MVP: Query the first user from database
  // This ensures we use whatever user actually exists in production
  // Avoids hardcoded ID mismatches between code and database

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('Failed to get user from database:', error);
    return null;
  }

  return data;
}

/**
 * Sign in (MVP: no-op, always returns test user)
 * Future: Implement with supabase.auth.signInWithPassword()
 */
export async function signIn(): Promise<User | null> {
  return getCurrentUser();
}

/**
 * Sign out (MVP: no-op)
 * Future: Implement with supabase.auth.signOut()
 */
export async function signOut(): Promise<void> {
  // No-op for MVP
  // Future: Add proper sign out logic
}
