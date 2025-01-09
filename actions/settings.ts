// actions/settings.ts
"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

interface SettingsData {
  siteName: string;
  logoImage?: string;
  logoText?: string;
  email?: string;
  phone?: string;
  address_ar?: string;
  address_en?: string;
}

export async function updateSiteSettings(data: SettingsData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "غير مصرح" };
    }

    const settings = await db.settings.findFirst();
    
    if (settings) {
      await db.settings.update({
        where: { id: settings.id },
        data: {
          siteName: data.siteName,
          logoImage: data.logoImage,
          logoText: data.logoText,
          email: data.email,
          phone: data.phone,
          address_ar: data.address_ar,
          address_en: data.address_en,
        },
      });
    } else {
      await db.settings.create({
        data: {
          siteName: data.siteName,
          logoImage: data.logoImage,
          logoText: data.logoText,
          email: data.email,
          phone: data.phone,
          address_ar: data.address_ar,
          address_en: data.address_en,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("[SETTINGS_UPDATE]", error);
    return { error: "حدث خطأ في تحديث الإعدادات" };
  }
}

export async function updateSocialLinks(data: any[]) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "غير مصرح" };
    }

    const settings = await db.settings.findFirst();
    
    if (settings) {
      await db.settings.update({
        where: { id: settings.id },
        data: {
          socialLinks: data,
        },
      });
    }
    
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("[SOCIAL_LINKS_UPDATE]", error);
    return { error: "حدث خطأ في تحديث روابط التواصل" };
  }
}