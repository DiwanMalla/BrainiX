// lib/event.ts
"use client";

type Callback = () => void;

const wishlistListeners: Callback[] = [];
const cartListeners: Callback[] = [];

export function dispatchWishlistUpdate() {
  wishlistListeners.forEach((listener) => listener());
}

export function listenToWishlistUpdate(callback: Callback): () => void {
  wishlistListeners.push(callback);
  return () => {
    const index = wishlistListeners.indexOf(callback);
    if (index > -1) wishlistListeners.splice(index, 1);
  };
}

export function dispatchCartUpdate() {
  cartListeners.forEach((listener) => listener());
}

export function listenToCartUpdate(callback: Callback): () => void {
  cartListeners.push(callback);
  return () => {
    const index = cartListeners.indexOf(callback);
    if (index > -1) cartListeners.splice(index, 1);
  };
}
