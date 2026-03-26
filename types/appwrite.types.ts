import { Coupon } from "@/actions/coupon.actions";
import { Models } from "node-appwrite";

export interface Product extends Models.Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  benefits?: string[];
  quantity?: number; // Alias for stock in some contexts
}

export interface Order extends Models.Document {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  price: number;
  number_of_items: number;
  order_items: string;
  status: "pending" | "confirmed" | "shipped" | "cancelled" | "completed";
  couponApplied: boolean;
  coupon: Coupon | null;
  discountedPrice: number;
  postalCode?: string;
  reviewSubmitted?: boolean;
}

export interface Blog extends Models.Document {
  title: string;
  content: string;
  coverImage: string;
  slug: string;
}

export interface Review extends Models.Document {
  orderId: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: string; // Stored as string in Appwrite ("1"-"5")
  reviewText: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Settings extends Models.Document {
  topbar_enabled: boolean;
  topbar_text: string;
  topbar_bg_color: string;
  topbar_text_color: string;
}
