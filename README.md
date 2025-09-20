# WRWW - What Are We Watching

A movie and TV show voting leaderboard application where users can swipe to vote without authentication.

## Features

- 🎬 Swipe-based voting interface for movies and TV shows
- 🏆 Real-time leaderboard with top 10 rankings
- 🎯 Category filtering by genre and content type
- 📱 Mobile-first responsive design
- 🚀 No authentication required - session-based voting
- ⚡ Optimistic UI updates for instant feedback

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Data Source**: TMDB API
- **State Management**: React Query

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- TMDB API key (free at themoviedb.org)

## Quick Start

1. **Clone and install dependencies:**
```bash
git clone https://github.com/your-username/wrww.git
cd wrww
npm install
```

2. **Set up environment variables:**

Copy `.env.local.example` to `.env.local` and fill in your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key
TMDB_API_READ_ACCESS_TOKEN=your-tmdb-read-token
```

3. **Set up the database:**

Run the migrations in your Supabase SQL editor (files in `supabase/migrations/`):
- `001_create_tables.sql`
- `002_create_leaderboard_view.sql`
- `003_row_level_security.sql`

4. **Start the development server:**
```bash
npm run dev
```

Visit http://localhost:3000 to see the app!

## Project Structure

```
wrww/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── leaderboard/       # Leaderboard page
│   └── page.tsx           # Home/voting page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── voting/           # Voting interface components
│   └── leaderboard/      # Leaderboard components
├── lib/                   # Core libraries
│   ├── supabase/         # Database client
│   ├── tmdb/             # TMDB API client
│   ├── repositories/     # Data access layer
│   ├── services/         # Business logic
│   └── middleware/       # API middleware
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
└── supabase/            # Database migrations
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## License

MIT

## Acknowledgments

- Movie and TV data provided by [TMDB](https://www.themoviedb.org)
- Built with Next.js and Supabase
