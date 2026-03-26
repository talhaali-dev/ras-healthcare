"use server";
import {
  DATABASE_ID,
  databases,
  ORDERS_COLLECTION_ID,
  PRODUCTS_COLLECTION_ID,
} from "@/lib/appwrite";
import { parseStringify } from "@/lib/utils";
import { CreateOrderProps } from "@/types";
import { ID, Query } from "node-appwrite";
import { sendOrderConfirmationEmail } from "./mail.actions";
import { sendReviewRequestEmail } from "@/lib/email/review-request";
import { Order } from "@/types/appwrite.types";
import { getProductById } from "@/app/admin/_actions/product";
import { revalidatePath } from "next/cache";
import { createOrderSchema, updateOrderStatusSchema } from "@/lib/validations";

export const createOrder = async (orderData: CreateOrderProps) => {
  try {
    // Validate input
    const validatedData = createOrderSchema.parse(orderData);

    const order = await databases.createDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      ID.unique(),
      {
        customer_name: validatedData.customer_name,
        customer_phone: validatedData.customer_phone,
        customer_email: validatedData.customer_email,
        delivery_address: validatedData.delivery_address,
        delivery_city: validatedData.delivery_city,
        delivery_state: validatedData.delivery_state,
        price: validatedData.price,
        number_of_items: validatedData.number_of_items,
        order_items: validatedData.order_items,
        status: "pending",
        couponApplied: validatedData.couponApplied,
        coupon: validatedData.coupon_code,
        discountedPrice: validatedData.discountedPrice,
        postalCode: validatedData.postalCode,
      }
    );

    // Send email in background, don't block order creation
    sendOrderConfirmationEmail(order as Order).catch((err) => {
      console.error("Failed to send order confirmation email:", err);
    });

    revalidatePath("/admin/orders");
    revalidatePath("/");
    revalidatePath("/orders");
    return parseStringify(order);
  } catch (error) {
    console.error("Error while creating order:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const orders = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.orderDesc("$createdAt")]
    );

    return parseStringify(orders.documents);
  } catch (error) {
    console.error("Error while fetching all orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const order = await databases.getDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      orderId
    );

    return parseStringify(order);
  } catch (error) {
    console.error("Error while fetching order by ID:", error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: "pending" | "confirmed" | "shipped" | "cancelled" | "completed"
) => {
  try {
    // Validate status
    updateOrderStatusSchema.parse({ status });

    if (status === "confirmed") {
      const order = await getOrderById(orderId);
      const products = JSON.parse(order.order_items);

      // Use Promise.all to handle multiple updates concurrently
      await Promise.all(
        products.map(async (element: any) => {
          // Fetch raw product directly from Appwrite (not normalized)
          const rawProduct: any = await databases.getDocument(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            element.productId
          );

          // Parse stock as number for calculation
          const currentStock = parseInt(rawProduct.stock || "0", 10);

          if (currentStock >= element.quantity) {
            const newStock = currentStock - element.quantity;

            console.log("Updating stock:", {
              productId: element.productId,
              currentStock,
              quantity: element.quantity,
              newStock,
              sending: { stock: String(newStock) }
            });

            // Update stock - send as plain object, not typed
            return databases.updateDocument(
              DATABASE_ID,
              PRODUCTS_COLLECTION_ID,
              element.productId,
              { stock: String(newStock) }
            );
          }
          throw new Error(`Insufficient stock for product ${element.productId}. Current: ${currentStock}, Requested: ${element.quantity}`);
        })
      );
    }

    // Check if status is being changed to "shipped" and send review request email
    if (status === "shipped") {
      const order = await getOrderById(orderId);

      // Only send review request if review hasn't been submitted yet
      if (!order.reviewSubmitted) {
        // Send email in background, don't block order status update
        sendReviewRequestEmail(order as Order).catch((err) => {
          console.error("Failed to send review request email:", err);
        });
      }
    }

    // Update order status
    const order = await databases.updateDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      orderId,
      {
        status,
      }
    );
    revalidatePath("/admin/orders");
    revalidatePath("/");
    revalidatePath("/orders");

    return parseStringify(order);
  } catch (error) {
    console.error("Error while updating order status:", error);
    throw error;
  }
};
