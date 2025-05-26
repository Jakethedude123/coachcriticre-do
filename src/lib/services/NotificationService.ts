import { Coach } from '../firebase/models/coach';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

type Analytics = {
  profileViews: number;
  messagesSent: number;
  inquiriesReceived: number;
  clientsGained: number;
  searchAppearances: number;
  profileClicks: number;
  history: Array<{
    date: string;
    metric: string;
    value: number;
  }>;
};

// Initialize SendGrid
let sgMailInitialized = false;
if (process.env.SENDGRID_API_KEY) {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMailInitialized = true;
  } catch (error) {
    console.warn('Failed to initialize SendGrid:', error);
  }
}

// Initialize Twilio
let twilioClient: twilio.Twilio | null = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (error) {
    console.warn('Failed to initialize Twilio:', error);
  }
}

export class NotificationService {
  private static async sendEmail(to: string, subject: string, text: string, html: string) {
    if (!sgMailInitialized) {
      console.warn('SendGrid not initialized, skipping email notification');
      return;
    }

    try {
      await sgMail.send({
        to,
        from: process.env.SENDGRID_FROM_EMAIL || 'notifications@coachcritic.com',
        subject,
        text,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  private static async sendSMS(to: string, message: string) {
    if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
      console.warn('Twilio not initialized, skipping SMS notification');
      return;
    }

    try {
      await twilioClient.messages.create({
        body: message,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }

  static async notifyProfileView(coach: Coach) {
    // Skip notifications if preferences are not set
    if (!coach.notificationPreferences) return;

    const { notificationPreferences, name } = coach;

    // Email notification
    if (notificationPreferences.email.enabled && notificationPreferences.email.notifications.profileViews) {
      await this.sendEmail(
        notificationPreferences.email.address,
        'New Profile View',
        `Your profile has been viewed by a potential client.`,
        `<p>Hi ${name},</p><p>Your profile has been viewed by a potential client.</p>`
      );
    }

    // SMS notification
    if (notificationPreferences.sms.enabled && notificationPreferences.sms.notifications.profileViews) {
      await this.sendSMS(
        notificationPreferences.sms.phoneNumber || '',
        `Hi ${name}, your profile has been viewed by a potential client.`
      );
    }
  }

  static async notifySearchAppearance(coach: Coach) {
    // Skip notifications if preferences are not set
    if (!coach.notificationPreferences) return;

    const { notificationPreferences, name } = coach;

    // Email notification
    if (notificationPreferences.email.enabled && notificationPreferences.email.notifications.searchAppearances) {
      await this.sendEmail(
        notificationPreferences.email.address,
        'Search Appearance',
        `Your profile appeared in search results.`,
        `<p>Hi ${name},</p><p>Your profile appeared in search results.</p>`
      );
    }

    // SMS notification
    if (notificationPreferences.sms.enabled && notificationPreferences.sms.notifications.searchAppearances) {
      await this.sendSMS(
        notificationPreferences.sms.phoneNumber || '',
        `Hi ${name}, your profile appeared in search results.`
      );
    }
  }

  static async notifyProfileClick(coach: Coach) {
    // Skip notifications if preferences are not set
    if (!coach.notificationPreferences) return;

    const { notificationPreferences, name } = coach;

    // Email notification
    if (notificationPreferences.email.enabled && notificationPreferences.email.notifications.profileClicks) {
      await this.sendEmail(
        notificationPreferences.email.address,
        'Profile Click',
        `Someone clicked on your profile.`,
        `<p>Hi ${name},</p><p>Someone clicked on your profile.</p>`
      );
    }

    // SMS notification
    if (notificationPreferences.sms.enabled && notificationPreferences.sms.notifications.profileClicks) {
      await this.sendSMS(
        notificationPreferences.sms.phoneNumber || '',
        `Hi ${name}, someone clicked on your profile.`
      );
    }
  }

  static async notifyTierUpgrade(coachId: string) {
    // This would send a notification when a coach upgrades their tier
    // Implementation would go here
  }

  static async notifyTierDowngrade(coachId: string) {
    // This would send a notification when a coach's tier is downgraded
    // Implementation would go here
  }

  static async updateAnalytics(coachId: string, type: keyof Analytics) {
    // This would update the analytics in Firebase
    // Implementation would go here
  }
} 