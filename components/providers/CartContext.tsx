"use client";

import { Product } from "@/types/appwrite.types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface CartContextType {
  cart: (Product & { quantity: number })[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => {total: number; subtotal: number; delivery: number};
  getTotalItems: () => number;
  getOrderItems: () => OrderItem[];
  applyCoupon: (code: string, discountAmount: number, $id: string) => void;
  removeCoupon: () => void;
  coupon: { code: string; discountAmount: number; $id: string } | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

// Helper to safely parse cart items from localStorage
function parseCartItems(items: any[]): (Product & { quantity: number })[] {
  return items.map(item => ({
    ...item,
    price: typeof item.price === "string" ? parseFloat(item.price) : (item.price || 0),
    stock: typeof item.stock === "string" ? parseInt(item.stock, 10) : (item.stock || 0),
    quantity: typeof item.quantity === "string" ? parseInt(item.quantity, 10) : (item.quantity || 1),
  }));
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [coupon, setCoupon] = useState<{
    code: string;
    discountAmount: number;
    $id: string;
  } | null>(null);
  const DELIVERY_CHARGE = 200;

  // Load cart and coupon from localStorage when the component mounts
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      const savedCoupon = localStorage.getItem("coupon");
      if (savedCart) {
        setCart(parseCartItems(JSON.parse(savedCart)));
      }
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  // Save cart and coupon to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("coupon", JSON.stringify(coupon));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart, coupon]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.$id === product.$id
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };
        return updatedCart;
      } else {
        toast.success(`${product.name} added to cart`);
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    toast.success(`Product removed from cart`);
    setCart((prevCart) => prevCart.filter((item) => item.$id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.$id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
    toast.success(`Cart cleared`);
    localStorage.removeItem("cart");
    localStorage.removeItem("coupon");
  };

  const getTotalPrice = () => {
    const subtotal = cart.reduce(
      (acc, item) => acc + (item.price || 0) * item.quantity,
      0
    );
    const discountedSubtotal = coupon
      ? subtotal - coupon.discountAmount
      : subtotal;
    const totalWithDelivery = discountedSubtotal + DELIVERY_CHARGE;
    return {
      total: Number(totalWithDelivery.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      delivery: DELIVERY_CHARGE,
    };
  };

  const getTotalItems = (): number => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const getOrderItems = (): OrderItem[] => {
    return cart.map((item) => ({
      productId: item.$id,
      name: item.name,
      quantity: item.quantity,
      price: item.price || 0,
      totalPrice: (item.price || 0) * item.quantity,
    }));
  };

  const applyCoupon = (code: string, discountAmount: number, $id: string) => {
    setCoupon({ code, discountAmount, $id });
    toast.success(`Coupon applied: ${code}`);
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.success(`Coupon removed`);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        getOrderItems,
        applyCoupon,
        removeCoupon,
        coupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
