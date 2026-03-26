"use server";

import { uploadFile } from "@/actions/imageupload";
import { DATABASE_ID, databases, PRODUCTS_COLLECTION_ID } from "@/lib/appwrite";
import { parseStringify } from "@/lib/utils";
import { CreateProductParams } from "@/types";
import { Product } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { createProductSchema, updateStockSchema } from "@/lib/validations";

// Helper to normalize product data from database
function normalizeProduct(doc: any): Product {
  return {
    ...doc,
    price: typeof doc.price === "string" ? parseFloat(doc.price) : (doc.price || 0),
    stock: typeof doc.stock === "string" ? parseInt(doc.stock, 10) : (doc.stock || 0),
    // Parse benefits if it's stored as JSON string
    benefits: doc.benefits && typeof doc.benefits === "string"
      ? JSON.parse(doc.benefits)
      : (doc.benefits || []),
  };
}

export const createProduct = async (ProductData: CreateProductParams) => {
  try {
    // Validate input
    const validatedData = createProductSchema.parse(ProductData);

    const images = await Promise.all(
      validatedData.images.map(async (image) => {
        const data = await uploadFile(image);
        return data?.url;
      })
    );

    const product = await databases.createDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      ID.unique(),
      {
        name: validatedData.name,
        description: validatedData.description,
        price: String(validatedData.price),
        images: images,
        stock: String(validatedData.quantity),
        // Store benefits as JSON string if it's a relationship field
        ...(validatedData.benefits && validatedData.benefits.length > 0 ? {
          benefits: JSON.stringify(validatedData.benefits)
        } : {})
      }
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/", "layout");

    return normalizeProduct(product);
  } catch (error) {
    console.error("Error while creating Product:", error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    // Check if environment variables are set
    if (!DATABASE_ID || !PRODUCTS_COLLECTION_ID) {
      console.warn("DATABASE_ID or PRODUCTS_COLLECTION_ID not set");
      return { documents: [], total: 0 };
    }

    const products = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID
    );

    return {
      ...products,
      documents: products.documents.map(normalizeProduct),
    };
  } catch (error) {
    console.error("Error while fetching products:", error);
    return { documents: [], total: 0 };
  }
};

export const getProductById = async (productId: string) => {
  try {
    const product = await databases.getDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId
    );
    return normalizeProduct(product);
  } catch (error) {
    console.error("Error while fetching product by id:", error);
    throw error;
  }
};

export const updateProduct = async (
  productId: string,
  productData: CreateProductParams
) => {
  try {
    // Validate input
    const validatedData = createProductSchema.parse(productData);

    const images = await Promise.all(
      validatedData.images.map(async (image) => {
        const data = await uploadFile(image);
        return data?.url;
      })
    );
    const updatedProduct = await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      {
        name: validatedData.name,
        description: validatedData.description,
        price: String(validatedData.price),
        images: images,
        stock: String(validatedData.quantity),
        // Store benefits as JSON string if it's a relationship field
        ...(validatedData.benefits && validatedData.benefits.length > 0 ? {
          benefits: JSON.stringify(validatedData.benefits)
        } : {})
      }
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/", "layout");
    return normalizeProduct(updatedProduct);
  } catch (error) {
    console.error("Error while updating product:", error);
    throw error;
  }
};

export const updateStock = async (productId: string, stock: number) => {
  try {
    // Validate input
    updateStockSchema.parse({ stock });

    // Only update the stock field - Appwrite preserves other fields automatically
    const updatedProduct = await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      {
        stock: String(stock),
      }
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/", "layout");
    return normalizeProduct(updatedProduct);
  } catch (error) {
    console.error("Error while updating product stock:", error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/", "layout");
    return true;
  } catch (error) {
    console.error("Error while deleting product:", error);
    throw error;
  }
};

/**
 * Search products by name or description
 * @param query - Search query string
 * @returns Matching products
 */
export const searchProducts = async (query: string) => {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.trim().toLowerCase();

    // Get all products (Appwrite doesn't have built-in full-text search)
    const products = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID
    );

    // Filter products client-side by name or description
    const filteredProducts = products.documents.filter((product: any) => {
      const name = product.name?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";
      return name.includes(searchTerm) || description.includes(searchTerm);
    });

    return filteredProducts.map(normalizeProduct);
  } catch (error) {
    console.error("Error while searching products:", error);
    return [];
  }
};
