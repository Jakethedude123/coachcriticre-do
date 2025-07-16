import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const bugReport = await req.json();

    // Validate required fields
    if (!bugReport.title || !bugReport.description || !bugReport.steps) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add timestamp and additional metadata
    const reportData = {
      ...bugReport,
      createdAt: serverTimestamp(),
      status: 'new',
      priority: 'medium', // You can implement priority logic based on keywords
    };

    // Store in Firestore
    const docRef = await addDoc(collection(db, 'bugReports'), reportData);

    // You can also send to external services like:
    // - Email notifications
    // - Slack/Discord webhooks
    // - Issue tracking systems (GitHub Issues, Jira, etc.)

    console.log('Bug report submitted:', {
      id: docRef.id,
      title: bugReport.title,
      url: bugReport.url,
      browser: bugReport.browser,
    });

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      message: 'Bug report submitted successfully' 
    });

  } catch (error) {
    console.error('Error submitting bug report:', error);
    return NextResponse.json(
      { error: 'Failed to submit bug report' },
      { status: 500 }
    );
  }
} 