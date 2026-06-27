'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product } from '../lib/types';

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  toggle: (product: Product) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nabbis_wishlist');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('nabbis_wishlist', JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback((product: Product) => {
    setItems(prev => prev.find(p => p.id === product.id) ? prev : [...prev, product]);
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems(prev => prev.filter(p => p.id !== productId));
  }, []);

  const isWishlisted = useCallback((productId: number) =>
    items.some(p => p.id === productId), [items]);

  const toggle = useCallback((product: Product) => {
    isWishlisted(product.id) ? removeItem(product.id) : addItem(product);
  }, [isWishlisted, addItem, removeItem]);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isWishlisted, toggle, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
