import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
  return new Stripe(key);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, email, name } = body;

    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is KES 50.' },
        { status: 400 }
      );
    }

    // Amount in cents (Stripe expects smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: amountInCents,
      currency: 'kes', // Kenyan Shilling
      receipt_email: email,
      metadata: {
        customerName: name,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}