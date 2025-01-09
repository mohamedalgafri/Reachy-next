// actions/about.ts
'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface AboutData {
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  vision_title_ar: string;
  vision_title_en: string;
  vision_content_ar: string;
  vision_content_en: string;
  mission_title_ar: string;
  mission_title_en: string;
  mission_content_ar: string;
  mission_content_en: string;
}

export async function updateAboutSection(sectionId: number, data: AboutData) {
  try {
    // حذف المدخلات القديمة
    await db.input.deleteMany({
      where: { sectionId }
    });

    // إنشاء المدخلات الجديدة
    const updatedSection = await db.section.update({
      where: { id: sectionId },
      data: {
        inputs: {
          create: [
            { label: 'title_ar', type: 'RICH_TEXT', value: data.title_ar, order: 1 },
            { label: 'title_en', type: 'RICH_TEXT', value: data.title_en, order: 2 },
            { label: 'content_ar', type: 'RICH_TEXT', value: data.content_ar, order: 3 },
            { label: 'content_en', type: 'RICH_TEXT', value: data.content_en, order: 4 },
            { label: 'vision_title_ar', type: 'RICH_TEXT', value: data.vision_title_ar, order: 5 },
            { label: 'vision_title_en', type: 'RICH_TEXT', value: data.vision_title_en, order: 6 },
            { label: 'vision_content_ar', type: 'RICH_TEXT', value: data.vision_content_ar, order: 7 },
            { label: 'vision_content_en', type: 'RICH_TEXT', value: data.vision_content_en, order: 8 },
            { label: 'mission_title_ar', type: 'RICH_TEXT', value: data.mission_title_ar, order: 9 },
            { label: 'mission_title_en', type: 'RICH_TEXT', value: data.mission_title_en, order: 10 },
            { label: 'mission_content_ar', type: 'RICH_TEXT', value: data.mission_content_ar, order: 11 },
            { label: 'mission_content_en', type: 'RICH_TEXT', value: data.mission_content_en, order: 12 }
          ]
        }
      },
      include: {
        inputs: true
      }
    });

    revalidatePath('/admin/sections');
    
    return {
      success: true,
      data: updatedSection
    };

  } catch (error) {
    console.error('Error updating about section:', error);
    return {
      success: false,
      error: 'فشل تحديث القسم'
    };
  }
}