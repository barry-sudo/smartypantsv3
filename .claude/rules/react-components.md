---
paths:
- src/components/**/*.tsx
- src/components/**/*.ts
- src/app/**/*.tsx
---

# React Component Guidelines

## Component Structure

Organize as feature folders with co-located files:
```
ComponentName/
├── ComponentName.tsx          # Implementation
├── ComponentName.test.tsx     # Tests
└── index.ts                   # Re-export: export { ComponentName } from './ComponentName'
```

**Canonical example:** First game component created in Phase 2A

## File Organization

- **Game components:** `src/components/game/` (ImageReveal, Timer, Counter)
- **Dashboard components:** `src/components/dashboard/` (StatsCard, PerformanceChart)
- **Admin components:** `src/components/admin/` (GoalForm, GoalList)
- **Pages:** `src/app/` (Next.js 14 App Router structure)

## Props and Types

```typescript
// Define interface, not inline types
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

// Named export, explicit return type
export function Button({ onClick, children, variant = 'primary' }: ButtonProps): JSX.Element {
  // Implementation
}
```

## State Management

- **Component-local state:** `useState` for UI state (open/closed, selected item)
- **Session state:** `useGameState` hook (in `src/hooks/useGameState.ts`)
- **Timer state:** `useTimer` hook (in `src/hooks/useTimer.ts`)
- **Analytics state:** `useStats` hook (in `src/hooks/useStats.ts`)

**Never:**
- Prop-drill more than 2 levels (create context or hook instead)
- Store server data in component state (use hooks that query database)

## Data Fetching

Database queries go through custom hooks in `src/hooks/`:

```typescript
// In component:
const { stats, isLoading, error } = useStats('addition');

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorDisplay error={error} />;
return <StatsDisplay stats={stats} />;
```

**Never fetch directly in components** - always use hooks that wrap Supabase queries.

## Styling

Use Tailwind CSS utility classes. Design system values:

**Colors:**
- Jungle green: `bg-[#2d5016]`, `bg-[#4a7c2c]`, `bg-[#356b1f]`
- Orange accent: `bg-[#ff8c3c]`, `bg-[#ff6b1a]`
- Borders: `border-[#ff8c3c]` (6px: `border-[6px]`)

**Typography:**
- Game UI: Comic Sans MS (system font)
- Dashboard: Sans-serif (Inter or system)

**For complex styling:**
```typescript
const styles = {
  container: 'flex flex-col items-center justify-center p-8 bg-[#2d5016]',
  panel: 'bg-white/95 rounded-[30px] p-10 border-[6px] border-[#ff8c3c]'
};
```

## Error Handling

Always handle loading and error states:

```typescript
export function GameComponent() {
  const { session, isLoading, error } = useGameState('addition');
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage>Failed to load game</ErrorMessage>;
  
  return <div>{/* Game UI */}</div>;
}
```

## Audio and Media

Reference assets from `src/lib/assets.ts`:

```typescript
import { ASSETS } from '@/lib/assets';

<audio src={ASSETS.tigerRoar} />
<img src={ASSETS.images[0]} />
<video src={ASSETS.videos[0]} />
```

**Never hardcode URLs** - always use asset manifest.

## Testing

Every component needs tests. See `.claude/rules/testing.md` for patterns.

Minimum test coverage:
- Renders without crashing
- User interactions work (button clicks, form submissions)
- Loading states display
- Error states display

**Canonical test:** Will be established with first component test in Phase 2A
