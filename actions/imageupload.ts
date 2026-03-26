"use server"
import { BUCKET_ID, NEXT_PUBLIC_ENDPOINT, NEXT_PUBLIC_PROJECT_ID, storage } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";


export const uploadFile = async (fileData: File | undefined | string) => {
  try {
    if (typeof fileData === "string") {
      return {
        url: fileData
      }
    }
    let file;
    if (fileData) {
      const buffer = await (fileData as File).arrayBuffer();
      const inputFile = InputFile.fromBuffer(Buffer.from(buffer), fileData.name);

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
      const url = file?.$id
        ? `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${NEXT_PUBLIC_PROJECT_ID}`
        : null;
      return {
        url: url,
        fileId: file?.$id,
      };
    }
  } catch (error) {
    console.log("error while creating file", error);
  }
};
