import { Order } from "@/types/appwrite.types";
import { generateReviewToken } from "@/lib/utils/review-token";
import { RESEND_FROM_EMAIL } from "@/lib/appwrite";
import { getResendClient } from "./client";

/**
 * Generate HTML email template for review request
 */
export function generateReviewRequestEmail(
  order: Order,
  reviewToken: string,
  reviewUrl: string
): string {
  const orderDate = new Date(order.$createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reviewLink = `${reviewUrl}/review/${reviewToken}`;

  // Parse order items to get product info
  const orderItems = JSON.parse(order.order_items);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Review Your Order - Ras Healthcare</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f8f8;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #4a4a4a;
            margin-bottom: 10px;
            font-size: 24px;
          }
          p {
            margin-bottom: 20px;
            color: #666;
          }
          .order-details {
            background-color: #f9f9f9;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
          }
          .order-details p {
            margin-bottom: 8px;
            color: #444;
          }
          .order-details p:last-child {
            margin-bottom: 0;
          }
          .order-info {
            font-size: 14px;
            color: #777;
          }
          .product-name {
            font-weight: 600;
            color: #333;
          }
          .cta-button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #3b82f6;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
          }
          .cta-button:hover {
            background-color: #2563eb;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            font-size: 14px;
            color: #888;
          }
          .stars {
            display: flex;
            gap: 4px;
            color: #f59e0b;
            font-size: 20px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>How was your experience?</h1>
          <p>
            Your order has been shipped and we'd love to hear your thoughts on your
            recent purchase from Ras Healthcare.
          </p>

          <div class="order-details">
            <p><strong>Order Number:</strong> <span class="order-info">#${order.$id}</span></p>
            <p><strong>Order Date:</strong> <span class="order-info">${orderDate}</span></p>
            <p><strong>Products:</strong></p>
            ${orderItems
              .map((item: any) => `<p class="product-name">• ${item.name} x${item.quantity}</p>`)
              .join("")}
          </div>

          <p>
            Your feedback helps us improve and helps other customers make informed
            decisions. It only takes a minute!
          </p>

          <div class="stars">★★★★★☆</div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${reviewLink}" class="cta-button">
              Write a Review
            </a>
          </div>

          <div class="footer">
            <p>This review link is unique to your order and can only be used once.</p>
            <p>Thank you for choosing Ras Healthcare!</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send review request email when order is shipped
 */
export async function sendReviewRequestEmail(order: Order): Promise<void> {
  try {
    const resend = getResendClient();
    if (!resend) {
      console.warn("Cannot send review request email: RESEND_API_KEY not set");
      return;
    }

    const reviewToken = generateReviewToken(order.$id);
    const reviewUrl = process.env.NEXT_PUBLIC_URL
      ? process.env.NEXT_PUBLIC_URL.replace(/\/$/, "")
      : "http://localhost:3000";

    const emailHtml = generateReviewRequestEmail(order, reviewToken, reviewUrl);

    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: order.customer_email,
      subject: "Review Your Order - Ras Healthcare",
      html: emailHtml,
    });

    console.log(`Review request email sent to ${order.customer_email} for order ${order.$id}`);
  } catch (error) {
    console.error("Failed to send review request email:", error);
    // Don't throw error - we don't want to block the order status update
  }
}
