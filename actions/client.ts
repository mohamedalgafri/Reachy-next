// actions/client.ts
'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createClient(data: {
  name: string
  image?: string
}) {
  try {
    const client = await db.client.create({
      data: {
        ...data,
        isActive: true
      }
    })

    revalidatePath('/admin/clients')
    return { success: true, data: client }
  } catch (error) {
    console.error('[CLIENT_CREATE]', error)
    return { success: false, error: 'حدث خطأ أثناء إضافة العميل' }
  }
}

export async function updateClient(
  id: number,
  data: {
    name?: string
    image?: string
  }
) {
  try {
    const client = await db.client.update({
      where: { id },
      data
    })

    revalidatePath('/admin/clients')
    return { success: true, data: client }
  } catch (error) {
    console.error('[CLIENT_UPDATE]', error)
    return { success: false, error: 'حدث خطأ أثناء تحديث العميل' }
  }
}

export async function deleteClient(id: number) {
  try {
    await db.client.delete({
      where: { id }
    })

    revalidatePath('/admin/clients')
    return { success: true }
  } catch (error) {
    console.error('[CLIENT_DELETE]', error)
    return { success: false, error: 'حدث خطأ أثناء حذف العميل' }
  }
}

export async function toggleClientVisibility(id: number) {
  try {
    const client = await db.client.findUnique({
      where: { id }
    })

    if (!client) {
      throw new Error('العميل غير موجود')
    }

    const updatedClient = await db.client.update({
      where: { id },
      data: {
        isActive: !client.isActive
      }
    })

    revalidatePath('/admin/clients')
    return { success: true, data: updatedClient }
  } catch (error) {
    console.error('[CLIENT_TOGGLE]', error)
    return { success: false, error: 'حدث خطأ أثناء تحديث حالة العميل' }
  }
}