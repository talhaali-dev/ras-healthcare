import * as sdk from "node-appwrite";

// Re-export environment variables directly from process.env
// This allows build to proceed without validation
export const NEXT_PUBLIC_ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT || "";
export const NEXT_PUBLIC_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || "";
export const DATABASE_ID = process.env.DATABASE_ID || "";
export const PRODUCTS_COLLECTION_ID = process.env.PRODUCTS_COLLECTION_ID || "";
export const ORDERS_COLLECTION_ID = process.env.ORDERS_COLLECTION_ID || "";
export const BLOGS_COLLECTION_ID = process.env.BLOGS_COLLECTION_ID || "";
export const BUCKET_ID = process.env.BUCKET_ID || "";
export const SETTINGS_COLLECTION_ID = process.env.SETTINGS_COLLECTION_ID || "";
export const COUPON_COLLECTION_ID = process.env.COUPON_COLLECTION_ID || "";
export const REVIEWS_COLLECTION_ID = process.env.REVIEWS_COLLECTION_ID || "";

// Email configuration
export const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "ras@talhaali.xyz";

// Validate required environment variables at runtime
function validateRequiredVars() {
  const required = {
    NEXT_PUBLIC_ENDPOINT,
    NEXT_PUBLIC_PROJECT_ID,
    DATABASE_ID,
    PRODUCTS_COLLECTION_ID,
    ORDERS_COLLECTION_ID,
    BLOGS_COLLECTION_ID,
    BUCKET_ID,
    SETTINGS_COLLECTION_ID,
    COUPON_COLLECTION_ID,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((m) => `  - ${m}`).join("\n")}\n\nPlease check your .env file.`
    );
  }
}

const client = new sdk.Client();

client
  .setEndpoint(NEXT_PUBLIC_ENDPOINT)
  .setProject(NEXT_PUBLIC_PROJECT_ID)
  .setKey(process.env.API_KEY || "");

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
export const account = new sdk.Account(client);

// Get the settings document ID from env or use default
export const getSettingsDocumentId = () => {
  return process.env.SETTINGS_DOCUMENT_ID || "671df7da000082dbd932";
};
