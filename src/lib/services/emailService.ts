import sgMail from '@sendgrid/mail';

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Initialize SendGrid
try {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
} catch (error) {
  console.warn('Failed to initialize SendGrid:', error);
}

export async function sendEmail(emailData: EmailData): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid not initialized, skipping email');
    return;
  }

  try {
    const msg = {
      to: emailData.to,
      from: process.env.SENDGRID_FROM_EMAIL || 'notifications@coachcritic.com',
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html || emailData.text.replace(/\n/g, '<br>'),
    };

    await sgMail.send(msg);
    console.log('Email sent successfully to:', emailData.to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 