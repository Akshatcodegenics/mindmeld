import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DiscoverPost {
  id: string;
  title: string;
  excerpt: string | null;
  author: string;
  reading_time: number | null;
  likes_count: number;
  views_count: number;
  category: string | null;
  featured_image_url: string | null;
  created_at: string;
  profiles?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export const useDiscoverPosts = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<DiscoverPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const POSTS_PER_PAGE = 6;

  const mockPosts: DiscoverPost[] = [
    {
      id: 'mock-1',
      title: 'The Art of Digital Storytelling in the Modern Age',
      excerpt: 'Exploring how technology is reshaping the way we tell and consume stories in the digital era.',
      author: 'Sarah Chen',
      reading_time: 5,
      likes_count: 124,
      views_count: 2847,
      category: 'Technology',
      featured_image_url: null,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      profiles: {
        display_name: 'Sarah Chen',
        username: 'sarahc',
        avatar_url: null
      }
    },
    {
      id: 'mock-2',
      title: 'Climate Change: Stories from the Frontlines',
      excerpt: 'Personal narratives from communities directly affected by climate change around the world.',
      author: 'Marcus Johnson',
      reading_time: 8,
      likes_count: 89,
      views_count: 1653,
      category: 'Environment',
      featured_image_url: null,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      profiles: {
        display_name: 'Marcus Johnson',
        username: 'marcusj',
        avatar_url: null
      }
    },
    {
      id: 'mock-3',
      title: 'The Psychology of Creative Writing',
      excerpt: 'Understanding the mental processes behind creativity and how to overcome writer\'s block.',
      author: 'Dr. Emily Rodriguez',
      reading_time: 6,
      likes_count: 156,
      views_count: 3291,
      category: 'Psychology',
      featured_image_url: null,
      created_at: new Date(Date.now() - 259200000).toISOString(),
      profiles: {
        display_name: 'Dr. Emily Rodriguez',
        username: 'emilyrod',
        avatar_url: null
      }
    },
    {
      id: 'mock-4',
      title: 'Building Empathy Through Narrative',
      excerpt: 'How storytelling can bridge divides and help us understand different perspectives.',
      author: 'Alex Thompson',
      reading_time: 4,
      likes_count: 67,
      views_count: 1429,
      category: 'Social Impact',
      featured_image_url: null,
      created_at: new Date(Date.now() - 345600000).toISOString(),
      profiles: {
        display_name: 'Alex Thompson',
        username: 'alexthompson',
        avatar_url: null
      }
    },
    {
      id: 'mock-5',
      title: 'The Future of AI in Creative Industries',
      excerpt: 'Examining the role of artificial intelligence in writing, art, and creative expression.',
      author: 'David Park',
      reading_time: 7,
      likes_count: 203,
      views_count: 4567,
      category: 'Technology',
      featured_image_url: null,
      created_at: new Date(Date.now() - 432000000).toISOString(),
      profiles: {
        display_name: 'David Park',
        username: 'davidpark',
        avatar_url: null
      }
    },
    {
      id: 'mock-6',
      title: 'Preserving Cultural Stories in the Digital Age',
      excerpt: 'The importance of documenting and sharing traditional narratives for future generations.',
      author: 'Maria Santos',
      reading_time: 5,
      likes_count: 98,
      views_count: 2156,
      category: 'Culture',
      featured_image_url: null,
      created_at: new Date(Date.now() - 518400000).toISOString(),
      profiles: {
        display_name: 'Maria Santos',
        username: 'mariasantos',
        avatar_url: null
      }
    }
  ];

  const fetchPosts = async (page: number = 0, search: string = '') => {
    setLoading(true);
    try {
      // First try to fetch from database
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(display_name, username, avatar_url)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
      }

      const { data: dbPosts, error } = await query
        .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1);

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      // Convert database posts to DiscoverPost format
      const formattedDbPosts: DiscoverPost[] = (dbPosts || []).map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        author: 'Database User', // Simplified for now
        reading_time: post.reading_time,
        likes_count: post.likes_count || 0,
        views_count: post.views_count || 0,
        category: post.category,
        featured_image_url: post.featured_image_url,
        created_at: post.created_at,
        profiles: {
          display_name: 'Database User',
          username: 'user',
          avatar_url: null
        }
      }));

      // Filter mock posts by search if searching
      let filteredMockPosts = mockPosts;
      if (search) {
        filteredMockPosts = mockPosts.filter(post =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
          post.author.toLowerCase().includes(search.toLowerCase()) ||
          post.category?.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Paginate mock posts
      const startIndex = page * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;
      const paginatedMockPosts = filteredMockPosts.slice(startIndex, endIndex);

      // Combine database posts with mock posts
      const allPosts = [...formattedDbPosts, ...paginatedMockPosts];

      if (page === 0) {
        setPosts(allPosts);
      } else {
        setPosts(prev => [...prev, ...allPosts]);
      }

      // Check if there are more posts
      setHasMore(allPosts.length === POSTS_PER_PAGE);

    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({ title: 'Failed to load posts', variant: 'destructive' });
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchPosts(nextPage, searchQuery);
    }
  };

  const search = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
    setIsSearching(true);
    fetchPosts(0, query);
  };

  const likePost = async (postId: string) => {
    try {
      // Update local state optimistically
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: post.likes_count + 1 }
          : post
      ));

      // Only try to update database for real posts (not mock posts)
      if (!postId.startsWith('mock-')) {
        const { error } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: 'anonymous' }); // For anonymous users

        if (error) {
          // Revert optimistic update on error
          setPosts(prev => prev.map(post => 
            post.id === postId 
              ? { ...post, likes_count: Math.max(0, post.likes_count - 1) }
              : post
          ));
          throw error;
        }
      }

      toast({ title: 'Post liked!' });
    } catch (error) {
      console.error('Error liking post:', error);
      toast({ title: 'Failed to like post', variant: 'destructive' });
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    hasMore,
    isSearching,
    searchQuery,
    loadMore,
    search,
    likePost,
    refresh: () => {
      setCurrentPage(0);
      fetchPosts(0, searchQuery);
    }
  };
};