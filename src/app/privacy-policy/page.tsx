'use client';
import React from 'react';
import styles from '../about/info.module.css';

export default function PrivacyPolicyPage() {
  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.subtitle}>Last updated: June 23, 2026</p>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
          <p className={styles.text}>
            We collect personal information that you provide to us when you create an account, place orders, apply as a seller, or communicate with us. This includes your name, email address, physical delivery address, phone number, and transaction logs.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
          <p className={styles.text}>
            We use your personal information to facilitate transactions, process payments (via Lipa Na M-Pesa or card processing partners), coordinate delivery dispatch with courier partners, and send transactional notifications (order confirmation, tracking updates).
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Information Sharing</h2>
          <p className={styles.text}>
            We share relevant delivery details (recipient name, address, phone number) with the dispatching vendor and courier partner to fulfill orders. We do not sell your personal data to third-party advertisers.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Data Security</h2>
          <p className={styles.text}>
            We utilize standard security mechanisms, encryption protocols, and verified third-party payment gateways to safeguard your transaction information. Data is stored in secure server clusters.
          </p>
        </div>
      </div>
    </div>
  );
}
