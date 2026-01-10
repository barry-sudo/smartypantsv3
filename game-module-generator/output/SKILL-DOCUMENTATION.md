# Game Module Generator Skill Documentation

## Problem Solved

When adding new math game modules to Smarty Pants v3, developers faced:
1. **Pattern drift** - Each new module deviated slightly from established patterns
2. **Boilerplate fatigue** - Copy-pasting and modifying 3+ files per module
3. **Integration errors** - Missed imports, type updates, or route configurations
4. **Inconsistent testing** - Variable test coverage across modules

This skill eliminates these issues by automating module generation with guaranteed pattern fidelity.

---

## Skill Architecture

```
game-module-generator/
├── SKILL.md              # Core instructions for Claude
├── templates/            # Parameterized code templates
│   ├── logic-template.ts
│   ├── test-template.ts
│   └── page-template.tsx
├── resources/
│   └── examples/         # Canonical reference files
│       ├── subtraction.ts
│       ├── subtraction.test.ts
│       └── subtraction-page.tsx
└── output/               # Generated files (temporary)
```

### Template System

Templates use `{{variable}}` placeholders:
- `{{operation}}` - lowercase operation name
- `{{OperationPascal}}` - PascalCase version
- `{{operator}}` - math symbol (×, ÷, etc.)
- `{{num1_formula}}` - number generation code
- `{{answer_formula}}` - answer calculation

### Example References

The `resources/examples/` directory contains actual production code from the subtraction module. These serve as the ground truth for:
- File structure
- Import patterns
- Code style
- Component layout

---

## Design Decisions

### 1. Template-Based Generation
**Why:** Ensures exact pattern matching. Templates are direct copies of production code with variable placeholders.
**Alternative considered:** AI-only generation without templates. Rejected due to potential drift.

### 2. Canonical Example Inclusion
**Why:** Gives Claude concrete reference files to study, not just instructions.
**Benefit:** Reduces interpretation variance between generations.

### 3. Separate Output Directory
**Why:** Generated files go to `output/` first, then user moves them.
**Benefit:** Prevents accidental overwrites, allows review before integration.

### 4. Integration Steps as Checklist
**Why:** Post-generation steps require human action (type updates, route creation).
**Scope decision:** Automating these would require modifying existing files, adding complexity.

---

## Usage Pattern

```
1. User describes module: "multiplication game, 1-12, no zeros"
2. Claude extracts parameters from description
3. Claude generates 3 code files + 2 doc files
4. User follows INTEGRATION-STEPS.md to complete setup
5. Tests pass, game works
```

---

## Limitations

- Only generates arithmetic operations (two numbers → one answer)
- Requires manual type and route updates
- Does not generate database migrations
- Assumes existing shared components work

---

## Future Enhancements

If needed, the skill could be extended to:
- Auto-update `GameModule` type union
- Generate route directory automatically
- Support multi-step problems
- Add math selection page button
