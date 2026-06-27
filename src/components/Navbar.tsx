'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { SearchIcon, CartIcon, UserIcon, HeartIcon, MenuIcon } from './Icons';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const router = useRouter();
  const { totalItems } = useCart();
  const { count: wishCount } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.topBar}>
        <div className="container">
          <span className={styles.topBarText}>🚚 Free Nairobi delivery on orders above KES 5,000</span>
          <span className={styles.topBarDivider}>|</span>
          <span className={styles.topBarPhone}>📞 +254 700 000 000</span>
          <span className={styles.topBarDivider}>|</span>
          <span className={styles.topBarPayments}>M-Pesa • Airtel Money • Cards</span>
        </div>
      </div>

      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>Nabbis<span>Collections</span></Link>

        <div className={styles.searchWrapper}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchVal.trim()) {
                router.push(`/shop?search=${encodeURIComponent(searchVal)}`);
              }
            }}
            className={styles.searchBar}
          >
            <SearchIcon size={18} color="var(--color-gray-600)" />
            <input
              type="text"
              placeholder="Search products, brands and categories..."
              aria-label="Search"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>Search</button>
          </form>
        </div>

        <div className={styles.actions}>
          <Link href="/account" className={styles.actionBtn} aria-label="Account">
            <UserIcon size={22} />
            <span>Account</span>
          </Link>
          <Link href="/wishlist" className={styles.actionBtn} aria-label="Wishlist" style={{ position: 'relative' }}>
            <HeartIcon size={22} />
            {wishCount > 0 && <span className={styles.cartBadge} style={{ background: '#e53e3e' }}>{wishCount}</span>}
            <span>Wishlist</span>
          </Link>
          <Link href="/cart" className={styles.cartBtn} aria-label="Cart">
            <CartIcon size={22} />
            {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
          </Link>
          <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <MenuIcon size={22} />
          </button>
        </div>
      </div>

      <nav className={styles.catNav}>
        <div className={`container ${styles.catNavInner}`}>
          {['Fashion', 'Footwear', 'Home & Decor', 'Kitchen', 'Baby Products', 'Beauty', 'Health', 'Fitness'].map((cat) => (
            <Link href={`/shop?category=${encodeURIComponent(cat)}`} key={cat} className={styles.catLink}>{cat}</Link>
          ))}
          <Link href="/become-a-seller" className={styles.sellerLink}>Become a Seller →</Link>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/shop" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>All Products</Link>
          {['Fashion', 'Footwear', 'Home & Decor', 'Beauty', 'Health', 'Kitchen'].map(item => (
            <Link href={`/shop?category=${item}`} key={item} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{item}</Link>
          ))}
          <Link href="/categories" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>All Categories</Link>
          <Link href="/become-a-seller" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Become a Seller</Link>
          <Link href="/about" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link href="/contact" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Contact Us</Link>
        </div>
      )}
    </header>
  );
};
