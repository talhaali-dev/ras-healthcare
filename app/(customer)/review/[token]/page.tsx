import { notFound } from "next/navigation";
import { decodeReviewToken } from "@/lib/utils/review-token";
import { getOrderById } from "@/actions/orders.actions";
import { getReviewByOrderId } from "@/actions/reviews.actions";
import ReviewForm from "./ReviewForm";

interface ReviewPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { token } = await params;

  // Decode the token to get the order ID
  let orderId: string;
  try {
    orderId = decodeReviewToken(token);
  } catch (error) {
    console.error("Invalid review token:", error);
    notFound();
  }

  // Fetch the order
  let order;
  try {
    order = await getOrderById(orderId);
  } catch (error) {
    console.error("Order not found:", error);
    notFound();
  }

  // Check if a review has already been submitted for this order
  const existingReview = await getReviewByOrderId(orderId);

  // Parse order items to display product info
  const orderItems = JSON.parse(order.order_items);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          {existingReview ? (
            // Thank you message for already submitted review
            <div className="text-center py-12">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Review Already Submitted
              </h1>
              <p className="text-gray-600">
                Thank you! You have already submitted a review for order #{orderId}.
              </p>
              <p className="text-gray-600 mt-2">
                We appreciate your feedback.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Review Your Purchase
                </h1>
                <p className="text-gray-600">
                  Please share your thoughts about your recent order from Ras Healthcare.
                </p>
              </div>

              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  Order Details
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium text-gray-900">#{order.$id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(order.$createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-gray-600 mb-2">Products:</p>
                    <ul className="space-y-1">
                      {orderItems.map((item: any) => (
                        <li key={item.productId} className="text-gray-900">
                          • {item.name} x{item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <ReviewForm
                orderId={orderId}
                orderItems={orderItems}
                customerEmail={order.customer_email}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
