import React from 'react';
import Link from 'next/link';
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsappIcon } from './Icons';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brandSection}>
          <Link href="/" className={styles.logo}>Nabbis<span>Collections</span></Link>
          <p className={styles.slogan}>"Quality Is Not A Miss"</p>
          <p className={styles.description}>Everything You Need, All in One Place. Your trusted multi-vendor marketplace across Kenya.</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Facebook" className={styles.socialIcon}><FacebookIcon size={18} color="currentColor" /></a>
            <a href="#" aria-label="Instagram" className={styles.socialIcon}><InstagramIcon size={18} color="currentColor" /></a>
            <a href="#" aria-label="TikTok" className={styles.socialIcon}><TikTokIcon size={18} color="currentColor" /></a>
            <a href="#" aria-label="WhatsApp" className={styles.socialIcon}><WhatsappIcon size={18} color="currentColor" /></a>
          </div>
          <div className={styles.paymentBadges}>
            <span className={styles.payBadge}>M-Pesa</span>
            <span className={styles.payBadge}>Airtel Money</span>
            <span className={styles.payBadge}>Visa / MC</span>
          </div>
        </div>

        <div className={styles.linksSection}>
          <h4>Shop</h4>
          <ul>
            <li><Link href="/categories">All Categories</Link></li>
            <li><Link href="/shop">New Arrivals</Link></li>
            <li><Link href="/shop?filter=best-sellers">Best Sellers</Link></li>
            <li><Link href="/shop?filter=flash-sales">Flash Sales</Link></li>
          </ul>
        </div>

        <div className={styles.linksSection}>
          <h4>Company</h4>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/become-a-seller">Become a Seller</Link></li>
          </ul>
        </div>

        <div className={styles.linksSection}>
          <h4>Support</h4>
          <ul>
            <li><Link href="/delivery">Delivery Information</Link></li>
            <li><Link href="/faqs">FAQs</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms-conditions">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Nabbis Collections. All rights reserved.</p>
          <p>Made with care for Kenyan shoppers.</p>
        </div>
      </div>
    </footer>
  );
};
