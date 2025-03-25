// Types
export interface CartItem {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  price: number;
  image?: string;
  originalPrice?: number;
  discount?: number;
}

export interface WishlistItem {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  price: number;
  image?: string;
}

export interface PurchasedCourse {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  price: number;
  image?: string;
  purchaseDate: string;
  accessUntil: string;
  progress: number;
}

// Cart functions
export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

export function addToCart(item: CartItem): void {
  if (typeof window === "undefined") return;

  const cart = getCart();

  // Check if item already exists in cart
  if (!cart.some((cartItem) => cartItem.id === item.id)) {
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("localStorageChange"));
  }
}

export function removeFromCart(id: string): void {
  if (typeof window === "undefined") return;

  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  // Dispatch event to notify other components
  window.dispatchEvent(new Event("localStorageChange"));
}

export function clearCart(): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("cart", JSON.stringify([]));

  // Dispatch event to notify other components
  window.dispatchEvent(new Event("localStorageChange"));
}

// Wishlist functions
export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];

  const wishlist = localStorage.getItem("wishlist");
  return wishlist ? JSON.parse(wishlist) : [];
}

export function addToWishlist(item: WishlistItem): void {
  if (typeof window === "undefined") return;

  const wishlist = getWishlist();

  // Check if item already exists in wishlist
  if (!wishlist.some((wishlistItem) => wishlistItem.id === item.id)) {
    wishlist.push(item);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("localStorageChange"));
  }
}

export function removeFromWishlist(id: string): void {
  if (typeof window === "undefined") return;

  const wishlist = getWishlist();
  const updatedWishlist = wishlist.filter((item) => item.id !== id);
  localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

  // Dispatch event to notify other components
  window.dispatchEvent(new Event("localStorageChange"));
}

export function isInWishlist(courseId: string): boolean {
  if (typeof window === "undefined") return false;

  const wishlist = getWishlist();
  return wishlist.some((item) => item.id === courseId);
}

// Purchased courses functions
export function getPurchasedCourses(): PurchasedCourse[] {
  if (typeof window === "undefined") return [];

  const purchasedCourses = localStorage.getItem("purchasedCourses");
  return purchasedCourses ? JSON.parse(purchasedCourses) : [];
}

export function addToPurchasedCourses(items: CartItem[]): void {
  if (typeof window === "undefined") return;

  const purchasedCourses = getPurchasedCourses();
  const currentDate = new Date();

  // Add each cart item to purchased courses
  items.forEach((item) => {
    // Check if course is already purchased
    if (!purchasedCourses.some((course) => course.id === item.id)) {
      // Create access until date (1 year from purchase)
      const accessUntil = new Date(currentDate);
      accessUntil.setFullYear(accessUntil.getFullYear() + 1);

      purchasedCourses.push({
        id: item.id,
        slug: item.slug,
        title: item.title,
        instructor: item.instructor,
        price: item.price,
        image: item.image,
        purchaseDate: currentDate.toISOString(),
        accessUntil: accessUntil.toISOString(),
        progress: 0,
      });
    }
  });

  localStorage.setItem("purchasedCourses", JSON.stringify(purchasedCourses));

  // Dispatch event to notify other components
  window.dispatchEvent(new Event("localStorageChange"));
}

export function updateCourseProgress(courseId: string, progress: number): void {
  if (typeof window === "undefined") return;

  const purchasedCourses = getPurchasedCourses();
  const updatedCourses = purchasedCourses.map((course) => {
    if (course.id === courseId) {
      return { ...course, progress };
    }
    return course;
  });

  localStorage.setItem("purchasedCourses", JSON.stringify(updatedCourses));

  // Dispatch event to notify other components
  window.dispatchEvent(new Event("localStorageChange"));
}

export function isPurchased(courseId: string): boolean {
  if (typeof window === "undefined") return false;

  const purchasedCourses = getPurchasedCourses();
  return purchasedCourses.some((course) => course.id === courseId);
}
