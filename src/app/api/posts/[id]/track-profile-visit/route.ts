import { NextRequest, NextResponse } from 'next/server';
import { trackProfileVisitFromPost } from '@/lib/firebase/postUtils';
import { auth } from '@/lib/firebase/firebaseAdmin';

export async function POST(
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

    await trackProfileVisitFromPost(postId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking profile visit:', error);
    return NextResponse.json({ error: 'Failed to track profile visit' }, { status: 500 });
  }
} 