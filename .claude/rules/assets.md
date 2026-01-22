---
paths:
- src/lib/assets.ts
---

# Asset Management Guidelines

## Core Principle

**Never hardcode Supabase Storage URLs.** All asset URLs centralized in `src/lib/assets.ts`.

## Critical Patterns

**✅ DO:**
- Import `ASSETS` from `@/lib/assets` for all media URLs
- Add new assets to `assets.ts` after uploading to Supabase Storage
- Use Next.js `<Image>` component for optimization (domain pre-configured)

**❌ DON'T:**
- Hardcode URLs in components
- Create separate asset constants in different files
- Reference Supabase Storage URLs directly

## Asset Types

- `ASSETS.images` - Tiger reveals, prize images
- `ASSETS.audio` - Word pronunciations, feedback sounds
- `ASSETS.videos` - Celebration videos

## Examples

**See:** `src/lib/assets.ts` (single source of truth)
