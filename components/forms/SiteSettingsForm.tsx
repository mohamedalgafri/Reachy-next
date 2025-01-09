// components/forms/SiteSettingsForm.tsx
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
import { SectionColumns } from "@/components/dashboard/section-columns";
import { useUpload } from "@/hooks/useUpload";
import { updateSiteSettings } from "@/actions/settings";
import { ImageUploader } from "./ImageUploader";
import { TextEditor } from "./TextEditor";

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "اسم الموقع مطلوب").max(50),
  logoImage: z.string().optional(),
  logoText: z.string().optional(),
  email: z.string().email("البريد الإلكتروني غير صالح").optional().or(z.literal("")),
  phone: z.string().regex(/^[0-9+\s-]+$/, "رقم الهاتف غير صالح").optional().or(z.literal("")),
  address: z.string().optional(),
});

type FormData = z.infer<typeof siteSettingsSchema>;

interface SiteSettingsFormProps {
  settings: {
    id?: string;
    siteName?: string;
    logoImage?: string;
    logoText?: string;
    email?: string;
    phone?: string;
    address?: string;
  } | null;
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [updated, setUpdated] = useState(false);
  const [address_ar, setAddress_ar] = useState(settings?.address_ar || "");
  const [address_en, setAddress_en] = useState(settings?.address_en || "");
  const [logoImage, setLogoImage] = useState({
    preview: settings?.logoImage || "",
    file: null as File | null,
  });
  const { uploadFile, isUploading } = useUpload();

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
      address_ar: settings?.address_ar || "",
      address_en: settings?.address_en || "",
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
          toast.error("حدث خطأ", {
            description: result.error,
          });
        } else {
          setUpdated(false);
          toast.success("تم تحديث الإعدادات بنجاح");
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء تحديث الإعدادات");
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="mt-8">

      <div className="pt-8">
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold leading-none">إعدادات الموقع"</h2>
          <p className="text-balance text-sm text-muted-foreground">
            تعديل معلومات الموقع الأساسية
          </p>
        </div>

        <div className="pt-8">
          <div className="space-y-1.5 mb-4">
            <Label htmlFor="siteName">اسم الموقع</Label>
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
            <Label>صورة الشعار</Label>
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
            <Label htmlFor="email">البريد الإلكتروني</Label>
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
            <Label htmlFor="phone">رقم الجوال</Label>
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
              <Label>العنوان بالعربي</Label>
              <div className="mt-2">
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
              <Label>العنوان بالانجليزي</Label>
              <div className="mt-2">
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
              "حفظ التغييرات"
            )}
          </Button>
        </div>
      </div>

    </form>
  );
}