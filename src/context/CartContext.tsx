"use client";

import { publicCoupons } from "@/lib/checkout-options";
import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { trackAddToCart, trackRemoveFromCart } from "@/lib/analytics";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  format: string;
  category: string;
  posterUrl: string;
  quantity: number;
  isBundle?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: "success" | "info" | "warning";
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: {
    id: string;
    title: string;
    price: number;
    format: string;
    category: string;
    posterUrl: string;
  }, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  freeShippingThreshold: number;
  amountForFreeShipping: number;
  hasFreeShipping: boolean;
  appliedCoupon: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  userPoints: number;
  userTier: string;
  pointsToRedeem: number;
  setPointsToRedeem: (pts: number) => void;
  redeemedDiscountAmount: number;
  finalTotal: number;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
}

const FREE_SHIPPING_GOAL = 150000; // $150.000 COP

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number>(650); // Default user starts in Reparto with 650 points
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cinemerch_cart");
      if (saved) setItems(JSON.parse(saved));
      const savedCoupon = localStorage.getItem("cinemerch_coupon");
      if (savedCoupon) {
        setAppliedCoupon(savedCoupon);
        setDiscountPercent(10);
      }
      const savedPoints = localStorage.getItem("cinemerch_points");
      if (savedPoints) setUserPoints(parseInt(savedPoints, 10));
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("cinemerch_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to persist cart", e);
    }
  }, [items, isLoaded]);

  const showToast = (title: string, description: string, type: "success" | "info" | "warning" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_GOAL - subtotal);
  const hasFreeShipping = subtotal >= FREE_SHIPPING_GOAL;

  // Trigger celebration confetti when reaching free shipping for the first time
  const [celebratedShipping, setCelebratedShipping] = useState(false);
  useEffect(() => {
    if (hasFreeShipping && !celebratedShipping && subtotal > 0) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#b91c1c", "#f59e0b", "#f87171", "#ffffff"],
      });
      showToast("¡Envío Gratis Desbloqueado! 🚚🎬", "Superaste los $150.000 COP en tu pedido de coleccionista.");
      setCelebratedShipping(true);
    } else if (!hasFreeShipping) {
      setCelebratedShipping(false);
    }
  }, [hasFreeShipping, subtotal, celebratedShipping]);

  const discountAmount = Math.round(subtotal * (discountPercent / 100));

  // Max points redemption: 1 point = $10 COP, max up to 30% of subtotal
  const redeemedDiscountAmount = 0;

  const finalTotal = Math.max(0, subtotal - discountAmount - redeemedDiscountAmount);

  // User Tier Calculation
  const getUserTier = (pts: number) => {
    if (pts >= 3000) return "Director (Nivel 4)";
    if (pts >= 1500) return "Protagonista (Nivel 3)";
    if (pts >= 500) return "Reparto (Nivel 2)";
    return "Extra (Nivel 1)";
  };

  const addToCart = (
    product: {
      id: string;
      title: string;
      price: number;
      format: string;
      category: string;
      posterUrl: string;
    },
    quantity = 1
  ) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    // GA4 Analytics Track
    trackAddToCart({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      quantity,
    });

    showToast("Película agregada al carrito", product.title, "success");
    setIsOpen(true);
  };

  const removeFromCart = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      trackRemoveFromCart({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      });
      showToast("Producto removido", item.title, "info");
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setPointsToRedeem(0);
    localStorage.removeItem("cinemerch_cart");
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (publicCoupons.includes(cleanCode) || /^CINEMERCH10-\d{1,12}$/.test(cleanCode)) {
      setAppliedCoupon(cleanCode);
      setDiscountPercent(10);
      localStorage.setItem("cinemerch_coupon", cleanCode);
      showToast("¡Cupón Aplicado! 🎟️", "Descuento estimado del 10%. El cupón se valida al registrar el pedido.");
      return true;
    }
    showToast("Cupón no válido", "Verifica el código ingresado o regístrate en la preventa.", "warning");
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
    localStorage.removeItem("cinemerch_coupon");
    showToast("Cupón removido", "Se restableció el valor original.", "info");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        freeShippingThreshold: FREE_SHIPPING_GOAL,
        amountForFreeShipping,
        hasFreeShipping,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        userPoints,
        userTier: getUserTier(userPoints),
        pointsToRedeem,
        setPointsToRedeem,
        redeemedDiscountAmount,
        finalTotal,
        toasts,
        dismissToast,
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
