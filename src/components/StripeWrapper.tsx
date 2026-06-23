'use client';
import React, { ReactNode } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripeWrapperProps {
  children: ReactNode;
  clientSecret?: string;
}

export function StripeWrapper({ children, clientSecret }: StripeWrapperProps) {
  if (!clientSecret) {
    return <>{children}</>;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#7c3aed',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        fontFamily: 'system-ui, sans-serif',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

export { stripePromise };