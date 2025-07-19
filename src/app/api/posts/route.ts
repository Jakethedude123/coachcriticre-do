import { NextRequest, NextResponse } from 'next/server';
import { createPost, getPosts } from '@/lib/firebase/postUtils';
import { getCoach } from '@/lib/firebase/firebaseUtils';
import { auth } from '@/lib/firebase/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { content, imageFile, tags } = await request.json();
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get coach profile
    const coach = await getCoach(userId);
    if (!coach) {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });
    }

    // Validate input
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Content must be 1000 characters or less' }, { status: 400 });
    }

    if (tags && tags.length > 3) {
      return NextResponse.json({ error: 'Maximum 3 tags allowed' }, { status: 400 });
    }

    // Convert base64 image to File object if provided
    let imageFileObj = null;
    if (imageFile) {
      try {
        const base64Data = imageFile.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const mimeType = imageFile.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
        const extension = mimeType.split('/')[1];
        imageFileObj = new File([buffer], `post-image.${extension}`, { type: mimeType });
      } catch (error) {
        console.error('Error processing image:', error);
        return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
      }
    }

    // Create post
    const postId = await createPost(
      userId,
      coach.name,
      coach.avatar,
      0, // Default rating - can be updated later when rating system is implemented
      coach.subscription?.plan === 'pro',
      { content: content.trim(), imageFile: imageFileObj, tags: tags || [] }
    );

    return NextResponse.json({ success: true, postId });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') as 'all' | 'my-posts' | 'followed-tags' || 'all';
    const coachId = searchParams.get('coachId');
    const followedTags = searchParams.get('followedTags')?.split(',');

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decodedToken = await auth.verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (error) {
        // Continue without user authentication for public posts
      }
    }

    const filters = {
      filter,
      coachId: filter === 'my-posts' ? coachId : undefined,
      followedTags: filter === 'followed-tags' ? followedTags : undefined
    };

    const posts = await getPosts(filters);
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
} 