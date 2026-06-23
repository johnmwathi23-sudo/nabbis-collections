'use client';
import React from 'react';
import styles from './info.module.css';

export default function AboutPage() {
  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>About Nabbis Collections</h1>
      <p className={styles.subtitle}>
        We are Kenya&apos;s premium retail bridge, connecting quality-driven shoppers with verified vendors across the country.
      </p>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Promise: &quot;Quality Is Not A Miss&quot;</h2>
          <p className={styles.text}>
            Nabbis Collections was founded in Nairobi with a singular mission: to eliminate the uncertainty of online shopping in Kenya. We believe that when you buy online, you shouldn&apos;t have to cross your fingers and hope the product matches the photo.
          </p>
          <p className={styles.text}>
            To deliver on this promise, every single vendor on our platform undergoes a strict vetting process. We inspect their product catalogs, sample quality, and verify their location coordinates before approving them to sell on our platform.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Supporting Small Businesses</h2>
          <p className={styles.text}>
            Our platform provides local entrepreneurs, tailors, shoe artisans, and retailers with the technology they need to reach a nationwide market. We handle the digital storefront, Lipa Na M-Pesa automated payment reconciliations, and package deliveries so sellers can focus on what they do best: creating and sourcing great products.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Platform Values</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>Vetted Quality:</strong> We check product quality so you don&apos;t have to.
            </li>
            <li className={styles.listItem}>
              <strong>Payment Protection:</strong> Safe transactional processing using Lipa Na M-Pesa STK push.
            </li>
            <li className={styles.listItem}>
              <strong>Nationwide Reach:</strong> Fast deliveries spanning Nairobi CBD to remote parcel dropoff points in all 47 counties.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
