import { db, storage } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Post, CreatePostData, PostAnalytics, Comment, PostFilters } from '../types/post';
import { DEFAULT_POST_ANALYTICS } from '../types/post';

// Create a new post
export async function createPost(
  coachId: string, 
  coachName: string, 
  coachAvatar: string | undefined,
  coachRating: number | undefined,
  isProUser: boolean,
  postData: CreatePostData
): Promise<string> {
  try {
    let imageUrl = '';
    
    // Upload image if provided
    if (postData.imageFile) {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileExtension = postData.imageFile.name.split('.').pop();
      const filename = `posts/${coachId}/${timestamp}_${randomString}.${fileExtension}`;
      
      const imageRef = ref(storage, filename);
      await uploadBytes(imageRef, postData.imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    // Create post document
    const postRef = await addDoc(collection(db, 'posts'), {
      coachId,
      coachName,
      coachAvatar,
      coachRating,
      content: postData.content,
      imageUrl,
      tags: postData.tags,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: [],
      comments: [],
      analytics: DEFAULT_POST_ANALYTICS,
      isProUser
    });

    return postRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    throw new Error(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get posts with filters
export async function getPosts(filters: PostFilters = { filter: 'all' }, lastPost?: Post): Promise<Post[]> {
  try {
    let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20));
    
    if (lastPost) {
      q = query(q, startAfter(lastPost.createdAt));
    }

    // Apply filters
    if (filters.filter === 'my-posts' && filters.coachId) {
      q = query(q, where('coachId', '==', filters.coachId));
    } else if (filters.filter === 'followed-tags' && filters.followedTags?.length) {
      q = query(q, where('tags', 'array-contains-any', filters.followedTags));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    throw new Error(`Failed to fetch posts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get posts by a specific coach
export async function getCoachPosts(coachId: string): Promise<Post[]> {
  try {
    const q = query(
      collection(db, 'posts'),
      where('coachId', '==', coachId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  } catch (error) {
    console.error('Error fetching coach posts:', error);
    throw new Error('Failed to fetch coach posts');
  }
}

// Get a single post by ID
export async function getPost(postId: string): Promise<Post | null> {
  try {
    const docRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Post;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }
}

// Update post analytics
export async function updatePostAnalytics(postId: string, metric: keyof PostAnalytics, incrementValue: number = 1): Promise<void> {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      [`analytics.${metric}`]: increment(incrementValue),
      [`analytics.history`]: arrayUnion({
        date: new Date().toISOString(),
        metric,
        value: incrementValue
      })
    });
  } catch (error) {
    console.error('Error updating post analytics:', error);
    throw new Error('Failed to update post analytics');
  }
}

// Like/unlike a post
export async function togglePostLike(postId: string, userId: string): Promise<void> {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('Post not found');
    }
    
    const post = postSnap.data() as Post;
    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
        'analytics.likes': increment(-1)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        'analytics.likes': increment(1)
      });
    }
  } catch (error) {
    console.error('Error toggling post like:', error);
    throw new Error('Failed to toggle post like');
  }
}

// Add comment to post
export async function addComment(postId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<string> {
  try {
    const commentData: Comment = {
      ...comment,
      id: Math.random().toString(36).substring(7),
      createdAt: Timestamp.now()
    };
    
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: arrayUnion(commentData),
      'analytics.comments': increment(1)
    });
    
    return commentData.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
}

// Delete a post
export async function deletePost(postId: string, coachId: string): Promise<void> {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('Post not found');
    }
    
    const post = postSnap.data() as Post;
    
    // Only allow the post author to delete
    if (post.coachId !== coachId) {
      throw new Error('Unauthorized to delete this post');
    }
    
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
}

// Get post performance analytics for Pro users
export async function getPostPerformance(postId: string): Promise<PostAnalytics | null> {
  try {
    const post = await getPost(postId);
    return post?.analytics || null;
  } catch (error) {
    console.error('Error fetching post performance:', error);
    throw new Error('Failed to fetch post performance');
  }
}

// Track post view
export async function trackPostView(postId: string): Promise<void> {
  try {
    await updatePostAnalytics(postId, 'views');
  } catch (error) {
    console.error('Error tracking post view:', error);
  }
}

// Track image click
export async function trackImageClick(postId: string): Promise<void> {
  try {
    await updatePostAnalytics(postId, 'imageClicks');
  } catch (error) {
    console.error('Error tracking image click:', error);
  }
}

// Track profile visit from post
export async function trackProfileVisitFromPost(postId: string): Promise<void> {
  try {
    await updatePostAnalytics(postId, 'profileVisits');
  } catch (error) {
    console.error('Error tracking profile visit:', error);
  }
} 