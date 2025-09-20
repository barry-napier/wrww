# Quickstart Guide: WRWW Voting Leaderboard

## Prerequisites
- Node.js 18+ and npm installed
- Supabase account (free tier works)
- TMDB API key (free at themoviedb.org)
- Git installed

## Quick Setup (5 minutes)

### 1. Clone and Install
```bash
git clone https://github.com/barry-napier/wrww.git
cd wrww
npm install
```

### 2. Environment Configuration
Create `.env.local` in the root directory:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# TMDB
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-key
TMDB_API_READ_ACCESS_TOKEN=your-read-token

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup
Run the Supabase migrations:
```bash
npm run db:setup
```

This creates:
- Content table for movies/TV shows
- Votes table for user votes
- Leaderboard view for rankings
- Necessary indexes and constraints

### 4. Seed Initial Data
```bash
npm run db:seed
```

Fetches popular movies/shows from TMDB and populates the database.

### 5. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000 to see the app!

## Testing the Application

### Manual Test Checklist

#### 1. First Visit Experience
- [ ] Open the app in a new incognito window
- [ ] Verify you see a movie/TV show card ready to vote
- [ ] Check that no authentication is required

#### 2. Voting Functionality
- [ ] **Swipe Right**: Card moves right with green tint, +1 vote registered
- [ ] **Swipe Left**: Card moves left with red tint, -1 vote registered
- [ ] **Swipe Up**: Card moves up with gray tint, 0 vote registered
- [ ] Verify next card appears after each vote
- [ ] Check vote is saved (refresh page, voted content should not reappear)

#### 3. Leaderboard
- [ ] Navigate to leaderboard page
- [ ] Verify top 10 movies/shows are displayed
- [ ] Check rankings show vote counts and percentages
- [ ] Test category filter (genres, trending)
- [ ] Confirm leaderboard updates after voting

#### 4. Duplicate Vote Prevention
- [ ] Try voting on same content twice
- [ ] Verify duplicate vote is prevented
- [ ] Check error message appears appropriately

#### 5. Performance Tests
- [ ] Swipe gesture responds in <100ms
- [ ] Page loads in <3 seconds on throttled 3G
- [ ] Leaderboard query completes in <200ms

### Automated Test Suite
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests (app must be running)
npm run test:e2e
```

## Common User Flows

### Flow 1: New User Voting
1. User visits homepage
2. Sees first movie card with poster and info
3. Swipes right to upvote
4. Next card automatically appears
5. Continues voting on multiple items
6. Checks leaderboard to see impact

### Flow 2: Exploring Categories
1. User opens category menu
2. Selects "Action" genre
3. Voting cards filtered to action movies
4. Views action movie leaderboard
5. Switches to "Trending" to see recent popular items

### Flow 3: Detailed Information
1. User sees interesting movie card
2. Taps card for more details
3. Views cast, director, full description
4. Makes informed voting decision
5. Returns to voting interface

## Troubleshooting

### Issue: No content cards appearing
**Solution**: Run `npm run db:seed` to populate database with movies/shows

### Issue: Votes not saving
**Solution**: Check Supabase connection in `.env.local` and verify RLS policies

### Issue: Slow performance
**Solution**:
- Ensure materialized view is refreshed: `npm run db:refresh-leaderboard`
- Check database indexes are created
- Verify image optimization is working

### Issue: TMDB rate limiting
**Solution**: Implement caching layer or reduce API calls frequency

## Development Commands

```bash
# Start dev server
npm run dev

# Build production
npm run build

# Run production build
npm run start

# Lint and format
npm run lint
npm run format

# Database commands
npm run db:setup       # Initial setup
npm run db:migrate     # Run migrations
npm run db:seed        # Seed data
npm run db:reset       # Reset everything

# Testing
npm run test          # All tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Production Deployment

### Vercel Deployment (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main

### Manual Deployment
```bash
npm run build
npm run start
```

## Monitoring

### Key Metrics to Track
- Vote submission rate
- Leaderboard query time
- Active sessions
- Error rate
- TMDB API usage

### Suggested Tools
- Supabase Dashboard for database metrics
- Vercel Analytics for performance
- Sentry for error tracking

## Next Steps

After successful setup:
1. Customize UI theme in `tailwind.config.js`
2. Add more categories in the database
3. Implement social sharing features
4. Set up monitoring and analytics
5. Configure CDN for images

## Support

- Documentation: [/docs](./docs)
- Issues: [GitHub Issues](https://github.com/barry-napier/wrww/issues)
- Constitution: [.specify/memory/constitution.md](.specify/memory/constitution.md)