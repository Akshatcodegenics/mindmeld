-- Create RPC functions for collaboration management
CREATE OR REPLACE FUNCTION public.increment_collaborators(collaboration_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.collaborations 
  SET current_collaborators = current_collaborators + 1 
  WHERE id = collaboration_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_collaborators(collaboration_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.collaborations 
  SET current_collaborators = GREATEST(current_collaborators - 1, 0)
  WHERE id = collaboration_id;
END;
$$;