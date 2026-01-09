# Build Spec: Phase 2A - Subtraction Game

**Phase:** 2A
**Feature:** Subtraction game module
**Complexity:** Medium
**Estimated Time:** ~4 hours
**Status:** ✅ Complete (Deployed 2026-01-08)

> **Note:** This spec was written during the architecture phase. The actual implementation includes post-launch enhancements: vertical arithmetic layout, always-visible stopwatch timer, auto-focus input, and "← Back to Home" navigation. See `DEPLOYMENT-LOG.md` for details.

---

## Objective

Build complete subtraction game module with 5x5 grid image reveal, problem generation, answer validation, audio feedback, celebration video, and database session tracking. This becomes the canonical pattern for all game modules.

---

## Prerequisites

**Must be complete before starting:**
- [x] Phase 1: Foundation (Next.js + Supabase + auth)
- [x] Database tables exist (sessions, problem_attempts)
- [x] Asset manifest available (`src/lib/assets.ts`)
- [x] Test user exists in database

---

## What to Build

### Files to Create

**Game logic:**
1. `src/lib/game-logic/subtraction.ts` - Problem generator (pure function)
2. `src/lib/game-logic/subtraction.test.ts` - 100% test coverage

**Shared game components:**
3. `src/components/game/ImageReveal.tsx` - 5x5 grid reveal component
4. `src/components/game/ImageReveal.test.tsx` - Component tests
5. `src/components/game/Timer.tsx` - Optional session timer
6. `src/components/game/Timer.test.tsx` - Timer tests
7. `src/components/game/Counter.tsx` - "X out of 25" display
8. `src/components/game/CelebrationVideo.tsx` - Full-screen celebration

**Game page:**
9. `src/app/math/subtraction/page.tsx` - Main game page component

**Custom hooks:**
10. `src/hooks/useGameState.ts` - Game session state management
11. `src/hooks/useTimer.ts` - Timer hook
12. `src/hooks/useGameState.test.ts` - Hook tests

**Database queries:**
13. `src/lib/supabase/queries/sessions.ts` - Session CRUD
14. `src/lib/supabase/queries/attempts.ts` - Problem attempt logging

**Navigation:**
15. `src/app/math/page.tsx` - Math module selection page

---

## Component Specifications

### 1. Problem Generator (Pure Function)

**Location:** `src/lib/game-logic/subtraction.ts`

**Purpose:** Generate random subtraction problems with positive results

```typescript
import type { Problem } from '@/types';

/**
 * Generates a random subtraction problem for 2nd grade level.
 * Guarantees positive results (answer >= 0) and numbers < 20.
 * 
 * @returns Problem with num1, num2, and answer where num1 - num2 = answer
 * 
 * @example
 * const problem = generateSubtractionProblem();
 * // { num1: 15, num2: 7, answer: 8, operation: 'subtraction' }
 */
export function generateSubtractionProblem(): Problem {
  // Generate answer first (0-19)
  const answer = Math.floor(Math.random() * 20);
  
  // Generate amount to subtract (ensure result stays < 20)
  const addAmount = Math.floor(Math.random() * (19 - answer)) + 1;
  
  const num1 = answer + addAmount;
  const num2 = addAmount;
  
  return {
    num1,
    num2,
    answer,
    operation: 'subtraction'
  };
}
```

**Testing requirements:**
```typescript
// src/lib/game-logic/subtraction.test.ts
describe('generateSubtractionProblem', () => {
  it('always generates positive answers', () => {
    for (let i = 0; i < 1000; i++) {
      const problem = generateSubtractionProblem();
      expect(problem.answer).toBeGreaterThanOrEqual(0);
    }
  });
  
  it('uses numbers less than 20', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateSubtractionProblem();
      expect(problem.num1).toBeLessThan(20);
      expect(problem.num2).toBeLessThan(20);
    }
  });
  
  it('answer equals num1 minus num2', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateSubtractionProblem();
      expect(problem.num1 - problem.num2).toBe(problem.answer);
    }
  });
  
  it('returns operation as subtraction', () => {
    const problem = generateSubtractionProblem();
    expect(problem.operation).toBe('subtraction');
  });
});
```

**Coverage target:** 100%

---

### 2. ImageReveal Component

**Location:** `src/components/game/ImageReveal.tsx`

**Purpose:** Display image behind 5x5 black grid, reveal cells on correct answers

**Props:**
```typescript
interface ImageRevealProps {
  imageUrl: string;
  revealedCount: number; // 0-25
}
```

**Behavior:**
- Displays image with 25 black cells overlaid (5x5 grid)
- Reveals cells randomly as `revealedCount` increases
- Cells fade out smoothly (CSS transition)
- Responsive to container size

**Pattern:**
```typescript
'use client';

import { useState, useEffect } from 'react';

interface ImageRevealProps {
  imageUrl: string;
  revealedCount: number;
}

export function ImageReveal({ imageUrl, revealedCount }: ImageRevealProps) {
  const [revealedCells, setRevealedCells] = useState<Set<number>>(new Set());
  
  useEffect(() => {
    if (revealedCount > revealedCells.size) {
      // Reveal random unrevealed cell
      const unrevealedCells = Array.from({ length: 25 }, (_, i) => i)
        .filter(i => !revealedCells.has(i));
      
      if (unrevealedCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * unrevealedCells.length);
        const cellToReveal = unrevealedCells[randomIndex];
        setRevealedCells(prev => new Set([...prev, cellToReveal]));
      }
    }
  }, [revealedCount, revealedCells]);
  
  return (
    <div className="relative w-full h-full">
      <img 
        src={imageUrl} 
        alt="Mystery" 
        className="w-full h-full object-contain rounded-2xl"
      />
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none">
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            className={`
              bg-black border border-orange/30 transition-opacity duration-700
              ${revealedCells.has(i) ? 'opacity-0' : 'opacity-100'}
            `}
          />
        ))}
      </div>
    </div>
  );
}
```

---

### 3. Timer Component

**Location:** `src/components/game/Timer.tsx`

**Props:**
```typescript
interface TimerProps {
  isActive: boolean;
  onTick?: (seconds: number) => void;
}
```

**Behavior:**
- Displays time in MM:SS format
- Increments every second when `isActive` is true
- Stops when `isActive` becomes false
- Calls `onTick` callback with current seconds

---

### 4. Game State Hook

**Location:** `src/hooks/useGameState.ts`

**Purpose:** Manage game session state and database integration

```typescript
'use client';

import { useState, useEffect } from 'react';
import { createSession, updateSession } from '@/lib/supabase/queries/sessions';
import { logAttempt } from '@/lib/supabase/queries/attempts';
import type { Session, GameModule } from '@/types';

interface UseGameStateOptions {
  module: GameModule;
  userId: string;
}

export function useGameState({ module, userId }: UseGameStateOptions) {
  const [session, setSession] = useState<Session | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create session on mount
  useEffect(() => {
    createSession(userId, module).then(newSession => {
      setSession(newSession);
      setIsLoading(false);
    });
  }, [userId, module]);
  
  // Submit answer attempt
  const submitAnswer = async (
    problem: string,
    expectedAnswer: string,
    userAnswer: string,
    attemptNumber: number
  ) => {
    if (!session) return false;
    
    const correct = userAnswer === expectedAnswer;
    
    // Log attempt to database
    await logAttempt(session.id, {
      problem,
      expected_answer: expectedAnswer,
      user_answer: userAnswer,
      correct,
      attempt_number: attemptNumber
    });
    
    // Update local state
    setTotalAttempts(prev => prev + 1);
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }
    
    // Update session in database every 5 correct answers
    if (correct && (correctCount + 1) % 5 === 0) {
      await updateSession(session.id, {
        correct_count: correctCount + 1,
        total_attempts: totalAttempts + 1
      });
    }
    
    return correct;
  };
  
  // Complete session
  const completeSession = async (durationSeconds: number) => {
    if (!session) return;
    
    await updateSession(session.id, {
      completed: true,
      completed_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
      correct_count: correctCount,
      total_attempts: totalAttempts
    });
  };
  
  return {
    session,
    correctCount,
    totalAttempts,
    isLoading,
    submitAnswer,
    completeSession
  };
}
```

---

### 5. Main Game Page

**Location:** `src/app/math/subtraction/page.tsx`

**Purpose:** Orchestrate all components into complete game experience

**Flow:**
1. Load session via `useGameState`
2. Generate first problem
3. Display problem + input + grid reveal
4. On submit:
   - Validate answer
   - Log attempt to DB
   - Show feedback (ROAR! / Try Again)
   - If correct: reveal cell, generate next problem
   - If 25 correct: show celebration
5. After celebration: navigate to progress dashboard (Phase 3)

**Structure:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useGameState } from '@/hooks/useGameState';
import { useTimer } from '@/hooks/useTimer';
import { generateSubtractionProblem } from '@/lib/game-logic/subtraction';
import { ImageReveal } from '@/components/game/ImageReveal';
import { Timer } from '@/components/game/Timer';
import { Counter } from '@/components/game/Counter';
import { CelebrationVideo } from '@/components/game/CelebrationVideo';
import { ASSETS } from '@/lib/assets';
import type { Problem } from '@/types';

export default function SubtractionGame() {
  const router = useRouter();
  const { user } = useAuth();
  const { session, correctCount, submitAnswer, completeSession } = useGameState({
    module: 'subtraction',
    userId: user?.id || ''
  });
  
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const { seconds, start: startTimer } = useTimer(timerEnabled);
  
  // Select random image and video
  const [selectedImage] = useState(() => 
    ASSETS.images[Math.floor(Math.random() * ASSETS.images.length)]
  );
  const [selectedVideo] = useState(() => 
    ASSETS.videos[Math.floor(Math.random() * ASSETS.videos.length)]
  );
  
  // Generate first problem
  useEffect(() => {
    setCurrentProblem(generateSubtractionProblem());
  }, []);
  
  // Handle answer submission
  const handleSubmit = async () => {
    if (!currentProblem || !session) return;
    
    const correct = await submitAnswer(
      `${currentProblem.num1} - ${currentProblem.num2}`,
      currentProblem.answer.toString(),
      userAnswer,
      attemptNumber
    );
    
    if (correct) {
      // Play tiger roar
      const audio = new Audio(ASSETS.tigerRoar);
      audio.play().catch(() => console.log('Audio blocked'));
      
      setFeedback('ROAR!');
      
      // Check if session complete
      if (correctCount + 1 >= 25) {
        await completeSession(seconds);
        setTimeout(() => setShowCelebration(true), 2000);
      } else {
        // Generate next problem after 3 seconds
        setTimeout(() => {
          setCurrentProblem(generateSubtractionProblem());
          setUserAnswer('');
          setFeedback('');
          setAttemptNumber(1);
        }, 3000);
      }
    } else {
      setFeedback('Try Again!');
      setUserAnswer('');
      setAttemptNumber(prev => prev + 1);
    }
  };
  
  if (showCelebration) {
    return (
      <CelebrationVideo
        videoUrl={selectedVideo}
        onContinue={() => router.push('/progress')}
      />
    );
  }
  
  if (!currentProblem) return <div>Loading...</div>;
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light">
      {/* Timer toggle and display */}
      <div className="absolute top-5 right-5">
        <label className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-lg">
          <input 
            type="checkbox" 
            checked={timerEnabled}
            onChange={(e) => {
              setTimerEnabled(e.target.checked);
              if (e.target.checked) startTimer();
            }}
          />
          <span>Timer</span>
        </label>
        {timerEnabled && <Timer isActive={true} onTick={() => {}} />}
      </div>
      
      {/* Counter */}
      <Counter current={correctCount} total={25} />
      
      {/* Two-panel layout */}
      <div className="flex gap-5 p-5 max-w-7xl mx-auto">
        {/* Left panel: Problem and input */}
        <div className="flex-1 bg-white/95 rounded-[30px] p-16 border-[6px] border-orange">
          <div className="text-6xl font-bold text-jungle text-center mb-10">
            {currentProblem.num1} - {currentProblem.num2}
          </div>
          
          <div className="flex flex-col items-center gap-8">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="text-4xl w-48 text-center p-5 border-4 border-jungle rounded-xl"
              autoFocus
            />
            
            <button
              onClick={handleSubmit}
              className="text-3xl px-16 py-5 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold"
            >
              SUBMIT
            </button>
            
            <div className={`text-4xl font-bold min-h-20 flex items-center ${
              feedback === 'ROAR!' ? 'text-orange' : 'text-red-600'
            }`}>
              {feedback}
            </div>
          </div>
        </div>
        
        {/* Right panel: Image reveal */}
        <div className="flex-1 bg-white/95 rounded-[30px] p-10 border-[6px] border-orange">
          <ImageReveal imageUrl={selectedImage} revealedCount={correctCount} />
        </div>
      </div>
    </main>
  );
}
```

---

## Database Query Functions

**Location:** `src/lib/supabase/queries/sessions.ts`

```typescript
import { supabase } from '../client';
import type { Session, GameModule } from '@/types';

export async function createSession(
  userId: string,
  module: GameModule
): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      module,
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
```

**Location:** `src/lib/supabase/queries/attempts.ts`

```typescript
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
```

---

## Success Criteria

### Functional
- [x] Can start subtraction game
- [x] Problems generate correctly (positive answers, numbers < 20)
- [x] Correct answers show "ROAR!" and play tiger roar audio
- [x] Incorrect answers show "Try Again!" and clear input
- [x] Grid reveals one cell per correct answer
- [x] Counter updates: "X out of 25"
- [x] After 25 correct: celebration video plays
- [x] Session logged to database with all attempts
- [x] Timer displays always (stopwatch format, no toggle)

### Technical
- [x] All TypeScript, no `any` types
- [x] Problem generator has 100% test coverage
- [x] Component tests cover main interactions
- [x] Database queries handle errors gracefully
- [x] No console.log in production code
- [x] Follows patterns in `.claude/rules/`

### Quality
- [x] Responsive on desktop and tablet
- [x] Audio handles autoplay restrictions
- [x] Loading states during data fetching
- [x] Smooth animations (cell reveals, feedback)

### Post-Launch Enhancements (2026-01-09)
- [x] Vertical arithmetic layout (worksheet style)
- [x] Auto-focus on answer input
- [x] "← Back to Home" navigation link

---

## Testing Requirements

**Unit tests:** See problem generator tests above

**Component tests:**
```typescript
describe('ImageReveal', () => {
  it('starts with all cells covered', () => {
    render(<ImageReveal imageUrl="test.jpg" revealedCount={0} />);
    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(25);
    cells.forEach(cell => expect(cell).toHaveClass('opacity-100'));
  });
  
  it('reveals cells as count increases', () => {
    const { rerender } = render(<ImageReveal imageUrl="test.jpg" revealedCount={0} />);
    rerender(<ImageReveal imageUrl="test.jpg" revealedCount={5} />);
    const revealedCells = screen.getAllByRole('cell')
      .filter(cell => cell.classList.contains('opacity-0'));
    expect(revealedCells).toHaveLength(5);
  });
});
```

---

## Estimated Complexity

**Medium** - ~4 hours

**Breakdown:**
- Problem generator + tests: 30 min
- ImageReveal component + tests: 1 hour
- Timer component: 30 min
- Game state hook: 1 hour
- Main game page: 1 hour
- Database queries: 30 min
- Testing and debugging: 30 min

---

## Reference Materials

- Old HTML: `docs/migration/html-reference.md`
- Architecture: `docs/architecture/overview.md`
- Rules: `.claude/rules/game-logic.md`, `.claude/rules/react-components.md`

---

## Notes

**This is the canonical game module.** Phases 2B (Addition) and 2C (Spelling) will follow this exact pattern with only the problem generator logic changed.

**Key patterns established:**
- Two-panel layout (problem + grid)
- useGameState hook pattern
- Database logging approach
- Celebration flow

**These patterns must be consistent across all game modules.**
