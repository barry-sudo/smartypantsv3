import type { User } from '@/types';

/**
 * Get current authenticated user
 * For MVP: Returns hardcoded test user without auth
 * Note: RLS policies allow NULL auth.uid() for MVP development
 * Future: Implement real auth flow with supabase.auth.signIn()
 */
export async function getCurrentUser(): Promise<User | null> {
  // For MVP: Return hardcoded test user object
  // This works because RLS policies have "OR auth.uid() IS NULL"
  // which allows unauthenticated access during development

  const testUser: User = {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Test Child',
    photo_url: 'https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/prizes/current-goal.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return testUser;
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
