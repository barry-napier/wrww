-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Content table (movies and TV shows)
CREATE TABLE IF NOT EXISTS content (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('movie', 'tv')) NOT NULL,
  poster_path TEXT,
  backdrop_path TEXT,
  overview TEXT,
  genres INTEGER[] DEFAULT '{}',
  release_date DATE,
  rating DECIMAL(3,1),
  vote_count INTEGER DEFAULT 0,
  popularity DECIMAL(10,2),
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for content
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_genres ON content USING GIN(genres);
CREATE INDEX idx_content_popularity ON content(popularity DESC);
CREATE INDEX idx_content_release ON content(release_date DESC);
CREATE INDEX idx_content_cached_at ON content(cached_at);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id BIGINT REFERENCES content(id) ON DELETE CASCADE,
  vote_value SMALLINT CHECK (vote_value IN (-1, 0, 1)) NOT NULL,
  session_id TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for votes
CREATE INDEX idx_votes_content ON votes(content_id);
CREATE INDEX idx_votes_session ON votes(session_id, content_id);
CREATE INDEX idx_votes_created ON votes(created_at DESC);
CREATE UNIQUE INDEX idx_votes_unique ON votes(session_id, content_id);

-- Genres table
CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('movie', 'tv')) NOT NULL
);

-- Unique constraint for genres
CREATE UNIQUE INDEX idx_genres_unique ON genres(id, type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();