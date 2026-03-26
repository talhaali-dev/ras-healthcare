import { z } from "zod";

// Product validations
export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200, "Product name too long"),
  price: z.number().min(0, "Price must be non-negative"),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.union([z.string(), z.instanceof(File)])).min(1, "At least one image is required"),
  quantity: z.number().min(0, "Quantity must be non-negative").int(),
  benefits: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  name: z.string().min(1).max(200).optional(),
  price: z.number().min(0).optional(),
  description: z.string().min(1).optional(),
  images: z.array(z.union([z.string(), z.instanceof(File)])).optional(),
  quantity: z.number().min(0).int().optional(),
});

export const updateStockSchema = z.object({
  stock: z.number().min(0, "Stock must be non-negative").int(),
});

// Order validations
export const createOrderSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_phone: z.string().min(10, "Phone number is required"),
  customer_email: z.string().email("Invalid email address"),
  delivery_address: z.string().min(5, "Address must be at least 5 characters"),
  delivery_city: z.string().min(2, "City must be at least 2 characters"),
  delivery_state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(5, "Postal code is required"),
  price: z.number().min(0, "Price must be non-negative"),
  number_of_items: z.number().min(1, "At least one item is required").int(),
  order_items: z.string().min(1, "Order items are required"),
  couponApplied: z.boolean().default(false),
  coupon_code: z.string().optional(),
  discountedPrice: z.number().min(0, "Discounted price must be non-negative"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "cancelled", "completed"]),
});

// Blog validations
export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.union([z.instanceof(File), z.array(z.instanceof(File)), z.string()]),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

// Coupon validations
export const createCouponSchema = z.object({
  code: z.string().min(1, "Code is required").toUpperCase(),
  description: z.string().optional(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.number().min(0, "Discount value must be non-negative"),
  valid_from: z.string().datetime(),
  valid_until: z.string().datetime(),
  usage_limit: z.number().min(1, "Usage limit must be at least 1").int().optional(),
  is_active: z.boolean().default(true),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
});

// Settings validations
export const updateSettingsSchema = z.object({
  topbar_enabled: z.boolean(),
  topbar_text: z.string().max(200, "Text too long"),
  topbar_bg_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  topbar_text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
