'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '../../lib/data';
import styles from './categories.module.css';

export default function CategoriesPage() {
  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Browse Categories</h1>
        <p className={styles.subtitle}>
          Explore our wide range of products from premium fashion to household essentials, sourced from trusted vendors across Kenya.
        </p>
      </div>

      <div className={styles.grid}>
        {CATEGORIES.map((cat, idx) => (
          <Link
            href={`/shop?category=${encodeURIComponent(cat.name)}`}
            key={cat.id}
            className={`${styles.card} animate-fadeUp`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className={styles.imageWrapper}>
              <img
                src={cat.image}
                alt={cat.name}
                className={styles.image}
                loading="lazy"
              />
            </div>
            <div className={styles.overlay} />
            <div className={styles.content}>
              <span className={styles.countBadge}>{cat.productCount} Items</span>
              <h2 className={styles.cardName}>{cat.name}</h2>
              <p className={styles.cardDesc}>{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
