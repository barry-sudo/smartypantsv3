---
paths:
- src/components/**/*.tsx
- src/components/**/*.ts
- src/app/**/*.tsx
---

# React Component Guidelines

## Organization

Group by feature: `/game`, `/dashboard`, `/admin`, `/providers`

## Critical Patterns

**✅ DO:**
- Define explicit `Props` interfaces (not inline types)
- Use named exports only (no `export default`)
- Keep components presentational (data fetching in hooks)
- Use Tailwind classes (no inline styles)
- Reference assets via `@/lib/assets.ts` (never hardcode URLs)

**❌ DON'T:**
- Put business logic in components (use `@/lib/game-logic/`)
- Fetch data directly (use hooks from `@/hooks/`)
- Prop-drill more than 2 levels (create context instead)
- Store server data in component state

## State Management

- **UI state:** `useState` in component
- **Game/Timer/Analytics:** Use hooks from `@/hooks/` (`useGameState`, `useTimer`, `useStats`)

## Styling

Tailwind with custom theme: `bg-jungle`, `bg-orange`, `border-orange`

## Examples

**See:** `src/components/game/ImageReveal.tsx` (canonical component)
