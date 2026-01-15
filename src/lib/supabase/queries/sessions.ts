import { supabase } from '../client';
import type { Session, GameModule } from '@/types';

export async function createSession(
  userId: string,
  module: GameModule,
  mode: 'study' | 'test' = 'study'
): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      module,
      mode,
      started_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create session:', error);
    return null;
  }

  return data;
}

export async function updateSession(
  sessionId: string,
  updates: Partial<Session>
): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Failed to update session:', error);
    return null;
  }

  return data;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select()
    .eq('id', sessionId)
    .single();

  if (error) {
    console.error('Failed to get session:', error);
    return null;
  }

  return data;
}
