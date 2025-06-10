"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
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
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useClerk();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", { 
        cache: "no-store",
        headers: { 'Authorization': `Bearer ${await user.getToken()}` }
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
  }, [user]);

  useEffect(() => {
    fetchCart();
    const unsubscribe = listenToCartUpdate(fetchCart);
    return () => unsubscribe();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, isLoading }}>
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
