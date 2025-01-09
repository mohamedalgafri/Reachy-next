// actions/toggle-section.ts
'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleSectionVisibility(sectionId: number) {
  try {
    const section = await db.section.findUnique({
      where: { id: sectionId }
    });

    if (!section) {
      return {
        success: false,
        error: "القسم غير موجود"
      };
    }

    const updatedSection = await db.section.update({
      where: { id: sectionId },
      data: { isVisible: !section.isVisible }
    });

    revalidatePath('/admin/sections');

    return {
      success: true,
      data: updatedSection
    };
  } catch (error) {
    console.error("Error toggling section visibility:", error);
    return {
      success: false,
      error: "حدث خطأ أثناء تحديث حالة القسم"
    };
  }
}