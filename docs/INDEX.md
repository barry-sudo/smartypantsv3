# Smarty Pants v3 Documentation Index

Complete reference for all project documentation. For quick routing, see `.claude/CLAUDE.md`.

---

## Meta-Documentation

- [Architecture Protocol](_ARCHITECTURE-PROTOCOL.md) - How to reuse this system for any project
- [Template Guide](_TEMPLATE-GUIDE.md) - How to adapt these docs for your project

---

## Architecture Documentation

- [Overview](architecture/overview.md) - System design, tech stack, key decisions
- [Database Design](architecture/database-design.md) - Complete schema with rationale
- [Authentication](architecture/authentication.md) - Auth flow and user management
- [Game Flow](architecture/game-flow.md) - How game sessions work end-to-end
- [State Management](architecture/state-management.md) - Where state lives and how it flows

---

## Build Specifications

Complete, testable specifications for each build phase:

- [Phase 0: Setup](build-specs/phase-0-setup.md) - Supabase project + asset upload
- [Phase 1: Foundation](build-specs/phase-1-foundation.md) - Next.js + database + auth
- [Phase 2A: Subtraction](build-specs/phase-2a-subtraction.md) - Subtraction game module
- [Phase 2B: Addition](build-specs/phase-2b-addition.md) - Addition game module
- [Phase 2C: Spelling](build-specs/phase-2c-spelling.md) - Spelling game module
- [Phase 3: Dashboard](build-specs/phase-3-dashboard.md) - Progress analytics
- [Phase 4: Admin](build-specs/phase-4-admin.md) - Goal management panel
- [Phase 5: Deploy](build-specs/phase-5-deploy.md) - Polish and production deployment

---

## Architectural Decisions (ADRs)

Why we made key technical choices:

- [ADR-001: Stack Selection](decisions/ADR-001-stack-selection.md) - Why Next.js + Supabase
- [ADR-002: User Accounts](decisions/ADR-002-user-accounts.md) - Why implement auth from day 1
- [ADR-003: Asset Storage](decisions/ADR-003-asset-storage.md) - Why upload to Supabase now
- [ADR-004: Testing Strategy](decisions/ADR-004-testing-strategy.md) - Unit + component, skip E2E

---

## API Documentation

- [Database Schema](api/database-schema.md) - Complete schema with tables, fields, indexes, RLS
- [Supabase Queries](api/supabase-queries.md) - Query patterns and examples

---

## Quick Reference

Checklists and workflows for common tasks:

- [Component Patterns](quick-reference/component-patterns.md) - How to structure components
- [Adding Game Module](quick-reference/adding-game-module.md) - Workflow for new game type
- [Deployment](quick-reference/deployment.md) - How to deploy changes

---

## Migration Reference

Documentation of v2 (HTML) implementation:

- [HTML Reference](migration/html-reference.md) - Old code patterns and what worked
- [Migration Checklist](migration/migration-checklist.md) - HTML → Next.js mapping

---

## Implementation Status

Legend: ✅ Complete | 🚧 In Progress | ⏳ Planned | ❌ Not Started

### Foundation
- ✅ Supabase project setup
- ✅ Asset upload to storage
- ✅ Next.js scaffolding
- ✅ Database migrations
- ✅ Authentication setup

### Game Modules
- ✅ Subtraction game
- ✅ Addition game
- ✅ Spelling game (with write prompt)
- ✅ Multiplication game (times tables 1-12)

### Features
- ✅ Progress dashboard
- ✅ Admin panel
- ✅ Goal system

### Deployment
- ✅ Production build
- ✅ Vercel deployment (https://smartypantsv3.vercel.app)
- ⏳ Custom domain (optional)

### Post-Launch Enhancements (2026-01-09)
- ✅ Vertical arithmetic layout for math games
- ✅ Always-visible stopwatch timer (pauses during spelling write prompt)
- ✅ Auto-focus answer input
- ✅ Back to Home navigation
- ✅ Landing page with profile image

See [DEPLOYMENT-LOG.md](../DEPLOYMENT-LOG.md) for detailed enhancement documentation.

---

## How to Use This Documentation

**For Architect Phase (this conversation):**
- Read everything to understand system
- Create/update specs and decisions
- Establish patterns

**For Build Phase (builder conversations):**
- Start with build spec for your phase
- Reference architecture docs as needed
- Follow patterns in `.claude/rules/`
- Update status when complete

**For Maintenance:**
- Update docs when patterns change
- Add ADRs for new decisions
- Keep build specs as reference
- Treat docs as source of truth

---

## Documentation Conventions

**File naming:**
- Architecture: `topic.md` (e.g., `database-design.md`)
- Build specs: `phase-N-name.md` (e.g., `phase-2a-subtraction.md`)
- ADRs: `ADR-NNN-title.md` (e.g., `ADR-001-stack-selection.md`)
- Templates: `_TEMPLATE.md`

**Internal links:**
- Relative paths from project root
- Example: `docs/architecture/overview.md`

**External links:**
- Absolute URLs with https://
- Example: `https://nextjs.org/docs`

**Code blocks:**
- Always specify language
- Use TypeScript for examples
- Include imports and types

---

## Questions or Updates

**Missing documentation?**
- Create new file following template
- Add to this INDEX.md
- Update `.claude/CLAUDE.md` routing if needed

**Documentation out of date?**
- Update the specific file
- Add note about what changed
- Consider creating ADR if architectural

**New patterns established?**
- Document in quick-reference/
- Update relevant rules file
- Add canonical example reference

---

## Next Steps

1. **If you're the architect:** Complete all build specs and architecture docs
2. **If you're a builder:** Read the build spec for your phase
3. **If you're maintaining:** Keep docs current with code
4. **If you're adapting:** Read templates and replace with your project

This documentation is living - update it as the project evolves.
