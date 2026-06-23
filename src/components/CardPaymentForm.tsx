'use client';
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from './Button';

interface CardPaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CardPaymentForm({ amount, onSuccess, onCancel }: CardPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?success=true`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1.5rem' }}>
        <PaymentElement />
      </div>

      {error && (
        <div style={{
          color: '#dc2626',
          fontSize: '0.875rem',
          marginBottom: '1rem',
          padding: '0.75rem',
          background: '#fef2f2',
          borderRadius: '6px',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={processing}
          style={{ flex: 1 }}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!stripe || processing}
          style={{ flex: 1 }}
        >
          {processing ? 'Processing...' : `Pay KES ${amount.toLocaleString()}`}
        </Button>
      </div>
    </form>
  );
}