import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const bugReport = await req.json();

    // Validate required fields
    if (!bugReport.description || !bugReport.steps) {
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

    // Log bug report details for easy viewing
    console.log('=== BUG REPORT SUBMITTED ===');
    console.log('Report ID:', docRef.id);
    console.log('Description:', bugReport.description);
    console.log('Steps:', bugReport.steps);
    console.log('Expected:', bugReport.expectedBehavior || 'Not specified');
    console.log('Actual:', bugReport.actualBehavior || 'Not specified');
    console.log('Browser:', bugReport.browser);
    console.log('URL:', bugReport.url);
    console.log('Timestamp:', new Date().toISOString());
    console.log('=== END BUG REPORT ===');

    console.log('Bug report submitted:', {
      id: docRef.id,
      description: bugReport.description.substring(0, 50) + '...',
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