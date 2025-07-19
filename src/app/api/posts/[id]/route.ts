import { NextRequest, NextResponse } from 'next/server';
import { getPost, deletePost, togglePostLike, addComment, trackPostView } from '@/lib/firebase/postUtils';
import { auth } from '@/lib/firebase/firebaseAdmin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    // Track post view
    await trackPostView(postId);
    
    const post = await getPost(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!auth) {
      return NextResponse.json({ error: 'Authentication not initialized' }, { status: 500 });
    }

    const postId = params.id;
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    await deletePost(postId, userId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!auth) {
      return NextResponse.json({ error: 'Authentication not initialized' }, { status: 500 });
    }

    const postId = params.id;
    const { action, ...data } = await request.json();
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    switch (action) {
      case 'like':
        await togglePostLike(postId, userId);
        break;
      case 'comment':
        const { content, userName, userAvatar } = data;
        if (!content || content.trim().length === 0) {
          return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
        }
        await addComment(postId, {
          userId,
          userName,
          userAvatar,
          content: content.trim(),
          likes: []
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
} 