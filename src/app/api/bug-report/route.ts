import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendEmail } from '@/lib/services/emailService';

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

    // Send email notification
    try {
      const emailSubject = `Bug Report - ${new Date().toLocaleDateString()}`;
      const emailBody = `
New Bug Report Submitted

Description: ${bugReport.description}

Steps to Reproduce: ${bugReport.steps}

Expected Behavior: ${bugReport.expectedBehavior || 'Not specified'}

Actual Behavior: ${bugReport.actualBehavior || 'Not specified'}

System Information:
- Browser: ${bugReport.browser}
- URL: ${bugReport.url}
- User Agent: ${bugReport.userAgent}
- Timestamp: ${new Date().toISOString()}

Report ID: ${docRef.id}
      `;

      await sendEmail({
        to: 'coachcriticllc@gmail.com',
        subject: emailSubject,
        text: emailBody,
      });

      console.log('Bug report email sent to coachcriticllc@gmail.com');
    } catch (emailError) {
      console.error('Failed to send bug report email:', emailError);
      // Don't fail the request if email fails
    }

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