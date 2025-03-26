"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCart, getWishlist, getPurchasedCourses } from "@/lib/local-storage";

export default function DebugStorage() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [purchased, setPurchased] = useState([]);

  useEffect(() => {
    const updateStorage = () => {
      setCart(getCart());
      setWishlist(getWishlist());
      setPurchased(getPurchasedCourses());
    };

    updateStorage();

    window.addEventListener("storage", updateStorage);
    window.addEventListener("localStorageChange", updateStorage);

    return () => {
      window.removeEventListener("storage", updateStorage);
      window.removeEventListener("localStorageChange", updateStorage);
    };
  }, []);

  const clearStorage = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("localStorageChange"));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 z-50 opacity-70 hover:opacity-100"
        >
          Debug Storage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Local Storage Debug</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="cart">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cart">Cart ({cart.length})</TabsTrigger>
            <TabsTrigger value="wishlist">
              Wishlist ({wishlist.length})
            </TabsTrigger>
            <TabsTrigger value="purchased">
              Purchased ({purchased.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cart" className="h-[300px] overflow-auto">
            <pre className="text-xs p-4 bg-muted rounded-md">
              {JSON.stringify(cart, null, 2)}
            </pre>
          </TabsContent>
          <TabsContent value="wishlist" className="h-[300px] overflow-auto">
            <pre className="text-xs p-4 bg-muted rounded-md">
              {JSON.stringify(wishlist, null, 2)}
            </pre>
          </TabsContent>
          <TabsContent value="purchased" className="h-[300px] overflow-auto">
            <pre className="text-xs p-4 bg-muted rounded-md">
              {JSON.stringify(purchased, null, 2)}
            </pre>
          </TabsContent>
        </Tabs>
        <div className="flex justify-between">
          <Button variant="destructive" onClick={clearStorage}>
            Clear All Storage
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
