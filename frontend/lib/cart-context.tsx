"use client";

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { Product } from "./types";

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  sessionId: string | null;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "SET_SESSION"; sessionId: string }
  | { type: "LOAD_CART"; items: CartItem[] };

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("nabbis_session");
  if (!sid) {
    sid = crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem("nabbis_session", sid);
  }
  return sid;
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("nabbis_cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + (action.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { id: action.product.id, product: action.product, quantity: action.quantity || 1 }],
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: action.quantity <= 0
          ? state.items.filter((i) => i.product.id !== action.productId)
          : state.items.map((i) =>
              i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
            ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "SET_SESSION":
      return { ...state, sessionId: action.sessionId };
    case "LOAD_CART":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  sessionId: string | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    sessionId: null,
  });

  useEffect(() => {
    const sid = getSessionId();
    dispatch({ type: "SET_SESSION", sessionId: sid });
    const stored = loadCartFromStorage();
    if (stored.length > 0) dispatch({ type: "LOAD_CART", items: stored });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nabbis_cart", JSON.stringify(state.items));
    }
  }, [state.items]);

  const addItem = (product: Product, quantity = 1) => dispatch({ type: "ADD_ITEM", product, quantity });
  const removeItem = (productId: string) => dispatch({ type: "REMOVE_ITEM", productId });
  const updateQuantity = (productId: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => {
    const price = i.product.on_sale && i.product.sale_price ? i.product.sale_price : i.product.price;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items: state.items, sessionId: state.sessionId, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
