# Architecture Protocol: From Zero to Build-Ready

**Version:** 1.0  
**Project:** Smarty Pants v3 (Educational Web Application)  
**Last Updated:** 2025-01-06

---

## What This Is

This project demonstrates a complete **architecture-first development approach** optimized for AI-assisted building. This document is your "IKEA manual" - use Smarty Pants v3 as a reference implementation for structuring ANY web application project.

## The Core Problem This Solves

Traditional development with AI assistance faces three problems:

1. **Context Window Exhaustion** - Mixing architecture decisions with implementation details consumes tokens rapidly
2. **Inconsistent Patterns** - Without established patterns, AI generates inconsistent code across features
3. **Ambiguous Requirements** - Unclear specifications lead to implementation that doesn't match intent

This protocol solves all three through **separation of concerns**: Architect decides, documents, and establishes patterns. Builder follows patterns and executes specifications.

---

## The Three-Phase Approach

### **Phase 1: Architecture** (This Conversation)
**Role:** Architect Claude  
**Duration:** Single conversation focused on design  
**Output:** Complete documentation system + build specifications  

**Deliverables:**
- Technical decisions finalized (stack, database, patterns)
- Complete documentation structure (`.claude/` + `docs/`)
- Build specifications for each phase (detailed, testable)
- Patterns established (canonical examples, rules)
- Handoff package for builders

**Success Criteria:**
- Any developer (human/AI) can build from specs without making architectural decisions
- Build phases are scoped to 3-4 hours each
- All ambiguities resolved before building starts

### **Phase 2: Building** (Subsequent Conversations)
**Role:** Builder Claude (separate conversations per phase)  
**Duration:** One conversation per build phase  
**Input:** Build specification + documentation  
**Output:** Working code + tests + completion report  

**Process:**
1. Read build specification
2. Review relevant documentation and rules
3. Implement according to established patterns
4. Write tests per testing specification
5. Verify against success criteria
6. Report completion with evidence

**Success Criteria:**
- All acceptance tests pass
- Code follows established patterns
- Tests written and passing
- No architectural decisions made (flags ambiguities instead)

### **Phase 3: Maintenance** (Ongoing)
**Role:** Any developer with access to documentation  
**Process:**
- New features follow established patterns
- Patterns evolve through ADRs (Architectural Decision Records)
- Documentation stays current with code

---

## How to Reuse This for Your Project

### Step 1: Copy the Structure

```bash
# Clone or download Smarty Pants v3 repository
git clone [repository-url]

# Copy the structure to your new project
cp -r smarty-pants-v3/.claude your-project/.claude
cp -r smarty-pants-v3/docs your-project/docs

# Remove Smarty Pants specifics
cd your-project
# Keep all _TEMPLATE.md files, remove/replace others
```

### Step 2: Understand the File Types

**Three types of files in this system:**

1. **Meta-Files** (start with `_`): Templates and guides
   - `_ARCHITECTURE-PROTOCOL.md` (this file)
   - `_TEMPLATE-GUIDE.md` (in various directories)
   - `_TEMPLATE.md` (templates for specific doc types)
   - **These teach the pattern** - read them first

2. **Project Files**: Smarty Pants specifics
   - `CLAUDE.md`, `overview.md`, `phase-1-foundation.md`, etc.
   - **These demonstrate the pattern** - use as examples

3. **Your Files**: What you'll create
   - Copy template, fill in your project details
   - Follow the structure shown in project files

### Step 3: Run Your Architecture Phase

**Start fresh conversation with Architect Claude:**

```
I'm building [your project description]. I want to follow the architecture-first 
approach demonstrated in Smarty Pants v3.

I've copied the structure. Help me:
1. Make technical decisions (stack, database, patterns)
2. Create my documentation system (adapting the templates)
3. Write build specifications for my features
4. Establish patterns for my project

Read @_ARCHITECTURE-PROTOCOL.md to understand the approach.
```

**Architect Claude will:**
- Ask clarifying questions about your project
- Make technical recommendations
- Adapt the templates to your specifics
- Create your complete documentation system
- Write your build specifications

### Step 4: Execute Build Phases

**For each build phase, start fresh conversation with Builder Claude:**

```
I'm implementing Phase X of [your project]. 

Read @docs/build-specs/phase-X-[feature].md for the specification.
Follow patterns in @.claude/rules/ and @docs/architecture/.

Build according to the spec, write tests, and report completion.
```

**Builder Claude will:**
- Read the specification
- Follow established patterns
- Implement the feature
- Write tests
- Verify success criteria
- Report completion

---

## What Makes This Work

### **1. Progressive Disclosure**
- `CLAUDE.md` routes to information (minimal, always-loaded)
- Detailed docs contain information (loaded on-demand)
- Builder reads only what's needed for current task

### **2. Separation of Concerns**
- Architect makes decisions, establishes patterns
- Builder follows patterns, executes specifications
- Each role uses separate conversation/context window

### **3. Build Specifications**
Every build phase has:
- Clear objective (what we're building)
- Success criteria (how to verify it works)
- Exact file paths and interfaces
- References to patterns and examples
- No ambiguity or speculation

### **4. Established Patterns**
Before building starts:
- Canonical examples identified
- Rules documented
- Conventions established
- Architectural decisions recorded (ADRs)

---

## The Documentation Structure

### `.claude/` Directory (Routing Layer)

**Purpose:** Route AI to information efficiently

```
.claude/
├── CLAUDE.md                    # Main routing document (<100 lines)
├── _TEMPLATE-GUIDE.md           # How to adapt CLAUDE.md
└── rules/                       # Context-specific patterns
    ├── _TEMPLATE.md             # Rule file template
    ├── react-components.md      # Frontend patterns
    ├── supabase-queries.md      # Database patterns
    └── [other-domains].md       # Domain-specific rules
```

**Key files:**
- **CLAUDE.md**: Project identity, commands, structure map, doc index, conventions
- **rules/*.md**: Scoped patterns (load only when working with matching files)

### `docs/` Directory (Reference Layer)

**Purpose:** Contain detailed information for on-demand reading

```
docs/
├── _ARCHITECTURE-PROTOCOL.md    # This file
├── _TEMPLATE-GUIDE.md           # How to adapt docs/
├── INDEX.md                     # Complete doc inventory
├── architecture/                # System design
├── build-specs/                 # Phase specifications
├── decisions/                   # ADRs (why we chose X)
├── api/                         # Database, endpoints
├── quick-reference/             # Common workflows
└── [other-categories]/          # Domain-specific docs
```

**Key categories:**
- **architecture/**: How major systems work
- **build-specs/**: What to build in each phase
- **decisions/**: Why architectural choices were made
- **api/**: Database schema, API contracts
- **quick-reference/**: Checklists for common tasks

---

## Example: Adapting for E-commerce Site

**Original (Smarty Pants):**
- Educational games (subtraction, addition, spelling)
- Progress tracking
- Parent goal management

**Your E-commerce Site:**
- Product catalog (browsing, search, filtering)
- Shopping cart
- Order management

**How to adapt:**

1. **Copy structure**: Same `.claude/` and `docs/` organization

2. **Replace domain concepts:**
   - "games" → "products"
   - "sessions" → "orders"
   - "progress" → "purchase history"

3. **Keep the patterns:**
   - Same build spec format
   - Same rules file pattern
   - Same ADR structure
   - Same doc categories

4. **Update specifics:**
   - Tech stack in CLAUDE.md
   - Database schema for your domain
   - Build phases for your features
   - Patterns for your architecture

**The structure is universal. The content is yours.**

---

## When to Use This Approach

### Good Fit

✅ **Web applications** of any complexity  
✅ **Projects with multiple features/modules**  
✅ **When using AI assistance** for building  
✅ **When you want maintainable architecture**  
✅ **Teams of any size** (1 person to 100)  

### Overkill

❌ **Simple scripts or utilities** (under 500 lines)  
❌ **Throwaway prototypes** (not intended for production)  
❌ **Single-file applications**  

---

## Success Criteria for Architecture Phase

Your architecture is complete when:

- [ ] **Decisions finalized** - Tech stack, database, patterns chosen and documented
- [ ] **Documentation complete** - All templates filled in with project specifics
- [ ] **Build specs written** - Every phase has detailed specification with success criteria
- [ ] **Patterns established** - Canonical examples identified, rules documented
- [ ] **Ambiguities resolved** - No "TBD" or "figure out later" in specifications
- [ ] **Handoff ready** - Builder can start Phase 1 without asking questions

---

## Common Questions

### "How much time does architecture phase take?"

**Estimate:** 2-4 hours for conversation with Architect Claude

This may seem slow, but it saves 10-20 hours of:
- Refactoring inconsistent patterns
- Fixing architectural mistakes
- Context window management issues
- Unclear requirement interpretation

### "Can I skip the architecture phase?"

You can, but you'll encounter:
- Inconsistent code patterns across features
- Constant architectural decisions during building
- Context window exhaustion from mixed concerns
- More time debugging than building

### "What if requirements change mid-project?"

**Update documentation first, then build:**
1. Make architectural decision
2. Document it (update spec or create ADR)
3. Update affected build specs
4. Builder implements change

Changes are fine. Undocumented changes create chaos.

### "Can I use this without AI assistance?"

Yes! This works for human developers too:
- Architecture phase = design docs
- Build specs = task tickets
- Rules = coding standards
- ADRs = design decisions

The structure is universal. AI optimization is a bonus.

---

## The Files You're Reading Right Now

This Smarty Pants v3 repository contains:

**Meta-files** (templates/guides):
- `_ARCHITECTURE-PROTOCOL.md` (this file)
- `_TEMPLATE-GUIDE.md` files in various directories
- `_TEMPLATE.md` templates for each doc type

**Project files** (Smarty Pants specifics):
- `.claude/CLAUDE.md` and rules
- `docs/` with architecture, specs, etc.

**How to use them:**
1. Read meta-files to understand the pattern
2. Read project files to see pattern in action
3. Copy structure and adapt for your project

---

## Next Steps

1. **Explore the structure**: Browse `.claude/` and `docs/` directories
2. **Read templates**: Open `_TEMPLATE.md` files to see the pattern
3. **Study examples**: Compare templates to actual Smarty Pants docs
4. **Adapt for your project**: Copy structure, replace content
5. **Start your architecture phase**: Follow this protocol for your project

---

## Meta: About This Protocol

**Created:** 2025-01-06  
**Version:** 1.0  
**Tested on:** Smarty Pants v3 (Next.js + Supabase web application)  
**License:** Use freely for any project  
**Feedback:** This is v1 - improve it based on your experience  

**The goal:** Make AI-assisted development systematic, not chaotic.

---

## Quick Start Checklist

Starting a new project? Follow this:

- [ ] Copy `.claude/` and `docs/` structure
- [ ] Read `_ARCHITECTURE-PROTOCOL.md` (this file)
- [ ] Start conversation with Architect Claude
- [ ] Make technical decisions
- [ ] Create documentation system
- [ ] Write build specifications
- [ ] Start build phase conversations
- [ ] Follow patterns, build features
- [ ] Update docs as you evolve

**Welcome to architecture-first development.**
