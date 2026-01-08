# CLAUDE.md Template Guide

This guide explains how to adapt `.claude/CLAUDE.md` for your project.

---

## Purpose of CLAUDE.md

CLAUDE.md is the **routing layer** - it tells Claude Code where to find information without containing the information itself. Think of it as an index or table of contents, not an encyclopedia.

**Key principle:** Keep it under 100 lines. If it's longer, you're including details that belong in `docs/` files.

---

## Required Sections

CLAUDE.md must have these sections in this order:

### 1. Project Identity (2-4 sentences)

**Template:**
```markdown
# [Project Name]

[Project Name] is a [type of application] built with [primary framework/language] 
for [primary purpose]. The frontend uses [frontend tech] and the backend uses 
[backend tech]. [Any critical context like database, real-time features, unique 
architectural elements].

**Migration:** [If rebuilding existing app, note what version and key changes]
```

**Smarty Pants Example:**
```markdown
# Smarty Pants v3

Educational web application for 2nd-grade learning (math and spelling modules). 
Built with Next.js 14 (App Router, React, TypeScript, Tailwind CSS) and Supabase 
(PostgreSQL database, Storage, Authentication). Features gamified learning sessions 
with progress tracking, analytics dashboard, and parent-managed reward goals.

**Migration:** v3 rebuilds v2 (static HTML/JavaScript/localStorage) into production 
architecture with proper database persistence, component architecture, and 
maintainable patterns.
```

### 2. Essential Commands (10-15 commands max)

**Template:**
```markdown
## Essential Commands

**Development:**
- `[dev-command]` - Start development server

**Testing:**
- `[test-command]` - Run tests

**Build:**
- `[build-command]` - Create production build
```

**What to include:**
- Commands used daily (dev server, tests, build)
- Critical setup commands (database migrations, seeding)
- NOT: Rarely-used commands (put those in detailed docs)

### 3. Project Structure (Conceptual map, not exhaustive)

**Template:**
```markdown
## Project Structure

```
project-root/
├── [config-directories]/        # Brief description
├── src/
│   ├── [feature-dir]/            # What lives here
│   ├── [components-dir]/         # Component organization
│   └── [lib-dir]/                # Shared utilities
├── [tests-dir]/                  # Test organization
└── [other-critical-dirs]/        # Brief description
```
```

**Focus on:**
- Where to find different types of files
- Where to create new files
- NOT: Every single file and folder

### 4. Documentation Index (Task-oriented)

**Template:**
```markdown
## Documentation Index

**When working on [feature/area]:**
- [Task]: `docs/path/to/file.md`
- See rules: `.claude/rules/domain.md`

**When debugging [issue type]:**
- [Resource]: `docs/debugging/type.md`

**For complete context:**
- All decisions: `docs/decisions/`
- All specs: `docs/build-specs/`
```

**Key principle:** Map TASKS to documents, not documents to tasks.

**Good:** "When adding API endpoints: Read `docs/api/patterns.md`"  
**Bad:** "API documentation: `docs/api/patterns.md`"

### 5. Critical Conventions (Universal rules)

**Template:**
```markdown
## Critical Conventions

**[Language/Framework]:**
- [Rule that applies everywhere]
- [Another universal rule]

**File Naming:**
- [Pattern for type 1]
- [Pattern for type 2]

**[Other universal concerns]:**
- [Consistent patterns]
```

**Include only:** Rules that apply across entire codebase  
**Exclude:** Domain-specific rules (those go in `.claude/rules/`)

### 6. Important File Patterns (Canonical examples)

**Template:**
```markdown
## Important File Patterns

**Canonical [thing]:**
- Example: `path/to/canonical/example.ts`
- Demonstrates: [What this shows]

**Canonical [other thing]:**
- TBD - will document when created
```

**Purpose:** Point to real code examples that show patterns  
**Note:** Use "TBD" for patterns not yet established

### 7. Migration Notes (if rebuilding existing app)

**Template:**
```markdown
## Migration Notes

This is v[X], a [complete rebuild / major update] of v[Y]. Key changes:

**Architecture:**
- [Old approach] → [New approach]
- [What changed and why]

**Fixed Issues from v[Y]:**
- [Problem] → [Solution]

**Preserved from v[Y]:**
- [What worked well]

**Reference:**
- Old code: `docs/migration/old-version.md`
```

**Optional section** - only include if this is a rebuild/migration

### 8. Quick Status (Optional but useful)

**Template:**
```markdown
## Build Phase Status

Legend: ✅ Complete | 🚧 In Progress | ⏳ Planned | ❌ Not Started

**[Category]:**
- ⏳ Phase 1: [Name]
- ⏳ Phase 2: [Name]

**Detailed specs:** See `docs/build-specs/`
```

---

## Adaptation Examples

### Example 1: E-commerce Site

**Replace:**
- "Educational web app" → "E-commerce platform"
- "game modules" → "product catalog, cart, checkout"
- "sessions" database table → "orders" database table

**Keep:**
- Same section structure
- Same documentation organization
- Same routing approach

### Example 2: SaaS Dashboard

**Replace:**
- "2nd-grade learning" → "Business analytics dashboard"
- "Supabase" → Your database choice
- "game-logic/" → "analytics/" or "reports/"

**Keep:**
- Essential Commands format
- Documentation Index approach
- Critical Conventions pattern

---

## Common Mistakes

### ❌ Too Much Detail
```markdown
## Database Schema

users table has these fields: id (UUID), email (VARCHAR 255), password_hash...
[30 more lines of schema details]
```

**Problem:** This belongs in `docs/api/database-schema.md`, not CLAUDE.md

**Fix:**
```markdown
## Documentation Index

**When working with database:**
- Schema reference: `docs/api/database-schema.md`
```

### ❌ Missing Task Context
```markdown
## Documentation

- Architecture: `docs/architecture/`
- API: `docs/api/`
- Components: `docs/components/`
```

**Problem:** Doesn't tell you WHEN to read which doc

**Fix:**
```markdown
## Documentation Index

**When adding new API endpoints:**
- Read `docs/api/patterns.md` for standard workflow
```

### ❌ Too Many Commands
```markdown
## Commands

[50 different npm scripts listed]
```

**Problem:** Only 5-10 commands are used regularly

**Fix:** Include only daily-use commands, reference `package.json` for others

---

## Validation Checklist

Your CLAUDE.md is ready when:

- [ ] Under 100 lines total
- [ ] All sections present in order
- [ ] Documentation Index maps tasks → files
- [ ] No detailed explanations (those are in docs/)
- [ ] File paths are accurate
- [ ] Someone could find what they need in 30 seconds
- [ ] No information duplication between sections

---

## Testing Your CLAUDE.md

Ask yourself these questions:

1. "I need to add a new feature - where do I look?"  
   → Documentation Index should answer this

2. "I need to run tests - what's the command?"  
   → Essential Commands should answer this

3. "Where do components live?"  
   → Project Structure should answer this

4. "What are the TypeScript rules?"  
   → Critical Conventions should answer this

5. "Show me a good example of [pattern]?"  
   → Important File Patterns should answer this

If any question takes more than 10 seconds to answer, improve that section.

---

## Next Steps

1. Copy CLAUDE.md from Smarty Pants v3
2. Replace project identity (Section 1)
3. Update commands for your scripts (Section 2)
4. Map your directory structure (Section 3)
5. Create documentation index for your features (Section 4)
6. Document your conventions (Section 5)
7. Identify your canonical patterns (Section 6)
8. Add migration notes if rebuilding (Section 7)
9. Test with validation checklist

**Remember:** This is a routing document, not a reference document.
