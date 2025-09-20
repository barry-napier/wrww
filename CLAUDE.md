# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

What Are We Watching (WRWW) is a movie/TV show leaderboard application where users vote on content through swipe gestures without authentication. Users swipe right (+1), left (-1), or up (haven't seen/0) to build dynamic leaderboards for different categories of movies and TV shows.

## Commands

### Development
- `npm run dev` - Start the Next.js development server
- `npm run build` - Production build with TypeScript checking
- `npm run start` - Run production server
- `npm run lint` - Run ESLint checks

### Setup
1. Clone the repository
2. Run `npm install` to install dependencies
3. Configure environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
   - `NEXT_PUBLIC_TMDB_API_KEY` - Your TMDB API key
   - `TMDB_API_READ_ACCESS_TOKEN` - TMDB read access token
4. Set up Supabase database tables for votes and leaderboards
5. Run `npm run dev` to start development

## Architecture

### Core Features
- **Swipe Voting System**: Touch gesture handling for voting (+1 right, -1 left, 0 up)
- **Real-time Leaderboards**: Dynamic rankings updated as votes are cast
- **Category Browsing**: Separate leaderboards for movies and TV shows by genre
- **Anonymous Voting**: No authentication required, session-based duplicate prevention

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL + Realtime)
- **Styling**: Tailwind CSS
- **API**: TMDB for movie/show data
- **State**: React hooks + Supabase real-time subscriptions
- **Gestures**: Framer Motion or React Spring for swipe animations

### Project Structure
```
/app                    # Next.js app directory
  /api                 # API routes for vote handling
  /(routes)            # Page components
/components            # Reusable React components
  /ui                  # Base UI components
  /voting              # Swipe and voting components
  /leaderboard         # Leaderboard display components
/lib                   # Utilities and helpers
  /supabase            # Supabase client and queries
  /tmdb                # TMDB API integration
/hooks                 # Custom React hooks
/types                 # TypeScript type definitions
```

## Key Technical Decisions

1. **Next.js over plain React**: Server components, API routes, and built-in optimizations
2. **Supabase for backend**: Real-time subscriptions, PostgreSQL, and no auth complexity
3. **Session-based voting**: Using browser session storage to prevent duplicates without auth
4. **Mobile-first design**: Optimized for touch gestures and small screens
5. **TypeScript**: Full type safety across the application

## Database Schema (Supabase)

```sql
-- Movies/Shows table (cached from TMDB)
movies (
  id: bigint (TMDB ID),
  title: text,
  type: enum ('movie', 'tv'),
  poster_path: text,
  overview: text,
  genres: jsonb,
  release_date: date
)

-- Votes table
votes (
  id: uuid,
  movie_id: bigint (FK),
  vote_value: smallint (-1, 0, 1),
  session_id: text,
  created_at: timestamp
)

-- Leaderboard view (materialized)
leaderboard (
  movie_id: bigint,
  total_score: integer,
  positive_votes: integer,
  negative_votes: integer,
  neutral_votes: integer,
  rank: integer
)
```

## Important Notes

- Reference UI/UX patterns from https://github.com/sudeepmahato16/movie-app
- Use TMDB API for movie/show data (requires API key)
- Implement rate limiting for vote submissions
- Cache TMDB responses in Supabase to reduce API calls
- Consider implementing WebSocket connections for real-time leaderboard updates