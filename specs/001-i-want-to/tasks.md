# Tasks: What Are We Watching (WRWW) Voting Leaderboard

**Input**: Design documents from `/specs/001-i-want-to/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: Next.js App Router structure
- API routes in `app/api/`
- Components in `components/`
- Library code in `lib/`
- Types in `types/`

## Phase 3.1: Setup & Infrastructure
- [ ] T001 Initialize Next.js 14 project with TypeScript and App Router
- [ ] T002 Install core dependencies: supabase-js, framer-motion, tailwindcss, @tanstack/react-query
- [ ] T003 [P] Configure TypeScript strict mode in tsconfig.json
- [ ] T004 [P] Setup ESLint and Prettier with Next.js config
- [ ] T005 [P] Create .env.local template with required environment variables
- [ ] T006 Setup Tailwind CSS with mobile-first responsive design tokens
- [ ] T007 Create Supabase client configuration in lib/supabase/client.ts
- [ ] T008 [P] Setup TMDB API client in lib/tmdb/client.ts
- [ ] T009 [P] Configure Next.js middleware for session management in middleware.ts
- [ ] T010 Create database migration scripts in supabase/migrations/

## Phase 3.2: Database Schema & Setup
- [ ] T011 Create Supabase tables: content, votes, genres via migration
- [ ] T012 [P] Create indexes for performance optimization
- [ ] T013 [P] Setup materialized view for leaderboard aggregation
- [ ] T014 Configure Row Level Security (RLS) policies for votes table
- [ ] T015 Create database seed script for initial movie/TV data
- [ ] T016 [P] Setup Supabase Realtime subscriptions configuration
- [ ] T017 Create refresh function for materialized view

## Phase 3.3: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.4
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests
- [ ] T018 [P] Contract test POST /api/votes in __tests__/api/votes.test.ts
- [ ] T019 [P] Contract test GET /api/movies/next in __tests__/api/movies-next.test.ts
- [ ] T020 [P] Contract test GET /api/leaderboard in __tests__/api/leaderboard.test.ts
- [ ] T021 [P] Contract test GET /api/categories in __tests__/api/categories.test.ts
- [ ] T022 [P] Contract test GET /api/content/[id] in __tests__/api/content.test.ts

### Integration Tests
- [ ] T023 [P] Integration test: First-time user sees voting cards in __tests__/integration/first-visit.test.tsx
- [ ] T024 [P] Integration test: Swipe right increases vote in __tests__/integration/vote-right.test.tsx
- [ ] T025 [P] Integration test: Swipe left decreases vote in __tests__/integration/vote-left.test.tsx
- [ ] T026 [P] Integration test: Swipe up marks not seen in __tests__/integration/vote-neutral.test.tsx
- [ ] T027 [P] Integration test: Leaderboard shows top 10 in __tests__/integration/leaderboard.test.tsx
- [ ] T028 [P] Integration test: Category filter works in __tests__/integration/category-filter.test.tsx
- [ ] T029 [P] Integration test: Duplicate vote prevention in __tests__/integration/duplicate-vote.test.tsx

## Phase 3.4: Core Type Definitions & Models
- [ ] T030 [P] Define TypeScript types for Content in types/content.ts
- [ ] T031 [P] Define TypeScript types for Vote in types/vote.ts
- [ ] T032 [P] Define TypeScript types for Leaderboard in types/leaderboard.ts
- [ ] T033 [P] Define TypeScript types for Session in types/session.ts
- [ ] T034 [P] Define TypeScript types for API responses in types/api.ts
- [ ] T035 [P] Create Zod schemas for validation in lib/validation/schemas.ts

## Phase 3.5: Data Access Layer
- [ ] T036 [P] Create content repository in lib/repositories/content.ts
- [ ] T037 [P] Create vote repository in lib/repositories/vote.ts
- [ ] T038 [P] Create leaderboard repository in lib/repositories/leaderboard.ts
- [ ] T039 [P] Create session service in lib/services/session.ts
- [ ] T040 [P] Create TMDB service wrapper in lib/services/tmdb.ts
- [ ] T041 Create cache service for TMDB data in lib/services/cache.ts

## Phase 3.6: API Implementation (ONLY after tests are failing)
- [ ] T042 Implement POST /api/votes route handler
- [ ] T043 Implement GET /api/movies/next route handler
- [ ] T044 Implement GET /api/leaderboard route handler
- [ ] T045 Implement GET /api/categories route handler
- [ ] T046 Implement GET /api/content/[id] route handler
- [ ] T047 [P] Create API rate limiting middleware in lib/middleware/rate-limit.ts
- [ ] T048 [P] Create error handling wrapper in lib/api/error-handler.ts

## Phase 3.7: UI Components
### Base Components
- [ ] T049 [P] Create Card component in components/ui/Card.tsx
- [ ] T050 [P] Create Button component in components/ui/Button.tsx
- [ ] T051 [P] Create Modal component in components/ui/Modal.tsx
- [ ] T052 [P] Create Loading spinner in components/ui/Loading.tsx

### Voting Components
- [ ] T053 Create SwipeCard component with gesture detection in components/voting/SwipeCard.tsx
- [ ] T054 [P] Create VoteButtons fallback UI in components/voting/VoteButtons.tsx
- [ ] T055 [P] Create VoteAnimation component in components/voting/VoteAnimation.tsx
- [ ] T056 Create VotingStack card stack manager in components/voting/VotingStack.tsx

### Leaderboard Components
- [ ] T057 [P] Create LeaderboardTable component in components/leaderboard/LeaderboardTable.tsx
- [ ] T058 [P] Create CategoryFilter component in components/leaderboard/CategoryFilter.tsx
- [ ] T059 [P] Create RankDisplay component in components/leaderboard/RankDisplay.tsx
- [ ] T060 [P] Create LeaderboardEntry component in components/leaderboard/LeaderboardEntry.tsx

## Phase 3.8: Custom Hooks
- [ ] T061 [P] Create useVoting hook in hooks/useVoting.ts
- [ ] T062 [P] Create useLeaderboard hook in hooks/useLeaderboard.ts
- [ ] T063 [P] Create useSession hook in hooks/useSession.ts
- [ ] T064 [P] Create useSwipeGesture hook in hooks/useSwipeGesture.ts
- [ ] T065 [P] Create useRealtimeUpdates hook in hooks/useRealtimeUpdates.ts

## Phase 3.9: Page Implementation
- [ ] T066 Create home page with voting interface in app/page.tsx
- [ ] T067 Create leaderboard page in app/leaderboard/page.tsx
- [ ] T068 Create layout with navigation in app/layout.tsx
- [ ] T069 [P] Create loading states in app/loading.tsx
- [ ] T070 [P] Create error boundary in app/error.tsx
- [ ] T071 [P] Create not-found page in app/not-found.tsx

## Phase 3.10: Server Actions & Data Fetching
- [ ] T072 Create vote submission server action in app/actions/vote.ts
- [ ] T073 Create leaderboard fetch server action in app/actions/leaderboard.ts
- [ ] T074 Create content fetch server action in app/actions/content.ts
- [ ] T075 [P] Setup React Query providers in app/providers.tsx

## Phase 3.11: Integration & Optimization
- [ ] T076 Connect voting UI to API endpoints
- [ ] T077 Implement optimistic UI updates for voting
- [ ] T078 Setup Supabase Realtime subscriptions for leaderboard
- [ ] T079 Implement session persistence and vote tracking
- [ ] T080 Add image optimization with Next.js Image component
- [ ] T081 Implement progressive enhancement for non-JS users
- [ ] T082 Setup error tracking and logging

## Phase 3.12: Polish & Performance
- [ ] T083 [P] Write unit tests for utility functions in __tests__/unit/
- [ ] T084 [P] Write component tests in __tests__/components/
- [ ] T085 Implement performance monitoring
- [ ] T086 Add loading skeletons for better UX
- [ ] T087 Implement offline support with service worker
- [ ] T088 [P] Create API documentation in docs/api.md
- [ ] T089 [P] Update README.md with setup instructions
- [ ] T090 Run Lighthouse audit and fix issues
- [ ] T091 Test on real mobile devices
- [ ] T092 Setup GitHub Actions CI/CD pipeline

## Dependencies
- Setup (T001-T010) must complete first
- Database (T011-T017) before any data operations
- Tests (T018-T029) before implementation (T042-T046)
- Types (T030-T035) before repositories (T036-T041)
- Repositories before API routes
- Base components (T049-T052) before complex components
- API routes before page implementation
- Everything before polish phase

## Parallel Execution Examples

### Initial Setup (run together):
```javascript
Task: "Configure TypeScript strict mode in tsconfig.json"
Task: "Setup ESLint and Prettier with Next.js config"
Task: "Create .env.local template with required environment variables"
Task: "Setup TMDB API client in lib/tmdb/client.ts"
```

### Contract Tests (run all together):
```javascript
Task: "Contract test POST /api/votes in __tests__/api/votes.test.ts"
Task: "Contract test GET /api/movies/next in __tests__/api/movies-next.test.ts"
Task: "Contract test GET /api/leaderboard in __tests__/api/leaderboard.test.ts"
Task: "Contract test GET /api/categories in __tests__/api/categories.test.ts"
Task: "Contract test GET /api/content/[id] in __tests__/api/content.test.ts"
```

### Type Definitions (run all together):
```javascript
Task: "Define TypeScript types for Content in types/content.ts"
Task: "Define TypeScript types for Vote in types/vote.ts"
Task: "Define TypeScript types for Leaderboard in types/leaderboard.ts"
Task: "Define TypeScript types for Session in types/session.ts"
Task: "Define TypeScript types for API responses in types/api.ts"
```

## Notes
- [P] tasks work on different files with no dependencies
- Verify all tests fail before implementing features
- Commit after each completed task
- Use conventional commits (feat:, fix:, test:, docs:)
- Monitor performance metrics throughout development

## Task Generation Rules Applied
1. **From Contracts**: 5 API endpoints → 5 contract tests + 5 implementations
2. **From Data Model**: 4 entities → 4 type definitions + 3 repositories
3. **From User Stories**: 6 acceptance scenarios → 7 integration tests
4. **From Tech Stack**: Specific tasks for Next.js, Supabase, Framer Motion, TMDB

## Validation Checklist
- [x] All contracts have corresponding tests (T018-T022)
- [x] All entities have type definitions (T030-T033)
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No parallel tasks modify same file

## Success Metrics
- All 92 tasks completed
- 100% test coverage for API routes
- Lighthouse score >90
- <3s load time on 3G
- <100ms swipe response time