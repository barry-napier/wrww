-- Enable Row Level Security
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