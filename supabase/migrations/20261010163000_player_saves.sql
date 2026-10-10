CREATE TABLE public.player_saves (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  save_version INTEGER NOT NULL DEFAULT 1 CHECK (save_version > 0),
  payload JSONB NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.player_saves ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.player_saves FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.player_saves TO authenticated;

CREATE POLICY "Players can read their own save"
  ON public.player_saves
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Players can create their own save"
  ON public.player_saves
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Players can update their own save"
  ON public.player_saves
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE FUNCTION public.set_player_saves_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER player_saves_updated_at
  BEFORE UPDATE ON public.player_saves
  FOR EACH ROW
  EXECUTE FUNCTION public.set_player_saves_updated_at();
