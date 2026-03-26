import { Resend } from "resend";
import { RESEND_API_KEY } from "@/lib/appwrite";

let resendClient: Resend | null = null;

/**
 * Get a singleton instance of the Resend client.
 * Returns null if API key is not configured.
 */
export function getResendClient(): Resend | null {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set");
    return null;
  }

  // Return existing instance if already created
  if (resendClient) {
    return resendClient;
  }

  // Create and cache new instance
  resendClient = new Resend(RESEND_API_KEY);
  return resendClient;
}

/**
 * Reset the Resend client instance.
 * Useful for testing or when the API key changes.
 */
export function resetResendClient(): void {
  resendClient = null;
}
