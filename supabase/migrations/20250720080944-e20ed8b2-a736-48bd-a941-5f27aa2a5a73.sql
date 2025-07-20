-- Create RPC functions for post likes management
CREATE OR REPLACE FUNCTION public.increment_likes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts 
  SET likes_count = likes_count + 1 
  WHERE id = post_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_likes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts 
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = post_id;
END;
$$;