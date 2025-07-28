-- Create the missing foreign key relationship between posts and profiles
ALTER TABLE public.posts 
ADD CONSTRAINT posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create the profiles table if it doesn't exist with proper relationships
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic profile creation when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add sample posts data for demonstration
INSERT INTO public.posts (title, content, excerpt, user_id, published, reading_time, views_count, likes_count) VALUES
('The Future of AI in Creative Writing', 'Artificial Intelligence is revolutionizing the way we approach creative writing. From generating ideas to polishing prose, AI tools are becoming indispensable companions for writers across all genres...', 'Exploring how AI is transforming the creative writing landscape', auth.uid(), true, 5, 1234, 89),
('Building Sustainable Communities', 'In an era of rapid urbanization, creating sustainable communities has become more important than ever. This comprehensive guide explores practical strategies for developing eco-friendly neighborhoods...', 'A comprehensive guide to creating eco-friendly neighborhoods', auth.uid(), true, 8, 2156, 134),
('The Art of Digital Storytelling', 'Digital storytelling combines traditional narrative techniques with modern technology to create compelling experiences. This post explores the fundamental principles and tools needed to master this craft...', 'Mastering the craft of digital narrative', auth.uid(), true, 6, 987, 76),
('Climate Change Solutions for the Next Decade', 'As we face the climate crisis, innovative solutions are emerging from unexpected places. This article examines cutting-edge technologies and community initiatives that are making a real difference...', 'Innovative approaches to tackle climate change', auth.uid(), true, 10, 3421, 198),
('The Psychology of Remote Work', 'Remote work has fundamentally changed how we think about productivity, collaboration, and work-life balance. This deep dive explores the psychological aspects of working from home...', 'Understanding the mental aspects of remote work', auth.uid(), true, 7, 1876, 112);

-- Create a default profile for the current user if they don't have one
INSERT INTO public.profiles (user_id, username, display_name) 
SELECT auth.uid(), 'writer', 'Content Writer'
WHERE auth.uid() IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid());