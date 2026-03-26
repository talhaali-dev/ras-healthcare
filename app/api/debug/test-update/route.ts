import { DATABASE_ID, PRODUCTS_COLLECTION_ID, databases } from "@/lib/appwrite";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET() {
  try {
    // Get first product
    const products = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID, [Query.limit(1)]);

    if (products.documents.length === 0) {
      return NextResponse.json({ error: "No products found" });
    }

    const product = products.documents[0];
    const productId = product.$id;

    console.log("Testing stock update for product:", productId);

    // Try to update just the stock field
    const result = await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      {
        stock: "999",
      }
    );

    console.log("Update result:", result);

    return NextResponse.json({
      success: true,
      message: "Stock updated successfully",
      newStock: result.stock,
    });
  } catch (error: any) {
    console.error("Test update error:", error);
    return NextResponse.json({
      error: error.message,
      code: error.code,
      type: error.type,
    }, { status: 500 });
  }
}
