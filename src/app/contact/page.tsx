'use client';
import React, { useState } from 'react';
import { Button } from '../../components/Button';
import styles from '../about/info.module.css';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setName('');
    setEmail('');
    setMsg('');
  };

  return (
    <div className={`container ${styles.container}`} style={{ maxWidth: '900px' }}>
      <h1 className={styles.title}>Contact Us</h1>
      <p className={styles.subtitle}>
        Have questions about an order or want to register as a bulk vendor? Drop us a message below!
      </p>

      <div className={styles.content}>
        <div className={styles.contactGrid}>
          {/* Left Column: Form */}
          <div>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>Send a Message</h2>
            {success ? (
              <div style={{ background: 'rgba(46, 125, 50, 0.08)', border: '1px solid var(--color-success)', color: 'var(--color-success)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>Message Sent!</h3>
                <p style={{ fontSize: '0.9rem' }}>Thank you for reaching out. We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="contact-name" className={styles.label}>Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="contact-email" className={styles.label}>Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="contact-message" className={styles.label}>Message</label>
                  <textarea
                    id="contact-message"
                    required
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Describe your inquiry..."
                    className={styles.textarea}
                  />
                </div>

                <Button type="submit" variant="primary" className={styles.submitBtn}>
                  Send Inquiry
                </Button>
              </form>
            )}
          </div>

          {/* Right Column: Physical Details */}
          <div style={{ borderLeft: '1px solid var(--color-gray-200)', paddingLeft: '2rem' }}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>Our Headquarters</h2>
            <div style={{ fontSize: '0.95rem', color: 'var(--color-gray-800)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <strong>📍 Address:</strong>
                <p style={{ color: 'var(--color-gray-600)', marginTop: '4px' }}>
                  Nabbis Collections Building,<br />
                  Kimathi Street, Nairobi CBD,<br />
                  Kenya
                </p>
              </div>
              <div>
                <strong>📞 Phone Support:</strong>
                <p style={{ color: 'var(--color-gray-600)', marginTop: '4px' }}>
                  +254 700 000 000<br />
                  (Mon - Sat, 8:00 AM - 6:00 PM)
                </p>
              </div>
              <div>
                <strong>✉️ Email Support:</strong>
                <p style={{ color: 'var(--color-gray-600)', marginTop: '4px' }}>
                  support@nabbis.com<br />
                  vendors@nabbis.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
