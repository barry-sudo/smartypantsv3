import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGameState } from './useGameState';
import * as sessionsModule from '@/lib/supabase/queries/sessions';
import * as attemptsModule from '@/lib/supabase/queries/attempts';

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {}
}));

// Mock the query modules
vi.mock('@/lib/supabase/queries/sessions');
vi.mock('@/lib/supabase/queries/attempts');

describe('useGameState', () => {
  const mockSession = {
    id: 'session-123',
    user_id: 'user-123',
    module: 'subtraction' as const,
    started_at: '2025-01-01T00:00:00Z',
    completed_at: null,
    duration_seconds: 0,
    correct_count: 0,
    total_attempts: 0,
    completed: false,
    created_at: '2025-01-01T00:00:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(sessionsModule, 'createSession').mockResolvedValue(mockSession);
    vi.spyOn(sessionsModule, 'updateSession').mockResolvedValue(mockSession);
    vi.spyOn(attemptsModule, 'logAttempt').mockResolvedValue();
  });

  it('creates session on mount', async () => {
    const { result } = renderHook(() =>
      useGameState({ module: 'subtraction', userId: 'user-123' })
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(sessionsModule.createSession).toHaveBeenCalledWith('user-123', 'subtraction');
    expect(result.current.session).toEqual(mockSession);
  });

  it('submitAnswer logs correct answer', async () => {
    const { result } = renderHook(() =>
      useGameState({ module: 'subtraction', userId: 'user-123' })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.submitAnswer('5 - 2', '3', '3', 1);

    await waitFor(() => {
      expect(result.current.correctCount).toBe(1);
    });

    expect(attemptsModule.logAttempt).toHaveBeenCalled();
    expect(result.current.totalAttempts).toBe(1);
  });

  it('submitAnswer logs incorrect answer', async () => {
    const { result } = renderHook(() =>
      useGameState({ module: 'subtraction', userId: 'user-123' })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.submitAnswer('5 - 2', '3', '5', 1);

    await waitFor(() => {
      expect(result.current.totalAttempts).toBe(1);
    });

    expect(result.current.correctCount).toBe(0);
  });

  it('completes session with final stats', async () => {
    const { result } = renderHook(() =>
      useGameState({ module: 'subtraction', userId: 'user-123' })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.completeSession(120);

    expect(sessionsModule.updateSession).toHaveBeenCalledWith(
      'session-123',
      expect.objectContaining({
        completed: true,
        duration_seconds: 120
      })
    );
  });
});
