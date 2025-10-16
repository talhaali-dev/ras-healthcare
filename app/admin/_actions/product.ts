"use server";

import { uploadFile } from "@/actions/imageupload";
import { DATABASE_ID, databases, PRODUCTS_COLLECTION_ID } from "@/lib/appwrite";
import { parseStringify } from "@/lib/utils";
import { CreateProductParams } from "@/types";
import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";

export const createProduct = async (ProductData: CreateProductParams) => {
  try {
    const images = await Promise.all(
      ProductData.images.map(async (image) => {
        const data = await uploadFile(image);
        return data?.url;
      })
    );

    const product = await databases.createDocument(
      DATABASE_ID!,
      PRODUCTS_COLLECTION_ID!,
      ID.unique(),
      {
        name: ProductData.name,
        description: ProductData.description,
        price: ProductData.price.toString(),
        images: images,
        stock: `${ProductData.quantity}`,
        benefits: ProductData.benefits,
      }
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/", "layout");

    return product;
  } catch (error) {
    console.log("Error while creating Product ", error);
  }
};

export const getAllProducts = async () => {
  try {
    const products = await databases.listDocuments(
      DATABASE_ID!,
      PRODUCTS_COLLECTION_ID!
    );

    return parseStringify(products);
  } catch (error) {
    console.log("Error while fetching products ", error);
  }
};

export const getProductById = async (productId: string) => {
  try {
    const product = await databases.getDocument(
      DATABASE_ID!,
      PRODUCTS_COLLECTION_ID!,
      productId
    );
    return parseStringify(product);
  } catch (error) {
    console.log("Error while fetching product by id ", error);
  }
};

export const updateProduct = async (
  productId: string,
  productData: CreateProductParams
) => {
  try {
    const images = await Promise.all(
      productData.images.map(async (image) => {
        const data = await uploadFile(image);
        return data?.url;
      })
    );
    const updatedProduct = await databases.updateDocument(
      DATABASE_ID!,
      PRODUCTS_COLLECTION_ID!,
      productId,
      {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        images: images,
        stock: `${productData.quantity}`,
        benefits: productData.benefits.map((b) => b),
      }
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/", "layout");
    return parseStringify(updatedProduct);
  } catch (error) {
    console.log("Error while updating product ", error);
  }
};

export const updateStock = async (productId: string, stock: string) => {
  try {
    const updatedProduct = await databases.updateDocument(
      DATABASE_ID!,
      PRODUCTS_COLLECTION_ID!,
      productId,
      {
        stock: `${stock}`,
      }
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/", "layout");
    return parseStringify(updatedProduct);
  } catch (error) {
    console.log("Error while updating product ", error);
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID!,
      PRODUCTS_COLLECTION_ID!,
      productId
    );
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/", "layout");
    return true;
  } catch (error) {
    console.log("Error while deleting product ", error);
  }
};
