<!-- Sync Impact Report
Version change: 1.0.0 (Initial constitution)
Modified principles: N/A (Initial creation)
Added sections: All sections initial
Removed sections: None
Templates requiring updates:
- ✅ plan-template.md (references constitution checks)
- ✅ spec-template.md (aligned with requirements)
- ✅ tasks-template.md (task categories reflect principles)
- ✅ CLAUDE.md (project guidance updated)
Follow-up TODOs: None
-->

# What Are We Watching (WRWW) Constitution

## Core Principles

### I. User-First Experience
Every feature must prioritize instant, frictionless user engagement. No authentication barriers - users can immediately interact with content through intuitive swipe gestures. The voting system (+1 right, -1 left, 0 up) must be responsive and provide immediate visual feedback. All UI decisions must support the core interaction loop of discover → vote → see results.

### II. Real-Time Leaderboard Integrity
The leaderboard is the application's core value proposition. Vote tallies must be accurate, consistent, and reflect real-time updates. Rankings must update dynamically as votes are cast. Data synchronization between client and Supabase must handle network interruptions gracefully. The system must prevent duplicate votes from the same session while maintaining anonymity.

### III. Component-Based Architecture
Follow Next.js best practices with clear separation of concerns. Components must be reusable, testable, and follow single responsibility principle. Use server components where appropriate for performance. Client components only when interactivity is required. Maintain consistent prop interfaces and typing throughout.

### IV. Performance & Responsiveness
Application must be optimized for mobile-first swipe interactions. Initial page load under 3 seconds on 3G networks. Swipe gestures must register within 100ms. Image loading must be progressive with appropriate placeholders. Use Next.js Image optimization and lazy loading for all media content.

### V. Data Source Integration
TMDB API integration must be abstracted and cached appropriately. API calls must handle rate limiting and failures gracefully. Movie/show metadata must be normalized and stored efficiently in Supabase. Fallback strategies required for API unavailability. Cache popular content aggressively to minimize API calls.

## Technology Standards

### Core Stack Requirements
- **Framework**: Next.js 14+ with App Router
- **Database**: Supabase (PostgreSQL + Realtime subscriptions)
- **Styling**: Tailwind CSS following the reference repository patterns
- **API Integration**: TMDB for movie/TV show data
- **State Management**: React hooks + Context for UI state, Supabase for persistent state
- **Deployment**: Vercel or similar edge-optimized platform

### Code Quality Standards
- TypeScript strict mode enforced
- ESLint + Prettier configuration matching Next.js standards
- Component files < 200 lines (extract sub-components as needed)
- Custom hooks for reusable logic
- Error boundaries for graceful failure handling

## Development Workflow

### Feature Development Process
1. Create feature specification documenting user stories
2. Design database schema changes in Supabase
3. Implement API routes/server actions first
4. Build UI components with mock data
5. Connect components to real data sources
6. Add gesture handling and animations
7. Test on actual mobile devices

### Testing Requirements
- Component testing for critical UI elements
- API route testing for vote submission/retrieval
- Database migration testing in staging environment
- Manual testing of swipe gestures on touch devices
- Performance testing for leaderboard updates

## Governance

### Amendment Process
Constitution amendments require documented rationale and impact assessment. Breaking changes to voting mechanics require data migration plan. UI/UX changes must preserve core swipe interaction model. Technology stack changes need performance benchmarks.

### Compliance & Review
All PRs must verify adherence to performance budgets. Database changes require migration scripts and rollback plans. API integrations must include rate limit handling. Security reviews required for any data collection changes.

### Project Guidance
Runtime development guidance maintained in CLAUDE.md. Architecture decisions documented in ADRs (Architecture Decision Records). Component patterns documented with Storybook or similar. Performance metrics tracked and visible in monitoring dashboard.

**Version**: 1.0.0 | **Ratified**: 2024-09-20 | **Last Amended**: 2024-09-20