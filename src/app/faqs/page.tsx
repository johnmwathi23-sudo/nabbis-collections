'use client';
import React, { useState } from 'react';
import styles from '../about/info.module.css';

interface FAQ {
  q: string;
  a: string;
}

export default function FAQsPage() {
  const faqs: FAQ[] = [
    {
      q: 'How do I know the products are of good quality?',
      a: 'Nabbis Collections enforces strict quality standards. We physically inspect sample items from vendors prior to store verification. If an item does not match specifications, customers are entitled to a full return/refund within 7 days.'
    },
    {
      q: 'Can I pay on delivery?',
      a: 'To guarantee vendor commitment and logistics funding, we process payments during checkout via Lipa Na M-Pesa. Funds are held securely in the Nabbis Escrow account and only disbursed to vendors after customer delivery verification.'
    },
    {
      q: 'What is the return policy?',
      a: 'If you receive an item that is damaged, defective, or does not match the storefront description, you can initiate a return request from your Account dashboard within 7 days of delivery. We will collect the item and process a replacement or refund.'
    },
    {
      q: 'How do I register as a seller?',
      a: 'Register a regular account first, then head to the "Become a Seller" page. Input your business brand details, location, and description. Once submitted, our team will review the application and approve it within 24 hours.'
    },
    {
      q: 'Where do I drop off my packages as a vendor?',
      a: 'Active vendors drop off packages at our Nairobi Central Logistics Hub on Kimathi Street. For vendors located in Mombasa, Kisumu, or Nakuru, packages can be dropped off at our local courier agent collection desks.'
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>Frequently Asked Questions</h1>
      <p className={styles.subtitle}>
        Quick answers to common questions about buying, selling, payments, and delivery on Nabbis Collections.
      </p>

      <div className={styles.content}>
        {faqs.map((faq, idx) => {
          const isOpen = activeIndex === idx;

          return (
            <div key={idx} className={styles.faqItem}>
              <button
                onClick={() => toggleFAQ(idx)}
                className={styles.faqQuestion}
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                <span>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className={styles.faqAnswer}>
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
