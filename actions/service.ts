'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface ServiceInput {
  title_ar: string
  title_en: string
  subtitle_ar: string
  subtitle_en: string
  image?: string
}

export async function createService(data: ServiceInput) {
  try {
    if (!data.title_ar || !data.title_en || !data.subtitle_ar || !data.subtitle_en) {
      return { 
        success: false, 
        error: 'جميع الحقول مطلوبة بالعربية والإنجليزية' 
      }
    }

    const service = await db.service.create({
      data: {
        ...data,
        isActive: true
      }
    })

    revalidatePath('/admin/services')
    return { success: true, data: service }
  } catch (error) {
    console.error('[SERVICE_CREATE]', error)
    return { 
      success: false, 
      error: 'حدث خطأ أثناء إنشاء الخدمة' 
    }
  }
}

export async function updateService(
  id: number,
  data: Partial<ServiceInput>
) {
  try {
    const service = await db.service.update({
      where: { id },
      data
    })
    
    revalidatePath('/admin/services')
    return { success: true, data: service }
  } catch (error) {
    console.error('[SERVICE_UPDATE]', error)
    return { 
      success: false, 
      error: 'حدث خطأ أثناء تحديث الخدمة' 
    }
  }
}

export async function deleteService(id: number) {
  try {
    await db.service.delete({
      where: { id }
    })
    
    revalidatePath('/admin/services')
    return { success: true }
  } catch (error) {
    console.error('[SERVICE_DELETE]', error)
    return { 
      success: false, 
      error: 'حدث خطأ أثناء حذف الخدمة' 
    }
  }
}

export async function toggleServiceVisibility(id: number) {
  try {
    const service = await db.service.findUnique({
      where: { id }
    })

    if (!service) {
      throw new Error('الخدمة غير موجودة')
    }

    const updatedService = await db.service.update({
      where: { id },
      data: {
        isActive: !service.isActive
      }
    })
    
    revalidatePath('/admin/services')
    return { success: true, data: updatedService }
  } catch (error) {
    console.error('[SERVICE_TOGGLE]', error)
    return { 
      success: false, 
      error: 'حدث خطأ أثناء تحديث حالة الخدمة' 
    }
  }
}