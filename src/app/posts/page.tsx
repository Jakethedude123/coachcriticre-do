'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { FaPlus, FaImage, FaTimes, FaHeart, FaComment, FaShare, FaEllipsisH, FaCrown } from 'react-icons/fa';
import { Post, POST_TAGS } from '@/lib/types/post';
import PostCard from '@/components/posts/PostCard';
import CreatePostModal from '@/components/posts/CreatePostModal';
import { getPosts } from '@/lib/firebase/postUtils';
import { auth } from '@/lib/firebase/firebase';

export default function PostsPage() {
  const { user, isCoach, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'my-posts' | 'followed-tags'>('all');
  const [followedTags, setFollowedTags] = useState<string[]>([]);

  useEffect(() => {
    if (!loading) {
      fetchPosts();
    }
  }, [loading, filter, followedTags]);

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const token = await user?.getIdToken();
      
      const params = new URLSearchParams({
        filter,
        ...(filter === 'my-posts' && { coachId: user?.uid || '' }),
        ...(filter === 'followed-tags' && followedTags.length > 0 && { followedTags: followedTags.join(',') })
      });

      const response = await fetch(`/api/posts?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleCreatePost = () => {
    if (!user) {
      router.push('/login?message=' + encodeURIComponent('Please log in to create posts'));
      return;
    }
    if (!isCoach) {
      router.push('/coaches/create?message=' + encodeURIComponent('You must be a coach to create posts'));
      return;
    }
    setShowCreateModal(true);
  };

  const handlePostCreated = () => {
    setShowCreateModal(false);
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0D12] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0D12]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Posts</h1>
          <p className="text-gray-600 dark:text-gray-400">Share insights, tips, and transformations with the community</p>
        </div>

        {/* Create Post Box */}
        <div className="bg-white dark:bg-[#181d23] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div 
            className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#232b36] rounded-lg p-4 transition-colors"
            onClick={handleCreatePost}
          >
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <FaPlus className="text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-500 dark:text-gray-400">
                Share a tip, transformation, or insight...
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <FaImage />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'my-posts' | 'followed-tags')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#181d23] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Posts</option>
            {user && <option value="my-posts">My Posts</option>}
            <option value="followed-tags">Followed Tags</option>
          </select>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {loadingPosts ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUserId={user?.uid}
                onPostUpdated={fetchPosts}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                {filter === 'all' && 'No posts yet. Be the first to share!'}
                {filter === 'my-posts' && 'You haven\'t created any posts yet.'}
                {filter === 'followed-tags' && 'No posts found for your followed tags.'}
              </div>
              {filter === 'my-posts' && (
                <button
                  onClick={handleCreatePost}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
} 