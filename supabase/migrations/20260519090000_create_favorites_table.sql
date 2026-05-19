-- Create a user favorites table for saved properties.
-- This table stores favorites per authenticated user and supports RLS.

CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE UNIQUE INDEX IF NOT EXISTS favorites_user_property_key
ON public.favorites (user_id, property_id);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users can select own favorites"
ON public.favorites
FOR SELECT
TO public
USING (auth.uid() = user_id);

CREATE POLICY "authenticated users can insert own favorites"
ON public.favorites
FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated users can delete own favorites"
ON public.favorites
FOR DELETE
TO public
USING (auth.uid() = user_id);
