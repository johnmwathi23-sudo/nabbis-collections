'use client';
import React from 'react';
import styles from '../about/info.module.css';

export default function DeliveryPage() {
  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>Delivery Information</h1>
      <p className={styles.subtitle}>
        We deliver quality products securely to your doorstep in Nairobi and via parcel hubs across all 47 counties of Kenya.
      </p>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Delivery Rates &amp; Timelines</h2>
          <p className={styles.text}>
            We coordinate delivery with vetted local courier partners to ensure speed and safety. Fees depend on the destination city:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>Nairobi Express Delivery:</strong> KES 250. Packages are delivered within 24 hours. Enjoy **FREE delivery** for orders above KES 5,000.
            </li>
            <li className={styles.listItem}>
              <strong>Countrywide Courier (outside Nairobi):</strong> KES 400. Delivery takes between 2 to 3 working days. Packages are shipped via G4S, Wells Fargo, or local parcel agents.
            </li>
            <li className={styles.listItem}>
              <strong>Office Collection (Self Pickup):</strong> FREE. Collect your order directly from our Nairobi CBD collection center at Nabbis Collections Building along Kimathi Street.
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How Delivery Works</h2>
          <p className={styles.text}>
            Once you place an order:
          </p>
          <ol className={styles.list} style={{ listStyle: 'decimal' }}>
            <li className={styles.listItem}>
              The vendor packages the products and drops them off at the local Nabbis hub within 12 hours.
            </li>
            <li className={styles.listItem}>
              Our quality inspection team verifies that the products match the dimensions and quality specifications.
            </li>
            <li className={styles.listItem}>
              The courier agent dispatches the package to your location and sends a tracking SMS with verification codes.
            </li>
          </ol>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Delivery Locations</h2>
          <p className={styles.text}>
            We routinely deliver to major towns including Mombasa, Kisumu, Nakuru, Eldoret, Thika, Kiambu, Machakos, Nyeri, Meru, Kakamega, Kisii, Kericho, and Malindi, as well as remote postal boxes countrywide.
          </p>
        </div>
      </div>
    </div>
  );
}
