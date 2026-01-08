# Build Spec Template

Copy this template for each build phase. Replace [bracketed placeholders] with specifics.

---

# Build Spec: Phase [N] - [Feature Name]

**Phase:** [N]  
**Feature:** [Feature Name]  
**Complexity:** [Simple/Medium/Complex]  
**Estimated Time:** [~N hours]  
**Status:** ⏳ Not Started

---

## Objective

[One clear sentence describing what this phase builds]

---

## Prerequisites

**Must be complete before starting:**
- [ ] [Previous phase or dependency]
- [ ] [Required infrastructure]
- [ ] [Needed components or patterns established]

---

## What to Build

### Files to Create

List all files with paths and brief descriptions:

1. `src/path/to/file.tsx` - [Description of what this file does]
2. `src/path/to/test.test.tsx` - [Description of test coverage]
3. `src/path/to/component.tsx` - [Component description]

### Component/Module Specifications

For each major component or module:

**[ComponentName]**

- **Location:** `src/path/to/Component.tsx`
- **Purpose:** [What this component does]
- **Type:** [Page component / Reusable component / Hook / Utility]

**Props/Interface:**
```typescript
interface ComponentNameProps {
  // Define expected interface
  prop1: string;
  prop2: number;
  onEvent?: () => void;
}
```

**State Requirements:**
- [What state this component manages]
- [What external state it consumes]

**Behavior:**
- [Expected behavior 1]
- [Expected behavior 2]
- [Edge cases to handle]

**Pattern to Follow:**
- Reference: `[path/to/similar/component.tsx]` (if exists)
- See rules: `.claude/rules/[relevant-rule].md`
- See docs: `docs/[relevant-doc].md`

**Example (if needed):**
```typescript
// Show code example of usage or pattern
```

---

## Database/API Work

*Skip this section if no database work*

### Tables Used
- `table_name` - [How it's used in this phase]

### Queries Needed
```typescript
// Example query pattern
export async function queryName(params): Promise<Type> {
  const { data, error } = await supabase
    .from('table')
    .select('*')
    .eq('field', value);
    
  if (error) {
    console.error('Query failed:', error);
    return null;
  }
  
  return data;
}
```

### Location
- Queries in: `src/lib/supabase/queries/[module].ts`

---

## Success Criteria

### Functional Requirements
- [ ] [Specific testable behavior 1]
- [ ] [Specific testable behavior 2]
- [ ] [User can accomplish X]
- [ ] [System responds correctly to Y]
- [ ] [Edge case Z is handled]

### Technical Requirements
- [ ] All code is TypeScript with explicit types (no `any`)
- [ ] All new functions have tests
- [ ] All tests passing (`npm test`)
- [ ] No console.log statements in code
- [ ] No ESLint errors (`npm run lint`)
- [ ] Follows patterns in `.claude/rules/[domain].md`
- [ ] Code formatted consistently

### Quality Requirements
- [ ] Component renders without errors
- [ ] Loading states display during async operations
- [ ] Error states display when operations fail
- [ ] Responsive on desktop and tablet
- [ ] Accessible (basic keyboard navigation works)

---

## Testing Requirements

### Unit Tests

For pure functions and utilities:

```typescript
// src/path/to/function.test.ts
describe('[functionName]', () => {
  it('[test case 1]', () => {
    // Arrange
    const input = ...;
    
    // Act
    const result = functionName(input);
    
    // Assert
    expect(result).toBe(expected);
  });
  
  it('[edge case]', () => {
    // Test edge case
  });
});
```

**Coverage target:** 100% for pure functions

### Component Tests

For React components:

```typescript
// src/path/to/Component.test.tsx
describe('[ComponentName]', () => {
  it('renders without crashing', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });
  
  it('handles user interaction', async () => {
    render(<ComponentName />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect([expected behavior]).toBeTruthy();
  });
});
```

**Coverage target:** 80% for components

### Integration Tests (if applicable)

For database queries or API integration:

```typescript
// Test against test database
describe('[query function]', () => {
  it('retrieves correct data', async () => {
    const result = await queryFunction(testId);
    expect(result).toMatchObject({ ... });
  });
});
```

---

## Estimated Complexity

**[Simple/Medium/Complex]** - ~[N-M] hours

**Breakdown:**
- [Task 1]: [time estimate]
- [Task 2]: [time estimate]
- Testing: [time estimate]
- Documentation updates: [time estimate]

**Factors:**
- [What makes this simple/complex]
- [Dependencies or unknowns]

---

## Dependencies

**Technical dependencies:**
- [Package or library needed]
- [Environment variable needed]
- [External service needed]

**Phase dependencies:**
- Must complete [Phase X] first
- Requires [component Y] to exist
- Needs [pattern Z] to be established

---

## Known Issues / Challenges

[Document any expected challenges from v2 or architecture decisions]

**From v2 (HTML version):**
- [Issue that existed in old version]
- [Solution in new architecture]

**Architectural challenges:**
- [Any known complexity]
- [Suggested approach]

---

## Reference Materials

**Documentation:**
- Architecture: `docs/architecture/[relevant].md`
- Patterns: `docs/quick-reference/[relevant].md`
- Rules: `.claude/rules/[relevant].md`

**Code examples:**
- Canonical example: `src/[path/to/example].tsx`
- Similar pattern: `src/[path/to/similar].tsx`

**External resources:**
- [Link to Next.js docs if relevant]
- [Link to Supabase docs if relevant]
- [Link to library docs if using specific library]

---

## Completion Checklist

When this phase is complete, verify:

- [ ] All files created and in correct locations
- [ ] All success criteria met
- [ ] All tests written and passing
- [ ] Code reviewed against rules files
- [ ] No console.log or commented-out code
- [ ] README or docs updated if needed
- [ ] Deployed to preview URL (if applicable)
- [ ] Manual testing complete
- [ ] Ready for next phase

---

## Completion Report Format

When submitting completion, provide:

**Status:** ✅ Complete

**Evidence:**
- [ ] Tests passing (screenshot or output)
- [ ] Preview URL deployed: [url]
- [ ] All success criteria verified

**Implementation notes:**
- [Any deviations from spec and why]
- [Any patterns established]
- [Any issues encountered and solved]

**Discovered issues:**
- [Any spec ambiguities found]
- [Any suggestions for improvement]

**Next steps:**
- Ready for Phase [N+1]
- [Any blockers for next phase]

---

## Notes

[Any additional context, warnings, or important information for the builder]
