"use server";
import { COUPON_COLLECTION_ID, DATABASE_ID, databases } from "@/lib/appwrite";
import { ID, Models } from "appwrite";
import { revalidatePath } from "next/cache";
import { Query } from "node-appwrite";
import { createCouponSchema, validateCouponSchema } from "@/lib/validations";

export interface Coupon extends Models.Document {
  code: string;
  description?: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  valid_from: string;
  valid_until: string;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
}

export async function getCoupons(): Promise<Coupon[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COUPON_COLLECTION_ID
    );
    return response.documents.map((doc) => doc as unknown as Coupon);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
}

export async function createCoupon(
  coupon: Omit<Coupon, "$id" | "used_count">
): Promise<Coupon> {
  try {
    // Validate input
    const validatedData = createCouponSchema.parse(coupon);

    const response = await databases.createDocument(
      DATABASE_ID,
      COUPON_COLLECTION_ID,
      ID.unique(),
      {
        ...validatedData,
        used_count: 0,
      }
    );
    revalidatePath("/admin/coupon");
    revalidatePath("/");
    return response as unknown as Coupon;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
}

export async function updateCoupon(
  id: string,
  coupon: Partial<Coupon>
): Promise<Coupon> {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COUPON_COLLECTION_ID,
      id,
      {
        ...coupon,
      }
    );
    revalidatePath("/admin/coupon");
    revalidatePath("/");

    return response as unknown as Coupon;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
}

export async function deleteCoupon(id: string): Promise<void> {
  try {
    await databases.deleteDocument(DATABASE_ID, COUPON_COLLECTION_ID, id);
    revalidatePath("/admin/coupon");
    revalidatePath("/");

  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
}

export async function validateCoupon(code: string) {
  try {
    // Validate input
    validateCouponSchema.parse({ code });

    // Fetch the coupon from the database
    const coupons = await databases.listDocuments(
      DATABASE_ID,
      COUPON_COLLECTION_ID,
      [
        Query.equal("code", code.toUpperCase()),
        Query.equal("is_active", true),
        Query.greaterThan("valid_until", new Date().toISOString()),
      ]
    );

    if (coupons.documents.length === 0) {
      return { isValid: false, message: "Invalid or expired coupon code." };
    }
    const coupon = coupons.documents[0];

    // Check if the coupon has reached its usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return {
        isValid: false,
        message: "This coupon has reached its usage limit.",
      };
    }

    // Increment the used count
    await updateCoupon(coupon.$id, {
      used_count: coupon.used_count + 1,
    });

    // If we've made it this far, the coupon is valid
    revalidatePath("/admin/coupon");
    revalidatePath("/");

    return {
      isValid: true,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      couponId: coupon.$id,
      message: "Coupon applied successfully!",
    };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return {
      isValid: false,
      message: "An error occurred while validating the coupon.",
    };
  }
}
