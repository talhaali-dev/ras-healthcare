/**
 * Generates a review token from an order ID
 * Uses simple base64 encoding of the order ID
 * @param orderId - The order ID to encode
 * @returns A base64 encoded token
 */
export function generateReviewToken(orderId: string): string {
  // Simple base64 encoding of the order ID
  // In production, you might want to add expiration or HMAC signature
  return Buffer.from(orderId).toString('base64url');
}

/**
 * Decodes a review token to get the order ID
 * @param token - The review token to decode
 * @returns The decoded order ID
 * @throws Error if token is invalid
 */
export function decodeReviewToken(token: string): string {
  try {
    // Decode base64url token to get the order ID
    const orderId = Buffer.from(token, 'base64url').toString('utf-8');

    if (!orderId || orderId.length === 0) {
      throw new Error('Invalid token');
    }

    return orderId;
  } catch (error) {
    throw new Error('Invalid review token');
  }
}

/**
 * Validates if a token appears to be a valid review token
 * @param token - The token to validate
 * @returns true if the token appears valid
 */
export function isValidReviewToken(token: string): boolean {
  try {
    const orderId = decodeReviewToken(token);
    return orderId.length > 0;
  } catch {
    return false;
  }
}
