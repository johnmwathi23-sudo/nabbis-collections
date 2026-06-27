'use client';
import React from 'react';
import styles from '../about/info.module.css';

export default function TermsConditionsPage() {
  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>Terms &amp; Conditions</h1>
      <p className={styles.subtitle}>Last updated: June 23, 2026</p>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Agreement to Terms</h2>
          <p className={styles.text}>
            By accessing or using the Nabbis Collections platform (website, web application, services), you agree to be bound by these Terms and Conditions. If you do not agree, please do not utilize our platform.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Customer Transactions</h2>
          <p className={styles.text}>
            Customers agree to provide accurate delivery details and phone numbers during checkout. Payments are processed in full via Safaricom Lipa Na M-Pesa. Refunds or returns must be initiated within 7 days of delivery as described in our Refund Policy.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Vendor Responsibilities</h2>
          <p className={styles.text}>
            Vendors agree to list authentic products matching their description and upload correct price tags. Vendors are responsible for processing order dispatches within 24 hours. Failure to meet quality guidelines will result in account suspension.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Platform Fees</h2>
          <p className={styles.text}>
            Nabbis Collections charges a flat 5% commission on all completed customer orders. Payouts are reconciled daily and wired to the vendor&apos;s registered payout channel.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Account Termination</h2>
          <p className={styles.text}>
            We reserve the right to suspend or terminate accounts (customer or vendor) that violate user policies, engage in fraudulent transactions, or compromise platform security.
          </p>
        </div>
      </div>
    </div>
  );
}
