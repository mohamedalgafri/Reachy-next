'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface HeroSectionData {
  title_ar: string;
  title_en: string;
  subTitle_ar: string;
  subTitle_en: string;
}

export async function updateHeroSection(sectionId: number, data: HeroSectionData) {
  try {
    // 1. حذف المدخلات القديمة
    await db.input.deleteMany({
      where: { sectionId }
    });

    // 2. إنشاء المدخلات الجديدة
    const updatedSection = await db.section.update({
      where: { id: sectionId },
      data: {
        inputs: {
          create: [
            {
              label: 'title_ar',
              type: 'RICH_TEXT',
              value: data.title_ar,
              order: 1
            },
            {
              label: 'title_en',
              type: 'RICH_TEXT',
              value: data.title_en,
              order: 2
            },
            {
              label: 'subTitle_ar',
              type: 'RICH_TEXT',
              value: data.subTitle_ar,
              order: 3
            },
            {
              label: 'subTitle_en',
              type: 'RICH_TEXT',
              value: data.subTitle_en,
              order: 4
            }
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
    console.error('Error updating hero section:', error);
    return {
      success: false,
      error: 'فشل تحديث القسم'
    };
  }
}