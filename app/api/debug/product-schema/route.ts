import { DATABASE_ID, PRODUCTS_COLLECTION_ID, databases } from "@/lib/appwrite";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET() {
  try {
    // Get one product to see its structure
    const products = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID, [Query.limit(1)]);

    if (products.documents.length === 0) {
      return NextResponse.json({ error: "No products found" });
    }

    const product = products.documents[0];

    // Log the structure
    console.log("Product structure:", JSON.stringify(product, null, 2));

    // Check for potential issues
    const issues: string[] = [];
    const keys = Object.keys(product);

    for (const key of keys) {
      const value = (product as any)[key];
      if (Array.isArray(value)) {
        issues.push(`Field "${key}" is an array. In Appwrite, if this is a Relationship field, it should be a single ID, not an array.`);
      }
    }

    return NextResponse.json({
      product,
      fields: keys,
      issues,
      message: issues.length > 0
        ? "Found issues with product schema. Check console for details."
        : "Product schema looks OK",
    });
  } catch (error: any) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
