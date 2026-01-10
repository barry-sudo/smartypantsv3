# Mini-PRD: Game Module Generator Skill

**Created:** 2026-01-10  
**Purpose:** Define outcome, path, requirements, and acceptance criteria for the Game Module Generator Claude Skill

---

## 1. Outcome

**What does success look like?**

A developer can describe a new math game module (e.g., "multiplication game with numbers 1-12") and receive a complete, production-ready implementation that:
- Follows the established canonical pattern (subtraction as reference)
- Requires zero manual file creation
- Passes all tests immediately
- Integrates seamlessly with existing codebase
- Maintains 100% consistency with architectural patterns

**Success Statement:**  
*"From module idea to working, tested game in one Claude interaction, with no architectural drift from the established pattern."*

---

## 2. Path to Outcome

**How does the skill achieve this?**

```
User Input (natural language)
    ↓
Skill extracts parameters:
    - Operation type (multiplication, division, etc.)
    - Number range (e.g., 1-12, 1-100)
    - Module display name
    ↓
Skill generates 5 artifacts:
    1. Pure function logic file
    2. Test file with 100% coverage
    3. Game page component
    4. Skill documentation (meta)
    5. Integration steps checklist
    ↓
User receives downloadable files
    ↓
User places files in correct locations per integration steps
    ↓
Tests pass, game works
```

**Key Insight:** The skill doesn't *explain* the pattern—it *executes* the pattern with user's parameters injected.

---

## 3. Requirements for Skill Success

### 3.1 Skill Must Have Access To:

**Reference Files (to learn the pattern):**
- `src/app/math/subtraction/page.tsx` - Canonical game page implementation
- `src/lib/game-logic/subtraction.ts` - Pure function pattern
- `src/lib/game-logic/subtraction.test.ts` - Test structure
- `src/hooks/useGameState.ts` - Session lifecycle hook
- `src/components/game/ImageReveal.tsx` - Shared component pattern

**Context Information:**
- Project structure (from INTENT-TO-EXECUTION.md or CLAUDE.md)
- TypeScript types (`GameModule`, `Problem` interface)
- File naming conventions
- Import path patterns

### 3.2 Skill Must Be Able To:

**Parameter Extraction:**
- Parse natural language input to identify:
  - Operation name (multiplication, division, modulo, etc.)
  - Number ranges or constraints
  - Display name for UI
  - Route slug (kebab-case)

**Code Generation:**
- Generate pure functions with proper random number logic
- Write comprehensive test cases (edge cases, boundary conditions)
- Create React components following established patterns
- Use correct Tailwind classes matching existing UI
- Maintain TypeScript type safety

**Pattern Adherence:**
- Copy architectural decisions (pure functions, hook-based state)
- Follow file structure conventions
- Use existing shared components (`ImageReveal`, `Timer`, `Counter`)
- Match code style (formatting, comments, error handling)

### 3.3 Skill Must Provide:

**Deliverables (5 total):**

**Code Files (3):**
1. **Logic file** - `{operation}.ts` with `generate{Operation}Problem()`
2. **Test file** - `{operation}.test.ts` with comprehensive coverage
3. **Page component** - `src/app/math/{operation}/page.tsx`

**Documentation Files (2):**
4. **SKILL-DOCUMENTATION.md** - Meta-documentation about the Game Module Generator skill
   - Problem the skill was developed to solve
   - Architecture of the skill itself
   - Design decisions made when building the skill
   - Lean format for future Claude instances

5. **INTEGRATION-STEPS.md** - Post-generation integration checklist
   - File placement instructions
   - Required config updates (types, routes, etc.)
   - Actionable checklist format only

---

## 4. Acceptance Criteria

### Criterion 1: Complete File Generation
**Given:** User requests "multiplication game with numbers 1-12"  
**When:** Skill executes  
**Then:** 
- ✅ `multiplication.ts` file generated with correct logic
- ✅ `multiplication.test.ts` file generated with 5+ test cases
- ✅ `page.tsx` file generated following subtraction pattern
- ✅ All imports are correct and match project structure
- ✅ `SKILL-DOCUMENTATION.md` generated
- ✅ `INTEGRATION-STEPS.md` generated

---

### Criterion 2: Logic Correctness
**Given:** Generated `generateMultiplicationProblem()` function  
**When:** Function is called 100 times  
**Then:**
- ✅ All numbers are within specified range (1-12)
- ✅ No zero values appear
- ✅ Answers are mathematically correct
- ✅ Commutative problems treated separately (3×4 and 4×3 are distinct)
- ✅ Returns proper `Problem` interface shape

---

### Criterion 3: Test Coverage
**Given:** Generated test file  
**When:** Tests are run with `npm test`  
**Then:**
- ✅ All tests pass without modification
- ✅ Coverage reaches 100% of logic file
- ✅ Tests cover edge cases (min/max values, boundary conditions, no zeros)
- ✅ Tests follow existing test structure (describe/it blocks, assertions)

---

### Criterion 4: UI Component Integration
**Given:** Generated page component  
**When:** Component is rendered in browser  
**Then:**
- ✅ Layout matches subtraction game visually
- ✅ Uses `useGameState` hook correctly
- ✅ ImageReveal component works
- ✅ Timer component displays
- ✅ Counter component updates on correct answers
- ✅ No TypeScript errors
- ✅ No console warnings

---

### Criterion 5: Pattern Consistency
**Given:** Generated code compared to canonical subtraction files  
**When:** Manual code review is performed  
**Then:**
- ✅ File structure matches exactly (same sections, same order)
- ✅ Import paths follow same pattern
- ✅ Variable naming conventions match
- ✅ Comments style matches
- ✅ No architectural deviations without justification

---

### Criterion 6: Zero Manual Debugging Required
**Given:** Files placed in correct locations per INTEGRATION-STEPS.md  
**When:** `npm run dev` is executed  
**Then:**
- ✅ Application compiles with no errors
- ✅ New route is accessible at `/math/{operation}`
- ✅ Game is immediately playable
- ✅ Session tracking works
- ✅ Database writes occur correctly

---

### Criterion 7: Documentation Quality
**Given:** Generated SKILL-DOCUMENTATION.md and INTEGRATION-STEPS.md  
**When:** Reviewed by another developer or Claude instance  
**Then:**
- ✅ SKILL-DOCUMENTATION.md clearly explains skill's purpose and architecture
- ✅ INTEGRATION-STEPS.md provides clear, actionable checklist
- ✅ No ambiguity in instructions
- ✅ Lean format (no unnecessary verbosity)

---

### Criterion 8: Extensibility
**Given:** Skill is used to generate 3 different modules  
**When:** Each module request has different parameters  
**Then:**
- ✅ Each output is correctly customized
- ✅ No hardcoded values from previous generations
- ✅ Consistent quality across all generations
- ✅ No need to tweak the skill between uses

---

## 5. Multiplication Module Specifications

**For the initial test case (multiplication):**
- **Operation:** Multiplication (×)
- **Number Range:** 1-12 (standard times tables)
- **Constraints:** 
  - Avoid zero (no 0 in problems)
  - Treat commutative separately (3×4 and 4×3 are different problems)
- **Display Name:** "Multiplication"
- **Route:** `/math/multiplication`

---

## 6. Out of Scope (for MVP)

**Not included in initial skill:**
- ❌ Automatic route registration in Next.js config
- ❌ Automatic `GameModule` type updates in `src/types/index.ts`
- ❌ Multi-step problem generation (e.g., word problems)
- ❌ Custom UI layouts different from canonical pattern
- ❌ Integration testing or E2E test generation
- ❌ Database migration generation for new module types
- ❌ Automated verification commands in integration steps

**Rationale:** Start with core file generation. Manual integration steps are acceptable for MVP.

---

## 7. Success Metrics

**Quantitative:**
- Time from idea to working module: < 5 minutes
- Developer edits required post-generation: 0-2 lines
- Test pass rate on first try: 100%
- TypeScript compilation errors: 0

**Qualitative:**
- Developer confidence in generated code quality
- Willingness to use skill for all future modules
- Reduction in "pattern drift" across modules

---

## 8. Build Phases

### Phase 1: Build the Skill Structure
Create the `game-module-generator/` directory with:
- `SKILL.md` (core instruction file)
- `templates/` (code templates with variable placeholders)
- `resources/examples/` (canonical subtraction pattern files)

### Phase 2: Use the Skill
Execute the skill to generate the multiplication module:
- 3 code files (logic, tests, page component)
- 2 documentation files (skill docs, integration steps)

---

## 9. Related Documentation

- **INTENT-TO-EXECUTION.md** - Shows canonical patterns and architectural decisions
- **CLAUDE.md** - Developer onboarding and project conventions
- **Subtraction files** - Canonical reference implementation

---

*Document created 2026-01-10. Defines requirements for Game Module Generator Claude Skill.*
