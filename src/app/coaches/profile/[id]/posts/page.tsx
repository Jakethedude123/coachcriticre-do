'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Post } from '@/lib/types/post';
import PostCard from '@/components/posts/PostCard';
import { getCoachPosts } from '@/lib/firebase/postUtils';

export default function CoachPostsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCoachPosts();
    }
  }, [id]);

  const fetchCoachPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const coachPosts = await getCoachPosts(id as string);
      setPosts(coachPosts);
    } catch (error) {
      console.error('Error fetching coach posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0D12] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0D12] flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchCoachPosts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0D12]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Posts</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {posts.length > 0 
              ? `${posts.length} post${posts.length === 1 ? '' : 's'} from this coach`
              : 'No posts yet from this coach'
            }
          </p>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUserId={user?.uid}
                onPostUpdated={fetchCoachPosts}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                This coach hasn't shared any posts yet.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 