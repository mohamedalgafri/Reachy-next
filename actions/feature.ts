// actions/feature.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface FeatureData {
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  image?: string;
}

export async function createFeature(data: FeatureData) {
  try {
    const feature = await db.feature.create({
      data: {
        ...data,
        isActive: true
      }
    });
    revalidatePath("/admin/features");
    return { success: true, data: feature };
  } catch (error) {
    console.error("[FEATURE_CREATE]", error);
    return { success: false, error: "حدث خطأ أثناء إضافة الميزة" };
  }
}

export async function updateFeature(id: number, data: Partial<FeatureData>) {
  try {
    const feature = await db.feature.update({
      where: { id },
      data
    });
    revalidatePath("/admin/features");
    return { success: true, data: feature };
  } catch (error) {
    console.error("[FEATURE_UPDATE]", error);
    return { success: false, error: "حدث خطأ أثناء تحديث الميزة" };
  }
}

export async function deleteFeature(id: number) {
  try {
    await db.feature.delete({
      where: { id }
    });
    revalidatePath("/admin/features");
    return { success: true };
  } catch (error) {
    console.error("[FEATURE_DELETE]", error);
    return { success: false, error: "حدث خطأ أثناء حذف الميزة" };
  }
}

export async function toggleFeatureVisibility(id: number) {
  try {
    const feature = await db.feature.findUnique({
      where: { id }
    });
    if (!feature) {
      throw new Error("الميزة غير موجودة");
    }
    const updatedFeature = await db.feature.update({
      where: { id },
      data: {
        isActive: !feature.isActive
      }
    });
    revalidatePath("/admin/features");
    return { success: true, data: updatedFeature };
  } catch (error) {
    console.error("[FEATURE_TOGGLE]", error);
    return { success: false, error: "حدث خطأ أثناء تحديث حالة الميزة" };
  }
}