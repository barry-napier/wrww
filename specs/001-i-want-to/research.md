# Research Findings: WRWW Technical Stack

## Executive Summary
This document consolidates technical research for the What Are We Watching (WRWW) voting leaderboard application. All technical decisions are based on performance requirements, scalability needs, and user experience priorities defined in the specification.

## 1. Real-time Updates: Supabase Realtime

### Decision: Supabase Postgres Changes with Optimized Tables
**Rationale**: Native integration with our database, automatic authorization, proven scalability

**Implementation Strategy**:
- Use separate public tables for high-traffic leaderboard data
- Single connection per browser tab with shared channels
- Implement proper indexes on vote aggregation queries
- Rate limits: 50 req/sec, 20 simultaneous connections per IP

**Alternatives Considered**:
- WebSockets: More complex setup, requires custom auth
- Server-Sent Events: One-directional, less flexible
- Polling: Higher latency, more server load

## 2. Movie/TV Data Source: TMDB API

### Decision: TMDB API with Aggressive Caching
**Rationale**: Most comprehensive movie/TV database, generous rate limits, free tier sufficient

**Implementation Strategy**:
- Cache movie metadata for minimum 1 hour
- Store popular content in Supabase for offline availability
- Rate limit: ~50 requests/second (no daily limit)
- Implement request queuing for burst scenarios

**Alternatives Considered**:
- OMDb API: Limited requests (1000/day free)
- IMDb API: No official API, scraping unreliable
- Custom database: Maintenance overhead, limited content

## 3. Swipe Gestures: Framer Motion

### Decision: Framer Motion for Comprehensive Gesture Support
**Rationale**: Built-in swipe detection, smooth animations, iOS-style interactions, active maintenance

**Implementation Strategy**:
- Use drag constraints for controlled swipes
- Implement velocity-based gesture completion
- Visual feedback during swipe (card rotation/opacity)
- Bundle size: 119KB (acceptable for core feature)

**Alternatives Considered**:
- React Spring: More complex API for simple swipes
- react-swipeable: Limited animation capabilities
- Custom implementation: Time-consuming, prone to bugs

## 4. Anonymous Voting: Multi-Layer Session Tracking

### Decision: Session Storage + Browser Fingerprinting + IP Tracking
**Rationale**: Balance between preventing abuse and maintaining anonymous access

**Implementation Strategy**:
- Primary: Session storage for vote tracking
- Secondary: Browser fingerprint (User-Agent + screen resolution)
- Tertiary: IP address for rate limiting
- Post-processing fraud detection for patterns

**Alternatives Considered**:
- Cookies only: Easily cleared by users
- IP only: Problems with shared networks
- Device ID: Privacy concerns, requires permissions

## 5. Framework Patterns: Next.js 14 App Router

### Decision: Server Components Default, Client for Interactivity
**Rationale**: Optimal performance, SEO benefits, secure API key handling

**Implementation Strategy**:
- Server Components: Leaderboard display, movie data fetch
- Client Components: Voting cards, swipe interactions, animations
- Parallel data fetching with Promise.all()
- Streaming with Suspense for progressive loading

**Alternatives Considered**:
- Pages Router: Legacy, less performant
- Client-only SPA: Poor SEO, slower initial load
- Static Generation: Not suitable for real-time data

## 6. Performance Optimizations

### Caching Strategy
- **TMDB Data**: 1 hour minimum cache
- **Leaderboard**: Real-time with 5-second debounce
- **User Votes**: Session storage + server validation
- **Images**: Next.js Image optimization + CDN

### Loading Strategy
- Initial page: <3s on 3G (server-rendered)
- Swipe response: <100ms (optimistic updates)
- Leaderboard update: <200ms (cached query)

## 7. Scalability Considerations

### Database Design
- Separate vote and aggregation tables
- Materialized views for leaderboard queries
- Proper indexing on vote_value, movie_id, created_at

### API Rate Management
- Queue system for TMDB requests
- Batch fetching for related data
- Circuit breaker for API failures

## 8. Security & Fraud Prevention

### Vote Integrity
- Session-based duplicate prevention
- Rate limiting per IP (max 1 vote/second)
- Anomaly detection for suspicious patterns
- "Fool the voter" approach (accept but don't count suspicious votes)

## Conclusion

These technical decisions provide a solid foundation for building WRWW with:
- Responsive swipe interactions (<100ms)
- Real-time leaderboard updates
- Scalable architecture for concurrent users
- Robust fraud prevention without authentication
- Optimal performance on mobile devices

All choices align with the constitutional principles of user-first experience, leaderboard integrity, and performance requirements.