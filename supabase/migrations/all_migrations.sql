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
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();-- Create materialized view for leaderboard
CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard_view AS
SELECT
  c.id as content_id,
  c.title,
  c.poster_path,
  c.type,
  c.genres as genre_ids,
  c.release_date,
  c.rating as tmdb_rating,
  COALESCE(SUM(v.vote_value), 0)::INTEGER as total_score,
  COUNT(CASE WHEN v.vote_value = 1 THEN 1 END)::INTEGER as positive_votes,
  COUNT(CASE WHEN v.vote_value = -1 THEN 1 END)::INTEGER as negative_votes,
  COUNT(CASE WHEN v.vote_value = 0 THEN 1 END)::INTEGER as neutral_votes,
  COUNT(v.id)::INTEGER as total_votes,
  RANK() OVER (PARTITION BY c.type ORDER BY SUM(v.vote_value) DESC NULLS LAST)::INTEGER as rank,
  MAX(v.created_at) as last_voted
FROM content c
LEFT JOIN votes v ON c.id = v.content_id
GROUP BY c.id, c.title, c.poster_path, c.type, c.genres, c.release_date, c.rating
WITH DATA;

-- Create indexes for leaderboard queries
CREATE INDEX idx_leaderboard_rank ON leaderboard_view(type, rank);
CREATE INDEX idx_leaderboard_score ON leaderboard_view(total_score DESC);
CREATE INDEX idx_leaderboard_genres ON leaderboard_view USING GIN(genre_ids);
CREATE INDEX idx_leaderboard_content_id ON leaderboard_view(content_id);

-- Function to refresh leaderboard (called periodically)
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_view;
END;
$$ LANGUAGE plpgsql;

-- Create unique index required for concurrent refresh
CREATE UNIQUE INDEX idx_leaderboard_unique ON leaderboard_view(content_id);-- Enable Row Level Security
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

-- Content policies (read-only for everyone)
CREATE POLICY "Content is viewable by everyone"
  ON content FOR SELECT
  USING (true);

-- Votes policies
-- Allow inserts from authenticated sessions
CREATE POLICY "Votes can be inserted by anyone"
  ON votes FOR INSERT
  WITH CHECK (true);

-- Allow viewing own votes
CREATE POLICY "Users can view their own votes"
  ON votes FOR SELECT
  USING (true);

-- Prevent updates and deletes (votes are immutable)
CREATE POLICY "Votes cannot be updated"
  ON votes FOR UPDATE
  USING (false);

CREATE POLICY "Votes cannot be deleted"
  ON votes FOR DELETE
  USING (false);

-- Genres policies (read-only for everyone)
CREATE POLICY "Genres are viewable by everyone"
  ON genres FOR SELECT
  USING (true);

-- Create function for safe vote insertion with duplicate check
CREATE OR REPLACE FUNCTION insert_vote(
  p_content_id BIGINT,
  p_vote_value SMALLINT,
  p_session_id TEXT,
  p_ip_hash TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_vote_id UUID;
  v_existing_vote UUID;
BEGIN
  -- Check for existing vote
  SELECT id INTO v_existing_vote
  FROM votes
  WHERE content_id = p_content_id
    AND session_id = p_session_id;

  IF v_existing_vote IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'duplicate_vote',
      'message', 'You have already voted on this content'
    );
  END IF;

  -- Insert new vote
  INSERT INTO votes (content_id, vote_value, session_id, ip_hash, user_agent)
  VALUES (p_content_id, p_vote_value, p_session_id, p_ip_hash, p_user_agent)
  RETURNING id INTO v_vote_id;

  RETURN json_build_object(
    'success', true,
    'vote_id', v_vote_id,
    'message', 'Vote recorded successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;