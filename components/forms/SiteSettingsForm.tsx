"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpload } from "@/hooks/useUpload";
import { updateSiteSettings } from "@/actions/settings";
import { ImageUploader } from "./ImageUploader";
import { TextEditor } from "./TextEditor";
import { useLocale } from 'next-intl';

const getSiteSettingsSchema = (t: any) => z.object({
  siteName: z.string().min(1, t.siteNameRequired).max(50),
  logoImage: z.string().optional(),
  logoText: z.string().optional(),
  email: z.string().email(t.invalidEmail).optional().or(z.literal("")),
  phone: z.string().regex(/^[0-9+\s-]+$/, t.invalidPhone).optional().or(z.literal("")),
  address: z.string().optional(),
});

interface SiteSettingsFormProps {
  settings: {
    id?: string;
    siteName?: string;
    logoImage?: string;
    logoText?: string;
    email?: string;
    phone?: string;
    address_ar?: string;
    address_en?: string;
  } | null;
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [updated, setUpdated] = useState(false);
  const [address_ar, setAddress_ar] = useState(settings?.address_ar || "");
  const [address_en, setAddress_en] = useState(settings?.address_en || "");
  const [logoImage, setLogoImage] = useState({
    preview: settings?.logoImage || "",
    file: null as File | null,
  });
  const { uploadFile, isUploading } = useUpload();

  const translations = {
    ar: {
      siteSettings: "إعدادات الموقع",
      description: "تعديل معلومات الموقع الأساسية",
      siteNameRequired: "اسم الموقع مطلوب",
      invalidEmail: "البريد الإلكتروني غير صالح",
      invalidPhone: "رقم الهاتف غير صالح",
      siteName: "اسم الموقع",
      logo: "صورة الشعار",
      email: "البريد الإلكتروني",
      phone: "رقم الجوال",
      addressAr: "العنوان بالعربي",
      addressEn: "العنوان بالانجليزي",
      saveChanges: "حفظ التغييرات",
      error: "حدث خطأ",
      updateSuccess: "تم تحديث الإعدادات بنجاح",
      updateError: "حدث خطأ أثناء تحديث الإعدادات"
    },
    en: {
      siteSettings: "Site Settings",
      description: "Edit basic site information",
      siteNameRequired: "Site name is required",
      invalidEmail: "Invalid email address",
      invalidPhone: "Invalid phone number",
      siteName: "Site Name",
      logo: "Logo Image",
      email: "Email Address",
      phone: "Phone Number",
      addressAr: "Address in Arabic",
      addressEn: "Address in English",
      saveChanges: "Save Changes",
      error: "Error",
      updateSuccess: "Settings updated successfully",
      updateError: "Error updating settings"
    }
  };

  const t = translations[locale as keyof typeof translations];
  const siteSettingsSchema = getSiteSettingsSchema(t);
  type FormData = z.infer<typeof siteSettingsSchema>;

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: settings?.siteName || "",
      logoImage: settings?.logoImage || "",
      logoText: settings?.logoText || "",
      email: settings?.email || "",
      phone: settings?.phone || "",
    },
  });

  const handleLogoImageChange = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      setLogoImage({
        preview,
        file,
      });
      setUpdated(true);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    startTransition(async () => {
      try {
        let logoUrl = logoImage.preview;

        if (logoImage.file) {
          const uploadResult = await uploadFile(logoImage.file);
          if (uploadResult) {
            logoUrl = uploadResult.url;
          }
        }

        const result = await updateSiteSettings({
          ...data,
          logoImage: logoUrl,
          address_ar,
          address_en,
        });

        if (result.error) {
          toast.error(t.error, {
            description: result.error,
          });
        } else {
          setUpdated(false);
          toast.success(t.updateSuccess);
        }
      } catch (error) {
        toast.error(t.updateError);
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <div className="pt-8">
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold leading-none">{t.siteSettings}</h2>
          <p className="text-balance text-sm text-muted-foreground">
            {t.description}
          </p>
        </div>

        <div className="pt-8">
          <div className="space-y-1.5 mb-4">
            <Label htmlFor="siteName">{t.siteName}</Label>
            <Input
              id="siteName"
              className="mt-2"
              {...register("siteName")}
              onChange={(e) => setUpdated(true)}
            />
            {errors?.siteName && (
              <p className="text-red-600 text-sm mt-1">{errors.siteName.message}</p>
            )}
          </div>

          <div className="mb-4">
            <Label>{t.logo}</Label>
            <div className="mt-2">
              <ImageUploader
                onImagesChange={handleLogoImageChange}
                previewImages={logoImage.preview ? [logoImage.preview] : []}
                onRemoveImage={() => {
                  setLogoImage({ preview: "", file: null });
                  setValue("logoImage", "");
                  setUpdated(true);
                }}
                disabled={isPending}
                maxImages={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="mb-4">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                className="mt-2"
                {...register("email")}
                onChange={(e) => setUpdated(true)}
                dir="ltr"
              />
              {errors?.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
              <Label htmlFor="phone">{t.phone}</Label>
              <Input
                id="phone"
                type="tel"
                className="mt-2"
                {...register("phone")}
                onChange={(e) => setUpdated(true)}
                dir="ltr"
              />
              {errors?.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="mb-4">
              <Label>{t.addressAr}</Label>
              <div className="mt-2" dir="rtl">
                <TextEditor
                  value={address_ar}
                  onChange={(value) => {
                    setAddress_ar(value);
                    setUpdated(true);
                  }}
                />
              </div>
            </div>

            <div className="mb-4">
              <Label>{t.addressEn}</Label>
              <div className="mt-2" dir="ltr">
                <TextEditor
                  value={address_en}
                  onChange={(value) => {
                    setAddress_en(value);
                    setUpdated(true);
                  }}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending || isUploading || !updated}
            className="w-full md:w-auto"
          >
            {isPending || isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t.saveChanges
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}