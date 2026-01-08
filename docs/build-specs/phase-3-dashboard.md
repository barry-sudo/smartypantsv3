# Build Spec: Phase 3 - Progress Dashboard

**Phase:** 3  
**Feature:** Analytics dashboard with session stats and goal progress  
**Complexity:** Medium  
**Estimated Time:** ~4 hours  
**Status:** ⏳ Not Started

---

## Objective

Build progress analytics dashboard showing session history, accuracy trends, module breakdown, and active goal progress. Accessible after game completion and via navigation.

---

## Prerequisites

- [x] Phases 2A, 2B, 2C complete (game sessions generating data)
- [x] Sessions and attempts logged to database
- [x] Goals table exists (even if no goals created yet)

---

## What to Build

### Files to Create

1. `src/app/progress/page.tsx` - Main dashboard page
2. `src/components/dashboard/SessionStats.tsx` - Session statistics cards
3. `src/components/dashboard/GoalProgress.tsx` - Active goal display
4. `src/components/dashboard/ModuleBreakdown.tsx` - Stats by module
5. `src/components/dashboard/RecentSessions.tsx` - Session history list
6. `src/hooks/useStats.ts` - Analytics queries
7. `src/lib/supabase/queries/stats.ts` - Analytics query functions
8. `src/lib/analytics/calculations.ts` - Stat calculations (pure functions)

---

## Dashboard Layout

**Design:** Formal, data-focused (different from playful game UI)

**Typography:** System sans-serif (Inter, -apple-system)  
**Colors:** Same palette (jungle green, orange) but more subdued  
**Layout:** Card-based grid, clean and professional

```
┌─────────────────────────────────────────────┐
│  Progress Dashboard          [Back to Home] │
├─────────────────────────────────────────────┤
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  🎯 Active Goal: New Lego Set       │    │
│  │  Progress: █████████░░ 18/20        │    │
│  │  Accuracy: 94%  [Prize photo]       │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ │
│  │ Total     │ │ This Week │ │ Avg       │ │
│  │ Sessions  │ │ Sessions  │ │ Accuracy  │ │
│  │   42      │ │     7     │ │   89%     │ │
│  └───────────┘ └───────────┘ └───────────┘ │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  By Module                          │    │
│  │  ┌─Addition────────── 15 sessions   │    │
│  │  ┌─Subtraction────── 14 sessions    │    │
│  │  ┌─Spelling───────── 13 sessions    │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  Recent Sessions                    │    │
│  │  • Subtraction - 92% - 3:45 - Today │    │
│  │  • Addition - 96% - 3:12 - Today    │    │
│  │  • Spelling - 88% - 4:20 - Yesterday│    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## Analytics Queries

**Location:** `src/lib/supabase/queries/stats.ts`

```typescript
import { supabase } from '../client';

export async function getSessionStats(userId: string) {
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: false });
    
  if (error) {
    console.error('Failed to get sessions:', error);
    return null;
  }
  
  return sessions;
}

export async function getModuleBreakdown(userId: string) {
  const { data, error } = await supabase
    .from('sessions')
    .select('module, correct_count, total_attempts')
    .eq('user_id', userId)
    .eq('completed', true);
    
  if (error) return null;
  
  // Group by module
  const breakdown = data.reduce((acc, session) => {
    if (!acc[session.module]) {
      acc[session.module] = { count: 0, totalCorrect: 0, totalAttempts: 0 };
    }
    acc[session.module].count++;
    acc[session.module].totalCorrect += session.correct_count;
    acc[session.module].totalAttempts += session.total_attempts;
    return acc;
  }, {} as Record<string, any>);
  
  return breakdown;
}

export async function getActiveGoalProgress(userId: string) {
  const { data, error } = await supabase
    .from('goal_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .single();
    
  if (error) return null;
  return data;
}
```

---

## Statistics Calculations

**Location:** `src/lib/analytics/calculations.ts`

```typescript
import type { Session } from '@/types';

export function calculateAverageAccuracy(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  
  const totalAccuracy = sessions.reduce((sum, session) => {
    return sum + (session.correct_count / session.total_attempts * 100);
  }, 0);
  
  return Math.round(totalAccuracy / sessions.length);
}

export function getSessionsThisWeek(sessions: Session[]): number {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return sessions.filter(session => {
    return new Date(session.completed_at!) > oneWeekAgo;
  }).length;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

**Test these pure functions 100%**

---

## Component: GoalProgress

**Location:** `src/components/dashboard/GoalProgress.tsx`

```typescript
interface GoalProgressProps {
  goalProgress: GoalProgress | null;
}

export function GoalProgress({ goalProgress }: GoalProgressProps) {
  if (!goalProgress || !goalProgress.active) {
    return (
      <div className="bg-white rounded-2xl p-6 border-4 border-gray-200">
        <p className="text-gray-500">No active goal set</p>
      </div>
    );
  }
  
  const percentage = (goalProgress.sessions_completed / goalProgress.sessions_required) * 100;
  
  return (
    <div className="bg-gradient-to-r from-orange/10 to-orange/20 rounded-2xl p-6 border-4 border-orange">
      <div className="flex items-center gap-6">
        <img 
          src={goalProgress.prize_image_path} 
          alt="Goal prize"
          className="w-32 h-32 object-cover rounded-xl border-4 border-white"
        />
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-jungle mb-2">
            🎯 {goalProgress.title}
          </h3>
          {goalProgress.description && (
            <p className="text-gray-700 mb-4">{goalProgress.description}</p>
          )}
          <div className="mb-2">
            <div className="h-6 bg-white rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange transition-all duration-500"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span>{goalProgress.sessions_completed} / {goalProgress.sessions_required} sessions</span>
            {goalProgress.min_accuracy && (
              <span>Accuracy: {goalProgress.avg_accuracy.toFixed(1)}% / {goalProgress.min_accuracy}%</span>
            )}
          </div>
          {goalProgress.goal_achieved && (
            <div className="mt-4 text-2xl font-bold text-orange animate-bounce">
              🎉 GOAL ACHIEVED! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Success Criteria

### Functional
- [ ] Dashboard displays all session statistics
- [ ] Module breakdown shows counts and accuracy
- [ ] Recent sessions list shows latest 10
- [ ] Active goal progress displays correctly
- [ ] Goal achievement celebrated visually
- [ ] Navigation works (back to home)

### Technical
- [ ] Analytics calculations 100% tested
- [ ] Queries handle empty data gracefully
- [ ] Loading states during data fetch
- [ ] Responsive on desktop and tablet

### Design
- [ ] Professional, data-focused design
- [ ] Different typography from game UI
- [ ] Clean card-based layout
- [ ] Color palette consistent but more subdued

---

## Estimated Complexity

**Medium** - ~4 hours

**Breakdown:**
- Analytics queries: 1 hour
- Calculation functions + tests: 1 hour
- Dashboard components: 1.5 hours
- Layout and styling: 30 min

---

## Reference Materials

- Database schema: `docs/api/database-schema.md`
- Goal progress view: See schema for SQL
- Component patterns: `.claude/rules/react-components.md`

---

## Notes

**Navigation:** After game completion (celebration), automatically navigate to dashboard:
```typescript
router.push('/progress');
```

**Empty states:** Handle when no sessions exist yet, when no goal is set, etc.

**Future enhancements:** Charts (line graph of accuracy over time), streaks, badges display.
