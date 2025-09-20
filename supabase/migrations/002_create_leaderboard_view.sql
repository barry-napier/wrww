-- Create materialized view for leaderboard
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
CREATE UNIQUE INDEX idx_leaderboard_unique ON leaderboard_view(content_id);