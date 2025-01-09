// actions/servicesSection.ts
'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface FormData {
  title: {
    ar: string;
    en: string;
  };
}

export async function updateServicesSection(sectionId: number, formData: FormData) {
  if (!formData || !formData.title) {
    return {
      success: false,
      error: 'البيانات المرسلة غير صحيحة'
    };
  }

  try {
    // 1. حذف الإدخالات القديمة
    await db.input.deleteMany({
      where: { 
        sectionId,
        label: { in: ['title_ar', 'title_en'] }
      }
    });

    // 2. إنشاء الإدخالات الجديدة
    const updatedSection = await db.section.update({
      where: { id: sectionId },
      data: {
        inputs: {
          create: [
            {
              label: 'title_ar',
              type: 'RICH_TEXT',
              value: formData.title.ar,
              order: 1
            },
            {
              label: 'title_en',
              type: 'RICH_TEXT',
              value: formData.title.en,
              order: 2
            }
          ]
        }
      },
      include: {
        inputs: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    // 3. تحديث الصفحات
    revalidatePath('/admin/sections');
    revalidatePath('/');

    return {
      success: true,
      data: updatedSection
    };

  } catch (error) {
    console.error('Error updating services section:', error);
    return {
      success: false,
      error: 'فشل تحديث القسم'
    };
  }
}

// دالة مساعدة لتنسيق البيانات
export async function getFormattedServicesData(sectionId: number) {
  try {
    const section = await db.section.findUnique({
      where: { id: sectionId },
      include: {
        inputs: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!section) {
      throw new Error('القسم غير موجود');
    }

    return {
      title: {
        ar: section.inputs.find(i => i.label === 'title_ar')?.value || '',
        en: section.inputs.find(i => i.label === 'title_en')?.value || ''
      }
    };
  } catch (error) {
    console.error('Error formatting services data:', error);
    throw error;
  }
}