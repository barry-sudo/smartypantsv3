# Smarty Pants v3 🐯

Educational web application for 2nd-grade learning featuring math and spelling games with a jungle theme.

**Status:** Phase 1 Complete ✅ | Foundation Ready

---

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier)
- Database migration deployed

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
smartypants/
├── src/
│   ├── app/              # Next.js 14 App Router pages
│   ├── components/       # React components (coming in Phase 2)
│   ├── lib/              # Core logic and utilities
│   │   ├── assets.ts     # CDN asset manifest
│   │   ├── auth/         # Authentication utilities
│   │   └── supabase/     # Database client
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript definitions
├── supabase/
│   └── migrations/       # Database schema migrations
├── docs/                 # Architecture & specifications
└── .claude/              # AI-assisted development rules
```

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS (jungle theme, Comic Sans font)
- **Backend:** Supabase (PostgreSQL, Storage, Auth)
- **Testing:** Vitest, React Testing Library
- **Deployment:** Vercel (frontend) + Supabase Cloud (backend)

---

## Available Scripts

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

---

## Database Setup

### Initial Migration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/kwvqxvyklsrkfgykmtfu)
2. Navigate to **SQL Editor**
3. Copy contents of `supabase/migrations/20250106000001_initial_schema.sql`
4. Paste and run in SQL Editor
5. Verify tables created: users, sessions, problem_attempts, goals

See [DEPLOYMENT-INSTRUCTIONS.md](DEPLOYMENT-INSTRUCTIONS.md) for details.

### Schema

- **users** - User accounts with profile info
- **sessions** - Game sessions (25 questions each)
- **problem_attempts** - Individual question attempts
- **goals** - Parent-created reward goals
- **goal_progress** (view) - Computed goal completion status

---

## Development

### Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kwvqxvyklsrkfgykmtfu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Code Conventions

- **TypeScript:** Strict mode, no `any` types
- **Exports:** Named exports only (no default exports)
- **File naming:** PascalCase for components, kebab-case for utilities
- **Testing:** 100% coverage for game logic, 80% for components

See `.claude/CLAUDE.md` for complete conventions.

---

## Build Phases

| Phase | Status | Feature |
|-------|--------|---------|
| 0 | ✅ | Supabase setup + asset upload |
| 1 | ✅ | **Foundation (current)** |
| 2A | ⏳ | Subtraction game |
| 2B | ⏳ | Addition game |
| 2C | ⏳ | Spelling game |
| 3 | ⏳ | Analytics dashboard |
| 4 | ⏳ | Admin panel (goal management) |
| 5 | ⏳ | Production deployment |

---

## Features (When Complete)

### Games
- **Subtraction** - Practice subtraction facts (0-20)
- **Addition** - Practice addition facts (0-20)
- **Spelling** - 172 grade-appropriate words with audio

### Learning Mechanics
- 5x5 image reveal grid (1 cell per correct answer)
- Tiger roar sound on success
- Celebration videos after completing 25 questions
- Optional timer for time-based practice

### Progress Tracking
- Session history with accuracy stats
- Module breakdown (addition/subtraction/spelling)
- Accuracy trends over time
- Goal progress with visual indicators

### Parent Features
- Create custom reward goals
- Set session requirements and accuracy thresholds
- Track child's progress toward goals
- Upload prize photos for motivation

---

## Documentation

- **Architecture:** [docs/architecture/overview.md](docs/architecture/overview.md)
- **Build Specs:** [docs/build-specs/](docs/build-specs/)
- **API Reference:** [docs/api/](docs/api/) (coming soon)
- **Phase 1 Report:** [PHASE-1-COMPLETION-REPORT.md](PHASE-1-COMPLETION-REPORT.md)

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode (for development)
npm run test:watch
```

Current coverage: 100% (1 module)
Target coverage: 100% for game logic, 80% for components

---

## License

Private family project. Not licensed for public use.

---

## Development Timeline

- **Phase 0-1:** 6 hours (complete)
- **Remaining phases:** 18 hours estimated
- **Total project:** ~24 hours

---

## Contact

Built for 2nd-grade learning by a parent developer.

For questions about the architecture or build process, see `.claude/CLAUDE.md` for AI-assisted development guidance.

---

**Current Status:** Foundation complete, ready for game development (Phase 2A)
