import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { to, from, text } = await req.json();
    console.log('[API/messages/send] Received:', { to, from, text });
    if (!to || !from || !text) {
      console.log('[API/messages/send] Missing fields:', { to, from, text });
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const message = {
      to,
      from,
      text,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const ref = await adminDb.collection('messages').add(message);
    console.log('[API/messages/send] Message written with ID:', ref.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API/messages/send] Error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
} 