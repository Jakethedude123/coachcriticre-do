'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { FaEye, FaHeart, FaComment, FaShare, FaImage, FaUser, FaLock, FaChartLine } from 'react-icons/fa';
import { Post, PostAnalytics } from '@/lib/types/post';
import { getCoachPosts } from '@/lib/firebase/postUtils';
import { auth } from '@/lib/firebase/firebase';

export default function PostPerformance() {
  const { user, isCoach } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [performanceData, setPerformanceData] = useState<PostAnalytics | null>(null);
  const [isProUser, setIsProUser] = useState(false);

  useEffect(() => {
    if (user && isCoach) {
      fetchPosts();
    }
  }, [user, isCoach]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const userPosts = await getCoachPosts(user!.uid);
      setPosts(userPosts);
      
      // Check if user is Pro
      const token = await user?.getIdToken();
      if (token) {
        const response = await fetch(`/api/coaches/${user!.uid}`);
        if (response.ok) {
          const coachData = await response.json();
          setIsProUser(coachData.subscription?.plan === 'pro');
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostPerformance = async (postId: string) => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/posts/${postId}/performance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPerformanceData(data.performance);
      } else if (response.status === 403) {
        // User is not Pro
        setPerformanceData(null);
      }
    } catch (error) {
      console.error('Error fetching post performance:', error);
    }
  };

  const handlePostSelect = (post: Post) => {
    setSelectedPost(post);
    if (isProUser) {
      fetchPostPerformance(post.id);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const calculateEngagementRate = (analytics: PostAnalytics) => {
    if (analytics.views === 0) return 0;
    return ((analytics.likes + analytics.comments + analytics.shares) / analytics.views * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#181d23] rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#181d23] rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white">Post Performance</h2>
        {!isProUser && (
          <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
            <FaLock className="text-sm" />
            <span className="text-sm font-medium">Pro Feature</span>
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8">
          <FaChartLine className="text-4xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No posts yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Create your first post to see performance analytics</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts List */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">Your Posts</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostSelect(post)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedPost?.id === post.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Post"
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black dark:text-white font-medium truncate">
                        {post.content.substring(0, 60)}...
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatNumber(post.analytics.views)} views</span>
                        <span>{formatNumber(post.analytics.likes)} likes</span>
                        <span>{formatNumber(post.comments.length)} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Details */}
          <div className="lg:col-span-2">
            {selectedPost ? (
              <div>
                <h3 className="text-lg font-medium text-black dark:text-white mb-4">Performance Details</h3>
                
                {isProUser && performanceData ? (
                  <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 dark:bg-[#232b36] p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaEye className="text-blue-500" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Views</span>
                        </div>
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {formatNumber(performanceData.views)}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-[#232b36] p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaHeart className="text-red-500" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Likes</span>
                        </div>
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {formatNumber(performanceData.likes)}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-[#232b36] p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaComment className="text-green-500" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</span>
                        </div>
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {formatNumber(performanceData.comments)}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-[#232b36] p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaShare className="text-purple-500" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Shares</span>
                        </div>
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {formatNumber(performanceData.shares)}
                        </p>
                      </div>
                    </div>

                    {/* Engagement Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-[#232b36] p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaImage className="text-blue-500" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Image Clicks</span>
                        </div>
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {formatNumber(performanceData.imageClicks)}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-[#232b36] p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaUser className="text-green-500" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Visits</span>
                        </div>
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {formatNumber(performanceData.profileVisits)}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-[#232b36] p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaChartLine className="text-purple-500" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {calculateEngagementRate(performanceData)}%
                        </p>
                      </div>
                    </div>

                    {/* Post Content Preview */}
                    <div className="bg-gray-50 dark:bg-[#232b36] p-4 rounded-lg">
                      <h4 className="font-medium text-black dark:text-white mb-2">Post Content</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {selectedPost.content}
                      </p>
                      {selectedPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedPost.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaLock className="text-4xl text-yellow-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-black dark:text-white mb-2">
                      Upgrade to Pro
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Unlock your post analytics and see who's engaging with your content
                    </p>
                    <div className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <span>••••••••</span>
                        <span>Views</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span>••••••••</span>
                        <span>Image Clicks</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span>••••••••</span>
                        <span>Profile Visits</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaChartLine className="text-4xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Select a post to view performance details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 