import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const { to, from, text } = await req.json();
    console.log('[API/messages/send] Received:', { to, from, text });
    if (!to || !from || !text) {
      console.log('[API/messages/send] Missing fields:', { to, from, text });
      const resp = { error: 'Missing fields' };
      console.log('[API/messages/send] Response:', resp);
      return NextResponse.json(resp, { status: 400 });
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
    const resp = { success: true };
    console.log('[API/messages/send] Response:', resp);
    return NextResponse.json(resp);
  } catch (error) {
    console.error('[API/messages/send] Error:', error);
    const resp = { error: 'Failed to send message' };
    console.log('[API/messages/send] Response:', resp);
    return NextResponse.json(resp, { status: 500 });
  }
  // Defensive: never return undefined
  const resp = { error: 'Unknown error' };
  console.log('[API/messages/send] Response:', resp);
  return NextResponse.json(resp, { status: 500 });
} 