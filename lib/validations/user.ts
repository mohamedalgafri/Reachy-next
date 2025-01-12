// lib/validations/user.ts
import * as z from "zod";

const messages = {
  ar: {
    name: {
      min: "الاسم يجب أن يكون على الأقل حرفين",
      max: "الاسم لا يجب أن يتجاوز 32 حرف"
    },
    email: {
      required: "البريد الإلكتروني مطلوب",
      invalid: "البريد الإلكتروني غير صالح"
    },
    password: {
      min: "كلمة المرور يجب أن تكون على الأقل 8 أحرف",
      max: "كلمة المرور لا يجب أن تتجاوز 100 حرف",
      format: "كلمة المرور يجب أن تحتوي على حرف واحد ورقم واحد على الأقل"
    },
    settings: {
      siteNameRequired: "اسم الموقع مطلوب",
      emailInvalid: "البريد الإلكتروني غير صالح"
    },
    social: {
      platformRequired: "المنصة مطلوبة",
      urlInvalid: "الرابط غير صالح"
    }
  },
  en: {
    name: {
      min: "Name must be at least 2 characters",
      max: "Name must not exceed 32 characters"
    },
    email: {
      required: "Email is required",
      invalid: "Invalid email address"
    },
    password: {
      min: "Password must be at least 8 characters",
      max: "Password must not exceed 100 characters",
      format: "Password must contain at least one letter and one number"
    },
    settings: {
      siteNameRequired: "Site name is required",
      emailInvalid: "Invalid email address"
    },
    social: {
      platformRequired: "Platform is required",
      urlInvalid: "Invalid URL"
    }
  }
};

export function createValidationSchemas(locale: 'ar' | 'en' = 'ar') {
  const t = messages[locale];

  const userNameSchema = z.object({
    name: z
      .string()
      .min(2, { message: t.name.min })
      .max(32, { message: t.name.max })
  });

  const emailSchema = z.object({
    email: z
      .string()
      .min(1, { message: t.email.required })
      .email({ message: t.email.invalid })
  });

  const passwordSchema = z.object({
    password: z
      .string()
      .min(8, { message: t.password.min })
      .max(100, { message: t.password.max })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, {
        message: t.password.format
      })
  });

  const settingsSchema = z.object({
    siteName: z.string().min(1, { message: t.settings.siteNameRequired }),
    logoImage: z.string().optional(),
    logoText: z.string().optional(),
    email: z.string().email({ message: t.settings.emailInvalid }).optional(),
    phone: z.string().optional(),
    address_ar: z.string().optional(),
    address_en: z.string().optional()
  });

  const socialLinkSchema = z.object({
    platform: z.string().min(1, { message: t.social.platformRequired }),
    url: z.string().url({ message: t.social.urlInvalid })
  });

  return {
    userNameSchema,
    emailSchema,
    passwordSchema,
    settingsSchema,
    socialLinkSchema
  };
}

// تصدير الإصدار الافتراضي (العربية)
export const {
  userNameSchema,
  emailSchema,
  passwordSchema,
  settingsSchema,
  socialLinkSchema
} = createValidationSchemas('ar');