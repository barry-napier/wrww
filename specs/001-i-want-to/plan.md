# Implementation Plan: What Are We Watching (WRWW)

**Branch**: `001-i-want-to` | **Date**: 2024-09-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-i-want-to/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Build a movie/TV show voting leaderboard application where users can swipe to vote (+1 right, -1 left, 0 up) without authentication. The app displays content cards with movie/show information and maintains real-time leaderboards organized by categories (genres and trending).

## Technical Context
**Language/Version**: TypeScript 5.x / Node.js 18+
**Primary Dependencies**: Next.js 14, Supabase Client, Tailwind CSS, Framer Motion, TMDB API
**Storage**: Supabase (PostgreSQL with Realtime subscriptions)
**Testing**: Jest, React Testing Library, Playwright (E2E)
**Target Platform**: Web (mobile-first responsive)
**Project Type**: web (frontend+backend integrated in Next.js)
**Performance Goals**: <100ms swipe response, <3s initial load on 3G, top-10 query <200ms
**Constraints**: No authentication required, session-based duplicate prevention, indefinite data retention
**Scale/Scope**: Support concurrent users, ~1000 movies/shows initially, 10+ categories

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. User-First Experience
- ✅ No authentication barriers
- ✅ Instant swipe interactions
- ✅ Immediate visual feedback
- ✅ Core loop: discover → vote → see results

### II. Real-Time Leaderboard Integrity
- ✅ Accurate vote tallies
- ✅ Rankings update on page request (top 10)
- ✅ Session-based duplicate prevention
- ✅ Graceful network interruption handling

### III. Component-Based Architecture
- ✅ Next.js App Router with RSC/Client components
- ✅ Single responsibility components
- ✅ TypeScript for prop interfaces

### IV. Performance & Responsiveness
- ✅ Mobile-first swipe optimization
- ✅ <3s load time target
- ✅ <100ms gesture response
- ✅ Progressive image loading

### V. Data Source Integration
- ✅ TMDB API abstraction layer
- ✅ Supabase caching strategy
- ✅ Rate limiting handling
- ✅ Fallback strategies

## Project Structure

### Documentation (this feature)
```
specs/001-i-want-to/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 2: Web application (Next.js App Router structure)
app/
├── api/                 # API routes
│   ├── votes/
│   ├── movies/
│   └── leaderboard/
├── (routes)/           # Page routes
│   ├── page.tsx        # Home with voting cards
│   ├── leaderboard/
│   └── layout.tsx
└── actions/            # Server actions

components/
├── ui/                 # Base UI components
│   ├── Card.tsx
│   ├── Button.tsx
│   └── Modal.tsx
├── voting/             # Voting components
│   ├── SwipeCard.tsx
│   ├── VoteButtons.tsx
│   └── VoteAnimation.tsx
└── leaderboard/        # Leaderboard components
    ├── LeaderboardTable.tsx
    ├── CategoryFilter.tsx
    └── RankDisplay.tsx

lib/
├── supabase/          # Supabase client & queries
├── tmdb/              # TMDB API integration
└── utils/             # Helpers

types/                 # TypeScript definitions
hooks/                 # Custom React hooks
```

**Structure Decision**: Option 2 (Web application) - Next.js with integrated frontend/backend

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - Supabase Realtime subscriptions best practices
   - TMDB API rate limits and caching strategies
   - Swipe gesture libraries (Framer Motion vs React Spring)
   - Session storage for anonymous voting
   - Next.js 14 App Router patterns

2. **Generate and dispatch research agents**:
   ```
   Task: "Research Supabase Realtime for leaderboard updates"
   Task: "Research TMDB API integration and rate limiting"
   Task: "Research swipe gesture implementation for React"
   Task: "Research session-based voting without authentication"
   Task: "Research Next.js 14 App Router best practices"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Movie/TV Show (id, title, poster, genres, rating, year, description)
   - Vote (id, movie_id, vote_value, session_id, created_at)
   - Leaderboard (aggregated view with rankings)
   - Category (genre classifications, trending)
   - Session (browser session for vote tracking)

2. **Generate API contracts** from functional requirements:
   - POST /api/votes - Submit vote
   - GET /api/movies/next - Get next card to vote on
   - GET /api/leaderboard - Get top 10 by category
   - GET /api/categories - List available categories
   - Output OpenAPI schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - test_vote_submission.ts
   - test_movie_fetch.ts
   - test_leaderboard_query.ts
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - First-time user sees voting cards
   - Swipe right increases vote count
   - Swipe left decreases vote count
   - Swipe up marks as not seen
   - Leaderboard shows top 10
   - Category filter updates results

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
   - Add WRWW-specific context to CLAUDE.md
   - Keep under 150 lines for token efficiency

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, CLAUDE.md updates

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Setup tasks: Next.js project init, Supabase config, TMDB setup
- Database tasks: Create tables, indexes, RLS policies
- API tasks: Implement each endpoint from contracts
- Component tasks: Build UI components (cards, swipe, leaderboard)
- Integration tasks: Connect frontend to API
- Testing tasks: Unit, integration, E2E tests

**Ordering Strategy**:
- Environment setup first
- Database schema before API
- API before frontend
- Components before pages
- Tests throughout (TDD)

**Estimated Output**: 30-35 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

No violations identified. The design aligns with all constitutional principles.

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none needed)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*