import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb as db } from '@/lib/firebase/firebaseAdmin';
import { getCoachByStripeAccount, updateCoach } from '@/lib/firebase/firebaseUtils';
import { NotificationService } from '@/lib/services/NotificationService';
import { type CoachTier } from '@/lib/firebase/models/coach';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Update coach's earnings
        if (paymentIntent.metadata.coachId) {
          const coachRef = db.collection('coaches').doc(paymentIntent.metadata.coachId);
          await coachRef.update({
            'earnings.total': paymentIntent.amount / 100,
            'earnings.lastPayment': new Date(),
          });
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        // Update coach's subscription status
        if (subscription.metadata.coachId) {
          const coachRef = db.collection('coaches').doc(subscription.metadata.coachId);
          await coachRef.update({
            'subscription.status': subscription.status,
            'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
          });
        }
        break;
      }
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const coach = await getCoachByStripeAccount(session.customer as string);
        if (coach) {
          await updateCoach(coach.userId, {
            subscription: {
              plan: (session.metadata?.tier || 'free') as 'free' | 'pro' | 'premium',
              status: 'active',
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string
            }
          });

          await NotificationService.notifyTierUpgrade(coach.userId);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const coach = await getCoachByStripeAccount(subscription.customer as string);
        if (coach) {
          await updateCoach(coach.userId, {
            subscription: {
              plan: 'free',
              status: 'cancelled',
              stripeCustomerId: '',
              stripeSubscriptionId: ''
            }
          });

          await NotificationService.notifyTierDowngrade(coach.userId);
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
} 