# Integration Steps: Multiplication Module

## File Placement

- [ ] Copy `multiplication.ts` to `src/lib/game-logic/multiplication.ts`
- [ ] Copy `multiplication.test.ts` to `src/lib/game-logic/multiplication.test.ts`
- [ ] Create directory `src/app/math/multiplication/`
- [ ] Copy `page.tsx` to `src/app/math/multiplication/page.tsx`

## Type Updates

- [ ] Open `src/types/index.ts`
- [ ] Update `GameModule` type:
  ```typescript
  export type GameModule = 'addition' | 'subtraction' | 'multiplication' | 'spelling';
  ```
- [ ] Update `Problem` interface operation union:
  ```typescript
  operation: 'addition' | 'subtraction' | 'multiplication';
  ```

## Database Updates

- [ ] Update sessions table CHECK constraint (if strict validation):
  ```sql
  ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_module_check;
  ALTER TABLE sessions ADD CONSTRAINT sessions_module_check
    CHECK (module IN ('addition', 'subtraction', 'multiplication', 'spelling'));
  ```

## Math Selection Page

- [ ] Open `src/app/math/page.tsx`
- [ ] Add Multiplication button alongside Addition and Subtraction

## Final Verification

- [ ] Run `npm test` - all tests pass
- [ ] Run `npm run dev` - no compile errors
- [ ] Navigate to `/math/multiplication` - game loads
- [ ] Complete one problem - session tracking works
