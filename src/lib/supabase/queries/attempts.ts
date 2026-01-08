import { supabase } from '../client';

interface AttemptData {
  problem: string;
  expected_answer: string;
  user_answer: string;
  correct: boolean;
  attempt_number: number;
}

export async function logAttempt(
  sessionId: string,
  attempt: AttemptData
): Promise<void> {
  const { error } = await supabase
    .from('problem_attempts')
    .insert({
      session_id: sessionId,
      ...attempt
    });

  if (error) {
    console.error('Failed to log attempt:', error);
  }
}
