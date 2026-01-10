export type GameModule = 'addition' | 'subtraction' | 'multiplication' | 'spelling';

export interface User {
  id: string;
  name: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  module: GameModule;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number;
  correct_count: number;
  total_attempts: number;
  completed: boolean;
  created_at: string;
}

export interface ProblemAttempt {
  id: string;
  session_id: string;
  problem: string;
  expected_answer: string;
  user_answer: string;
  correct: boolean;
  attempt_number: number;
  timestamp: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  prize_image_path: string;
  sessions_required: number;
  min_accuracy: number | null;
  module_filter: GameModule | null;
  active: boolean;
  created_at: string;
  achieved_at: string | null;
}

export interface GoalProgress {
  goal_id: string;
  user_id: string;
  title: string;
  description?: string | null;
  prize_image_path?: string;
  sessions_required: number;
  sessions_completed: number;
  min_accuracy?: number | null;
  avg_accuracy: number;
  goal_achieved: boolean;
  active?: boolean;
}

export interface Problem {
  num1: number;
  num2: number;
  answer: number;
  operation: 'addition' | 'subtraction' | 'multiplication';
}
