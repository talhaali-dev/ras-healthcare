"use server";

import { generateOrderEmail } from "@/lib/email";
import { Order } from "@/types/appwrite.types";
import { RESEND_FROM_EMAIL } from "@/lib/appwrite";
import { getResendClient } from "@/lib/email/client";
import { contactFormSchema } from "@/lib/validations";

export async function sendEmail(prevState: any, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    // Validate input
    const validatedData = contactFormSchema.parse(rawData);

    const resend = getResendClient();
    if (!resend) {
      return { success: false, message: "Email service not configured" };
    }

    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: "alit83219@gmail.com",
      subject: "New Contact Form Submission",
      text: `
        Name: ${validatedData.name}
        Email: ${validatedData.email}
        Message: ${validatedData.message}
      `,
    });

    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error sending email. Please try again." };
  }
}

export const sendOrderConfirmationEmail = async (order: Order) => {
  try {
    const resend = getResendClient();
    if (!resend) {
      console.warn("Cannot send order confirmation email: RESEND_API_KEY not set");
      return;
    }

    const emailTemplate = generateOrderEmail(order);
    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: order.customer_email,
      subject: "Order Confirmation",
      html: emailTemplate,
    });
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};
