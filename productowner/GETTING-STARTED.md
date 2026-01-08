# Getting Started - Build Setup Instructions

**Goal:** Set up your local dev environment and start building Smarty Pants v3

---

## Step 1: Create Local Project Folder

```bash
# Create project root
mkdir smarty-pants-v3
cd smarty-pants-v3
```

---

## Step 2: Place Architecture Documentation

Create the documentation structure and place your downloaded files:

```bash
# Create directory structure
mkdir -p .claude/rules
mkdir -p docs/architecture
mkdir -p docs/build-specs
mkdir -p docs/decisions

# Create project root for existing HTML files
mkdir -p current-version
```

### File Placement Map

**Root Level (project root):**
```
smarty-pants-v3/
├── _ARCHITECTURE-PROTOCOL.md          ← Place here
├── ARCHITECTURE-DELIVERABLES.md       ← Place here
├── BUILD-SPECS-COMPLETE.md            ← Place here
├── FINAL-ARCHITECTURE-SUMMARY.md      ← Place here
└── README.md                          ← You'll create this in Phase 5
```

**Routing Layer (`.claude/`):**
```
smarty-pants-v3/
└── .claude/
    ├── CLAUDE.md                      ← Place here
    ├── _TEMPLATE-GUIDE.md             ← Place here
    └── rules/
        ├── react-components.md        ← Place here
        ├── nextjs-routes.md           ← Place here
        ├── supabase-queries.md        ← Place here
        ├── game-logic.md              ← Place here
        └── testing.md                 ← Place here
```

**Reference Documentation (`docs/`):**
```
smarty-pants-v3/
└── docs/
    ├── INDEX.md                       ← Place here
    ├── architecture/
    │   └── overview.md                ← Place here
    ├── build-specs/
    │   ├── _TEMPLATE.md               ← Place here
    │   ├── phase-0-setup.md           ← Place here
    │   ├── phase-1-foundation.md      ← Place here
    │   ├── phase-2a-subtraction.md    ← Place here
    │   ├── phase-2b-addition.md       ← Place here
    │   ├── phase-2c-spelling.md       ← Place here
    │   ├── phase-3-dashboard.md       ← Place here
    │   ├── phase-4-admin.md           ← Place here
    │   └── phase-5-deploy.md          ← Place here
    └── decisions/
        └── ADRs-complete.md           ← Place here
```

**Existing HTML Files (optional reference):**
```
smarty-pants-v3/
└── current-version/
    ├── index.html                     ← Your existing files
    ├── addition.html
    ├── subtraction.html
    ├── spelling.html
    ├── math-selection.html
    ├── words.json
    ├── Gster.jpeg
    ├── Pictures/
    │   ├── image1.jpg
    │   ├── image2.jpg
    │   └── ... (5 images total)
    ├── Videos/
    │   ├── video1.mp4
    │   └── ... (3 videos total)
    └── Audio/
        └── ... (173 .m4a files)
```

---

## Step 3: Verify Structure

Run this to check your structure:

```bash
# From project root
tree -L 3 -a
```

Expected output:
```
smarty-pants-v3/
├── .claude/
│   ├── CLAUDE.md
│   ├── _TEMPLATE-GUIDE.md
│   └── rules/
│       ├── game-logic.md
│       ├── nextjs-routes.md
│       ├── react-components.md
│       ├── supabase-queries.md
│       └── testing.md
├── docs/
│   ├── INDEX.md
│   ├── architecture/
│   │   └── overview.md
│   ├── build-specs/
│   │   ├── _TEMPLATE.md
│   │   ├── phase-0-setup.md
│   │   ├── phase-1-foundation.md
│   │   ├── phase-2a-subtraction.md
│   │   ├── phase-2b-addition.md
│   │   ├── phase-2c-spelling.md
│   │   ├── phase-3-dashboard.md
│   │   ├── phase-4-admin.md
│   │   └── phase-5-deploy.md
│   └── decisions/
│       └── ADRs-complete.md
├── current-version/
│   ├── [all your existing HTML files and assets]
├── _ARCHITECTURE-PROTOCOL.md
├── ARCHITECTURE-DELIVERABLES.md
├── BUILD-SPECS-COMPLETE.md
└── FINAL-ARCHITECTURE-SUMMARY.md
```

---

## Step 4: Initialize Git (Recommended)

```bash
# From project root
git init
git add .
git commit -m "Initial commit: Architecture documentation"
```

This preserves your architecture work before building starts.

---

## Step 5: Start Phase 0 - Claude Build Instance

### 5A. Open New Claude Conversation

**Important:** Start a FRESH conversation (not this one). This separates architecture from implementation.

### 5B. Upload Project Context

In the new conversation, upload your project folder:
- Upload the entire `smarty-pants-v3` folder (or zip it first)
- Or individually upload key files if folder upload isn't available

### 5C. Use This Exact Prompt

```
I'm implementing Phase 0: Setup for Smarty Pants v3.

Context files:
- Build spec: @docs/build-specs/phase-0-setup.md
- Architecture: @docs/architecture/overview.md
- Navigation: @.claude/CLAUDE.md

Phase 0 objective: Create Supabase project, set up storage buckets, 
and upload all assets (5 images, 3 videos, 173 audio files).

The assets are currently in /current-version/ directory.

Ready to start - read the build spec first.
```

### 5D. What Claude Will Do

Phase 0 is mostly manual work YOU do:
1. Claude guides you to create Supabase project
2. You follow instructions to set up storage buckets
3. You upload assets to Supabase Storage
4. Claude helps you document the asset URLs

**Duration:** ~2 hours

---

## Step 6: Subsequent Phases (1-5)

Each phase gets a new conversation following this pattern:

### Phase 1: Foundation
```
I'm implementing Phase 1: Foundation for Smarty Pants v3.

Spec: @docs/build-specs/phase-1-foundation.md
Architecture: @docs/architecture/overview.md
Patterns: @.claude/rules/

This phase: Initialize Next.js 14 with TypeScript, connect Supabase,
deploy database schema, set up authentication.

Ready to start.
```

### Phase 2A: Subtraction Game
```
I'm implementing Phase 2A: Subtraction Game for Smarty Pants v3.

Spec: @docs/build-specs/phase-2a-subtraction.md
Patterns: @.claude/rules/game-logic.md, @.claude/rules/react-components.md

This phase: Build the canonical game module with problem generator,
image reveal, timer, session tracking.

This establishes the pattern for all future games.

Ready to start.
```

### Phase 2B: Addition Game
```
I'm implementing Phase 2B: Addition Game for Smarty Pants v3.

Spec: @docs/build-specs/phase-2b-addition.md
Reference: Phase 2A implementation

This phase: Copy Phase 2A pattern, adapt problem generator for addition.

Ready to start.
```

### Phase 2C: Spelling Game
```
I'm implementing Phase 2C: Spelling Game for Smarty Pants v3.

Spec: @docs/build-specs/phase-2c-spelling.md
Reference: Phase 2A pattern

This phase: Adapt game pattern for spelling with audio playback
and letter-by-letter input.

Ready to start.
```

### Phase 3: Dashboard
```
I'm implementing Phase 3: Dashboard for Smarty Pants v3.

Spec: @docs/build-specs/phase-3-dashboard.md
Patterns: @.claude/rules/react-components.md

This phase: Build analytics dashboard with session stats,
goal progress, and module breakdown.

Ready to start.
```

### Phase 4: Admin Panel
```
I'm implementing Phase 4: Admin Panel for Smarty Pants v3.

Spec: @docs/build-specs/phase-4-admin.md

This phase: Hidden admin access with goal management interface.

Ready to start.
```

### Phase 5: Deploy
```
I'm implementing Phase 5: Deploy for Smarty Pants v3.

Spec: @docs/build-specs/phase-5-deploy.md

This phase: Final testing, optimization, and production deployment.

Ready to start.
```

---

## Important Conversation Management Tips

### ✅ DO:
- Start fresh conversation for each phase
- Reference the build spec explicitly in first message
- Upload project folder at start of each phase
- Let Claude read the spec before starting work
- Commit your work after each phase completes

### ❌ DON'T:
- Try to do multiple phases in one conversation
- Skip uploading the project context
- Start coding before Claude reads the spec
- Mix architecture discussion with building

---

## Expected Timeline

| Phase | Conversation | Duration | Output |
|-------|--------------|----------|--------|
| 0 | Setup | 2 hours | Supabase ready, assets uploaded |
| 1 | Foundation | 4 hours | Next.js app running, DB connected |
| 2A | Subtraction | 4 hours | First game working |
| 2B | Addition | 2 hours | Second game working |
| 2C | Spelling | 3 hours | Third game working |
| 3 | Dashboard | 4 hours | Analytics displaying |
| 4 | Admin | 3 hours | Goal management working |
| 5 | Deploy | 2 hours | Production live |
| **Total** | **8 convos** | **24 hours** | **Complete app** |

---

## Folder Structure After Build Starts

After Phase 1, your structure will look like:

```
smarty-pants-v3/
├── .claude/                    # Documentation (keep)
├── docs/                       # Documentation (keep)
├── current-version/            # Old HTML files (reference)
├── _ARCHITECTURE-PROTOCOL.md   # Documentation (keep)
├── ARCHITECTURE-DELIVERABLES.md
├── BUILD-SPECS-COMPLETE.md
├── FINAL-ARCHITECTURE-SUMMARY.md
├── .env.local                  # Created in Phase 1
├── .gitignore                  # Created in Phase 1
├── next.config.js              # Created in Phase 1
├── package.json                # Created in Phase 1
├── tsconfig.json               # Created in Phase 1
├── tailwind.config.ts          # Created in Phase 1
├── src/                        # Created in Phase 1
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── hooks/
└── supabase/                   # Created in Phase 1
    └── migrations/
```

---

## Quick Start Checklist

- [ ] Create `smarty-pants-v3` folder
- [ ] Create `.claude/rules/` subfolder structure
- [ ] Create `docs/` subfolder structure
- [ ] Place all 22 downloaded .md files in correct locations
- [ ] Copy existing HTML files to `current-version/`
- [ ] Verify structure with `tree` command
- [ ] Initialize git repository
- [ ] Commit architecture documentation
- [ ] Open NEW Claude conversation
- [ ] Upload project folder
- [ ] Start Phase 0 with provided prompt

---

## Troubleshooting

### "Claude can't find the build spec"
- Make sure you uploaded the entire project folder
- Reference files with `@docs/build-specs/phase-X-name.md` syntax
- Try mentioning "Read the file at docs/build-specs/phase-X-name.md"

### "Claude wants to redesign instead of build"
- Remind: "The architecture is complete. Follow the build spec exactly."
- Point to specific sections: "See 'What to Build' section in the spec"

### "Implementation differs from spec"
- Reference the spec: "The build spec specifies [X]. Let's implement that."
- Point to code examples in the spec

---

## Success Criteria

You'll know you're ready when:
- ✅ All 22 .md files are in correct locations
- ✅ Folder structure matches the expected layout
- ✅ Git repository initialized
- ✅ You can see/read all files in your code editor
- ✅ You understand the phase progression (0→1→2A→2B→2C→3→4→5)

---

## What Happens During Each Phase

### Phase 0 (YOU do most work)
- Sign up for Supabase account
- Create new project
- Set up storage buckets
- Upload assets via Supabase dashboard
- Document URLs

### Phase 1 (Claude + YOU)
- Claude: Generate Next.js project structure
- YOU: Install dependencies, configure environment
- Claude: Create database migrations
- YOU: Run migrations in Supabase
- Claude: Set up authentication
- YOU: Test dev server

### Phases 2-5 (Mostly Claude)
- Claude writes code
- YOU: Test features
- Claude: Writes tests
- YOU: Run tests, verify coverage
- Claude: Fixes issues
- YOU: Approve and commit

---

## Ready to Build! 🚀

Your next step: **Create the folder structure above, place your files, then start a new Claude conversation for Phase 0.**

Architecture is done. Building starts now.
