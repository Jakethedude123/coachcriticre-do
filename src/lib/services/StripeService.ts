import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

const PLATFORM_FEE_PERCENT = 10;

export class StripeService {
  static async createConnectedAccount(email: string) {
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    return account;
  }

  static async createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });

    return accountLink;
  }

  static async createProduct(name: string, coachId: string) {
    const product = await stripe.products.create({
      name,
      metadata: {
        coachId,
      },
    });

    return product;
  }

  static async createPrice(productId: string, amount: number) {
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: amount,
      currency: 'usd',
    });

    return price;
  }

  static async createPaymentIntent(
    priceId: string,
    coachStripeAccountId: string,
    customerEmail: string
  ) {
    const price = await stripe.prices.retrieve(priceId);
    const amount = price.unit_amount!;
    
    // Calculate platform fee (10%)
    const platformFee = Math.round(amount * (PLATFORM_FEE_PERCENT / 100));

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
      application_fee_amount: platformFee,
      transfer_data: {
        destination: coachStripeAccountId,
      },
      metadata: {
        priceId,
        coachStripeAccountId,
      },
      receipt_email: customerEmail,
    });

    return paymentIntent;
  }

  static async getAccountBalance(accountId: string) {
    const balance = await stripe.balance.retrieve({
      stripeAccount: accountId,
    });

    return balance;
  }

  static async listCharges(accountId: string, startDate: Date) {
    const charges = await stripe.charges.list(
      {
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
        },
      },
      {
        stripeAccount: accountId,
      }
    );
    return charges.data;
  }

  static async createCheckoutSession(
    priceId: string,
    coachStripeAccountId: string,
    successUrl: string,
    cancelUrl: string,
    customerEmail?: string
  ) {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      payment_intent_data: {
        application_fee_amount: undefined, // Will be calculated during checkout
        transfer_data: {
          destination: coachStripeAccountId,
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
    });

    return session;
  }

  static async handleWebhookEvent(
    payload: string,
    signature: string,
    endpointSecret: string
  ) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          // Handle successful payment
          break;

        case 'account.updated':
          const account = event.data.object as Stripe.Account;
          // Handle account updates
          break;

        // Add more event handlers as needed
      }

      return { success: true };
    } catch (err) {
      console.error('Error processing webhook:', err);
      throw err;
    }
  }
} 