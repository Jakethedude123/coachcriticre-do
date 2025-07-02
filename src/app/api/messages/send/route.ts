import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { to, from, text } = await req.json();
    if (!to || !from || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const message = {
      to,
      from,
      text,
      read: false,
      createdAt: new Date().toISOString(),
    };
    await adminDb.collection('messages').add(message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
} 