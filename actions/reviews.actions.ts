"use server";

import {
  DATABASE_ID,
  databases,
  ORDERS_COLLECTION_ID,
  PRODUCTS_COLLECTION_ID,
  REVIEWS_COLLECTION_ID,
} from "@/lib/appwrite";
import { parseStringify } from "@/lib/utils";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { Review } from "@/types/appwrite.types";

export interface CreateReviewParams {
  orderId: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  reviewText: string;
}

export const createReview = async (reviewData: CreateReviewParams) => {
  try {
    // Validate rating is between 1 and 5
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Validate review text minimum length
    if (reviewData.reviewText.trim().length < 20) {
      throw new Error("Review text must be at least 20 characters");
    }

    // Create the review with isApproved set to false by default
    const review = await databases.createDocument(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      ID.unique(),
      {
        orderId: reviewData.orderId,
        productId: reviewData.productId,
        productName: reviewData.productName,
        customerName: reviewData.customerName,
        customerEmail: reviewData.customerEmail,
        rating: String(reviewData.rating),
        reviewText: reviewData.reviewText.trim(),
        isApproved: false,
      }
    );

    // Mark the order as having a submitted review
    await databases.updateDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      reviewData.orderId,
      {
        reviewSubmitted: true,
      }
    );

    revalidatePath("/admin/reviews");
    revalidatePath(`/products/${reviewData.productId}`);

    return parseStringify(review);
  } catch (error) {
    console.error("Error while creating review:", error);
    throw error;
  }
};

export const getAllReviews = async () => {
  try {
    const reviews = await databases.listDocuments(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      [Query.orderDesc("$createdAt")]
    );

    return parseStringify(reviews.documents);
  } catch (error) {
    console.error("Error while fetching reviews:", error);
    throw error;
  }
};

export const getReviewsByProductId = async (productId: string) => {
  try {
    const reviews = await databases.listDocuments(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      [
        Query.equal("productId", productId),
        Query.equal("isApproved", true),
        Query.orderDesc("$createdAt"),
      ]
    );

    return parseStringify(reviews.documents);
  } catch (error) {
    console.error("Error while fetching reviews for product:", error);
    throw error;
  }
};

export const getProductReviewsWithStats = async (productId: string) => {
  try {
    const reviews = await databases.listDocuments(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      [
        Query.equal("productId", productId),
        Query.equal("isApproved", true),
        Query.orderDesc("$createdAt"),
      ]
    );

    const reviewsData = parseStringify(reviews.documents);

    // Calculate average rating (convert string to number)
    const approvedReviews = reviews.documents.filter((r: Review) => r.isApproved);
    const averageRating =
      approvedReviews.length > 0
        ? approvedReviews.reduce((sum: number, r: Review) => sum + Number(r.rating), 0) /
          approvedReviews.length
        : 0;

    return {
      reviews: reviewsData,
      averageRating,
      totalReviews: approvedReviews.length,
    };
  } catch (error) {
    console.error("Error while fetching product reviews:", error);
    return {
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
    };
  }
};

export const getReviewByOrderId = async (orderId: string) => {
  try {
    const reviews = await databases.listDocuments(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      [Query.equal("orderId", orderId)]
    );

    if (reviews.documents.length === 0) {
      return null;
    }

    return parseStringify(reviews.documents[0]);
  } catch (error) {
    console.error("Error while fetching review by order ID:", error);
    throw error;
  }
};

export const approveReview = async (reviewId: string) => {
  try {
    const updatedReview = await databases.updateDocument(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      reviewId,
      {
        isApproved: true,
      }
    );

    revalidatePath("/admin/reviews");
    revalidatePath("/");

    // Also revalidate the product page if we can get the product ID
    const review = await databases.getDocument(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      reviewId
    );
    revalidatePath(`/products/${review.productId}`);

    return parseStringify(updatedReview);
  } catch (error) {
    console.error("Error while approving review:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      reviewId
    );

    revalidatePath("/admin/reviews");
    revalidatePath("/");

    return true;
  } catch (error) {
    console.error("Error while deleting review:", error);
    throw error;
  }
};

export const getReviewsStats = async () => {
  try {
    const allReviews = await databases.listDocuments(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      [Query.orderDesc("$createdAt")]
    );

    const reviews = allReviews.documents;

    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter((r: Review) => r.isApproved);
    const pendingReviews = reviews.filter((r: Review) => !r.isApproved);

    // Calculate average rating (convert string to number)
    const averageRating =
      approvedReviews.length > 0
        ? approvedReviews.reduce((sum: number, r: Review) => sum + Number(r.rating), 0) /
          approvedReviews.length
        : 0;

    // Calculate rating distribution (convert string to number for comparison)
    const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: approvedReviews.filter((r: Review) => Number(r.rating) === rating).length,
    }));

    return {
      totalReviews,
      approvedReviews: approvedReviews.length,
      pendingReviews: pendingReviews.length,
      averageRating,
      ratingDistribution,
    };
  } catch (error) {
    console.error("Error while fetching reviews stats:", error);
    throw error;
  }
};
