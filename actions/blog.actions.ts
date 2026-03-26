"use server";

import { CreateBlogProps } from "@/types";
import { uploadFile } from "./imageupload";
import { BLOGS_COLLECTION_ID, DATABASE_ID, databases } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { createBlogSchema } from "@/lib/validations";

export const createBlog = async (blogData: CreateBlogProps) => {
  try {
    // Validate input
    const validatedData = createBlogSchema.parse(blogData);

    // Handle different coverImage types
    let coverImageFile: File | string | undefined;
    if (Array.isArray(validatedData.coverImage)) {
      coverImageFile = validatedData.coverImage[0];
    } else {
      coverImageFile = validatedData.coverImage;
    }

    const image = await uploadFile(coverImageFile);
    if (image) {
      const blog = await databases.createDocument(
        DATABASE_ID,
        BLOGS_COLLECTION_ID,
        ID.unique(),
        {
          title: validatedData.title,
          content: validatedData.content,
          coverImage: image.url,
          slug: validatedData.slug,
        }
      );
      revalidatePath("/admin/blog");
      revalidatePath("/");
      revalidatePath("/blog");
      return parseStringify(blog);
    }
  } catch (error) {
    console.error("Error while creating blog:", error);
    throw error;
  }
};

export const getAllBlogs = async () => {
  try {
    // Check if environment variables are set
    if (!DATABASE_ID || !BLOGS_COLLECTION_ID) {
      console.warn("DATABASE_ID or BLOGS_COLLECTION_ID not set");
      return [];
    }

    const blogs = await databases.listDocuments(
      DATABASE_ID,
      BLOGS_COLLECTION_ID
    );
    return parseStringify(blogs.documents);
  } catch (error) {
    console.error("Error while getting blogs:", error);
    return [];
  }
};

export const getBlog = async (blogId: string) => {
  try {
    const blog = await databases.getDocument(
      DATABASE_ID,
      BLOGS_COLLECTION_ID,
      blogId
    );
    return parseStringify(blog);
  } catch (error) {
    console.error("Error while getting blog:", error);
    throw error;
  }
};

export const updateBlog = async (blogId: string, blogData: CreateBlogProps) => {
  try {
    // Validate input
    const validatedData = createBlogSchema.parse(blogData);

    // Handle different coverImage types
    let coverImageFile: File | string | undefined;
    if (Array.isArray(validatedData.coverImage)) {
      coverImageFile = validatedData.coverImage[0];
    } else {
      coverImageFile = validatedData.coverImage;
    }

    const image = await uploadFile(coverImageFile);
    if (image) {
      const blog = await databases.updateDocument(
        DATABASE_ID,
        BLOGS_COLLECTION_ID,
        blogId,
        {
          title: validatedData.title,
          content: validatedData.content,
          coverImage: image.url,
          slug: validatedData.slug,
        }
      );
      revalidatePath("/admin/blog");
      revalidatePath("/");
      revalidatePath("/blog");
      return parseStringify(blog);
    }
  } catch (error) {
    console.error("Error while updating blog:", error);
    throw error;
  }
};

export const deleteBlog = async (id: string) => {
  try {
    const blog = await databases.deleteDocument(
      DATABASE_ID,
      BLOGS_COLLECTION_ID,
      id
    );
    revalidatePath("/admin/blog");
    revalidatePath("/");
    revalidatePath("/blog");
    return parseStringify(blog);
  } catch (error) {
    console.error("Error while deleting blog:", error);
    throw error;
  }
}
