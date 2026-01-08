---
paths:
- src/**/*.test.ts
- src/**/*.test.tsx
---

# Testing Guidelines

## Testing Stack

- **Test Runner:** Vitest (Jest-compatible, faster)
- **React Testing:** @testing-library/react
- **Assertions:** @testing-library/jest-dom
- **User Events:** @testing-library/user-event

## File Organization

Tests live next to the code they test:

```
src/lib/game-logic/
├── subtraction.ts
├── subtraction.test.ts          # Unit test
src/components/game/
├── ImageReveal.tsx
├── ImageReveal.test.tsx          # Component test
```

## Unit Tests (Pure Functions)

Test pure functions in `src/lib/game-logic/` and `src/lib/analytics/`:

```typescript
import { describe, it, expect } from 'vitest';
import { generateSubtractionProblem } from './subtraction';

describe('generateSubtractionProblem', () => {
  it('always generates positive answers', () => {
    // Test 1000 iterations for statistical confidence
    for (let i = 0; i < 1000; i++) {
      const problem = generateSubtractionProblem();
      expect(problem.answer).toBeGreaterThanOrEqual(0);
    }
  });
  
  it('answer equals num1 minus num2', () => {
    const problem = generateSubtractionProblem();
    expect(problem.num1 - problem.num2).toBe(problem.answer);
  });
});
```

**Coverage target:** 100% for game logic (it's pure, easy to test)

## Component Tests

Test React components with Testing Library:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Timer } from './Timer';

describe('Timer', () => {
  it('starts at 0:00', () => {
    render(<Timer isActive={false} />);
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });
  
  it('increments when active', async () => {
    render(<Timer isActive={true} />);
    await waitFor(() => {
      expect(screen.getByText('0:01')).toBeInTheDocument();
    });
  });
  
  it('stops when isActive becomes false', async () => {
    const { rerender } = render(<Timer isActive={true} />);
    await waitFor(() => screen.getByText('0:01'));
    
    rerender(<Timer isActive={false} />);
    const time = screen.getByText(/\d:\d\d/).textContent;
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    expect(screen.getByText(time!)).toBeInTheDocument(); // Same time
  });
});
```

**What to test:**
- Initial render
- User interactions (clicks, typing)
- State changes
- Loading states
- Error states

**What NOT to test:**
- Implementation details (internal state)
- Third-party library code
- Styling (use visual regression if needed)

## Testing Hooks

Test custom hooks with `renderHook`:

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  it('starts at 0 seconds', () => {
    const { result } = renderHook(() => useTimer(false));
    expect(result.current.seconds).toBe(0);
  });
  
  it('increments when active', async () => {
    const { result } = renderHook(() => useTimer(true));
    await waitFor(() => {
      expect(result.current.seconds).toBeGreaterThan(0);
    });
  });
});
```

## Mocking Supabase

Mock Supabase client for component tests:

```typescript
import { vi } from 'vitest';
import { supabase } from '@/lib/supabase/client';

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          data: [{ id: '1', module: 'addition' }],
          error: null
        }))
      }))
    }))
  }
}));
```

## Testing Patterns

**Arrange-Act-Assert:**
```typescript
it('displays correct answer feedback', async () => {
  // Arrange
  render(<GamePage />);
  const input = screen.getByLabelText('Answer');
  const submit = screen.getByRole('button', { name: 'Submit' });
  
  // Act
  await userEvent.type(input, '8');
  await userEvent.click(submit);
  
  // Assert
  expect(screen.getByText('ROAR!')).toBeInTheDocument();
});
```

**Testing Loading States:**
```typescript
it('shows loading spinner while fetching', () => {
  render(<SessionStats />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});
```

**Testing Error States:**
```typescript
it('displays error message on failure', async () => {
  // Mock failed query
  vi.mocked(supabase.from).mockImplementationOnce(() => ({
    select: () => Promise.resolve({ data: null, error: { message: 'Failed' } })
  }));
  
  render(<SessionStats />);
  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
```

## Running Tests

```bash
npm test                  # Run all tests once
npm run test:watch        # Run in watch mode
npm run test:coverage     # Generate coverage report
```

## Coverage Targets

- **Game logic:** 100% (pure functions, easy to test)
- **Components:** 80% (focus on critical paths)
- **Hooks:** 80%
- **Overall:** 80% minimum

## Snapshot Tests (Avoid)

Avoid snapshot tests - they're brittle and don't test behavior:

```typescript
// ❌ Bad - snapshot test
it('renders correctly', () => {
  const { container } = render(<Component />);
  expect(container).toMatchSnapshot();
});

// ✅ Good - behavior test
it('displays problem correctly', () => {
  render(<ProblemDisplay num1={5} num2={3} />);
  expect(screen.getByText('5 + 3')).toBeInTheDocument();
});
```

## E2E Tests (Not in MVP)

Skip E2E tests (Playwright/Cypress) for MVP. Add later if needed.

Manual testing is faster for single-user family app.

## Test Organization

```typescript
// Group related tests
describe('GameComponent', () => {
  describe('problem generation', () => {
    it('generates valid problems');
    it('handles edge cases');
  });
  
  describe('user interaction', () => {
    it('accepts correct answers');
    it('rejects incorrect answers');
  });
  
  describe('completion', () => {
    it('shows celebration after 25 correct');
  });
});
```

**Test names should describe behavior, not implementation.**
