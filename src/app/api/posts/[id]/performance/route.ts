import { NextRequest, NextResponse } from 'next/server';
import { getPostPerformance, getPost } from '@/lib/firebase/postUtils';
import { getCoach } from '@/lib/firebase/firebaseUtils';
import { auth } from '@/lib/firebase/firebaseAdmin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get coach profile to check if Pro user
    const coach = await getCoach(userId);
    if (!coach) {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });
    }

    // Check if user is Pro
    if (coach.subscription?.plan !== 'pro') {
      return NextResponse.json({ 
        error: 'Pro subscription required',
        message: 'Upgrade to Pro to unlock your post analytics and see who\'s engaging.'
      }, { status: 403 });
    }

    // Get post performance
    const performance = await getPostPerformance(postId);
    if (!performance) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if the post belongs to the requesting user
    const post = await getPost(postId);
    if (!post || post.coachId !== userId) {
      return NextResponse.json({ error: 'Unauthorized to view this post\'s analytics' }, { status: 403 });
    }

    return NextResponse.json({ performance });
  } catch (error) {
    console.error('Error fetching post performance:', error);
    return NextResponse.json({ error: 'Failed to fetch post performance' }, { status: 500 });
  }
} 