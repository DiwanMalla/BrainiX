"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { listenToCartUpdate } from "@/lib/event";
import { useClerk } from "@clerk/nextjs";

export type CartItem = {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  price: number;
  discount?: number;
  discountPrice: number | null;
  instructor: { name: string };
  rating: number;
  totalStudents: number;
  duration: number;
  level: string;
  totalLessons: number;
  totalModules: number;
  shortDescription: string;
  tags: string[];
  language: string;
  subtitlesLanguages: string[];
  certificateAvailable: boolean;
  published: boolean;
  featured: boolean;
  bestseller: boolean;
  addedAt: Date;
};

type CartContextType = {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  isLoading: boolean;
  cartTotal: number;
  itemCount: number;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isItemInCart: (itemId: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useClerk();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(0);

  // Calculate cart total
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.discountPrice ?? item.price);
    }, 0);
  }, [cartItems]);

  // Get total number of items
  const itemCount = useMemo(() => cartItems.length, [cartItems]);

  // Check if an item is in cart
  const isItemInCart = useCallback(
    (itemId: string) => {
      return cartItems.some((item) => item.id === itemId);
    },
    [cartItems]
  );

  // Add item to cart
  const addToCart = useCallback(
    async (item: CartItem) => {
      if (isItemInCart(item.id)) return;

      setIsLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });

        if (res.ok) {
          const updatedCart = await res.json();
          setCartItems(updatedCart);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isItemInCart]
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (itemId: string) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/cart/${itemId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          const updatedCart = await res.json();
          setCartItems(updatedCart);
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (res.ok) {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    // Debounce requests to prevent rapid repeated calls
    const now = Date.now();
    if (now - lastFetch < 1000) {
      // 1 second debounce
      return;
    }
    setLastFetch(now);

    if (!user) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", {
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      } else if (res.status === 401) {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, lastFetch]);

  useEffect(() => {
    fetchCart();
    const unsubscribe = listenToCartUpdate(fetchCart);
    return () => unsubscribe();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        isLoading,
        cartTotal,
        itemCount,
        addToCart,
        removeFromCart,
        clearCart,
        isItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
