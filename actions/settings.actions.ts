"use server";
import { DATABASE_ID, databases, SETTINGS_COLLECTION_ID, getSettingsDocumentId } from "@/lib/appwrite";
import { Settings } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { updateSettingsSchema } from "@/lib/validations";

const SETTINGS_DOC_ID = getSettingsDocumentId();

export const getSettings = async (): Promise<Settings> => {
  try {
    const settings: Settings = await databases.getDocument(
      DATABASE_ID,
      SETTINGS_COLLECTION_ID,
      SETTINGS_DOC_ID
    );
    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Return default settings if document not found
    return {
      $id: "",
      topbar_enabled: false,
      topbar_text: "",
      topbar_bg_color: "#000000",
      topbar_text_color: "#ffffff",
    } as Settings;
  }
};

export const updateSettings = async (settings: {
  topbar_enabled: boolean;
  topbar_text: string;
  topbar_bg_color: string;
  topbar_text_color: string;
}) => {
  try {
    // Validate input
    const validatedData = updateSettingsSchema.parse(settings);

    const updatedSettings = await databases.updateDocument(
      DATABASE_ID,
      SETTINGS_COLLECTION_ID,
      SETTINGS_DOC_ID,
      validatedData
    );
    revalidatePath("/admin/topbar");
    revalidatePath("/", "layout");
    return updatedSettings;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};
