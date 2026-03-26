"use client";

import { useState } from "react";
import { createReview } from "@/actions/reviews.actions";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  orderId: string;
  orderItems: Array<{
    productId: string;
    name: string;
    quantity: number;
  }>;
  customerEmail: string;
}

export default function ReviewForm({
  orderId,
  orderItems,
  customerEmail,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(
    orderItems[0]?.productId || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (customerName.trim().length < 2) {
      setError("Please enter your name (at least 2 characters)");
      return;
    }

    if (reviewText.trim().length < 20) {
      setError("Review text must be at least 20 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the selected product's name
      const selectedProductItem = orderItems.find(
        (item) => item.productId === selectedProduct
      );

      if (!selectedProductItem) {
        throw new Error("Selected product not found");
      }

      await createReview({
        orderId,
        productId: selectedProduct,
        productName: selectedProductItem.name,
        customerName: customerName.trim(),
        customerEmail,
        rating,
        reviewText: reviewText.trim(),
      });

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Thank You for Your Review!
        </h2>
        <p className="text-gray-600">
          Your feedback has been submitted and will be published after moderation.
        </p>
        <p className="text-gray-600 mt-2">
          We appreciate you taking the time to share your experience.
        </p>
      </div>
    );
  }

  const remainingChars = 20 - reviewText.trim().length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Product Selection */}
      {orderItems.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Product to Review *
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {orderItems.map((item) => (
              <option key={item.productId} value={item.productId}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="text-3xl transition-colors focus:outline-none"
                aria-label={`Rate ${star} stars`}
              >
                <span
                  className={
                    (hoverRating || rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <span className="text-sm text-gray-600 ml-2">
              {rating} star{rating !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Customer Name */}
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name *
        </label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          minLength={2}
        />
      </div>

      {/* Review Text */}
      <div>
        <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience with this product. What did you like or dislike? (minimum 20 characters)"
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
          minLength={20}
        />
        <p className={`text-xs mt-1 ${remainingChars <= 0 ? "text-green-600" : "text-gray-500"}`}>
          {remainingChars <= 0
            ? "Minimum requirement met"
            : `${remainingChars} more character${remainingChars !== 1 ? "s" : ""} needed`}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || remainingChars > 0}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your review will be published after moderation.
      </p>
    </form>
  );
}
