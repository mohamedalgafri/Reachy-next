"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Trash, Plus, Loader2 } from "lucide-react";
import { updateSocialLinks } from "@/actions/settings";
import { Card } from "@/components/ui/card";
import { useLocale } from 'next-intl';

const getSocialLinkSchema = (t: any) => {
  const socialLinkSchema = z.object({
    name: z.string().min(1, t.nameRequired),
    url: z.string().url(t.invalidUrl),
    icon: z.string(),
  });

  return z.object({
    links: z.array(socialLinkSchema),
  });
};

export function SocialLinksForm({ settings }) {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [updated, setUpdated] = useState(false);

  const translations = {
    ar: {
      socialLinks: "روابط التواصل الاجتماعي",
      description: "إضافة وتعديل روابط مواقع التواصل الاجتماعي",
      note: "ملاحظة : اختر الأيقونات من هذا الموقع",
      nameRequired: "اسم الموقع مطلوب",
      invalidUrl: "رابط غير صالح",
      siteName: "اسم موقع التواصل الاجتماعي",
      icon: "الأيقونة",
      link: "الرابط",
      addNew: "إضافة رابط جديد",
      saveChanges: "حفظ التغييرات",
      error: "حدث خطأ",
      deletedTemp: "تم حذف الرابط مؤقتاً",
      confirmDelete: "اضغط على حفظ التغييرات لتأكيد الحذف",
      updateSuccess: "تم تحديث روابط التواصل بنجاح"
    },
    en: {
      socialLinks: "Social Links",
      description: "Add and edit social media links",
      note: "Note: Choose icons from this site",
      nameRequired: "Site name is required",
      invalidUrl: "Invalid URL",
      siteName: "Social Media Site Name",
      icon: "Icon",
      link: "Link",
      addNew: "Add New Link",
      saveChanges: "Save Changes",
      error: "Error",
      deletedTemp: "Link temporarily deleted",
      confirmDelete: "Click Save Changes to confirm deletion",
      updateSuccess: "Social links updated successfully"
    }
  };

  const t = translations[locale as keyof typeof translations];
  const socialLinksSchema = getSocialLinkSchema(t);
  type FormData = z.infer<typeof socialLinksSchema>;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      links: settings?.socialLinks || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const handleRemove = (index: number) => {
    setUpdated(true);
    remove(index);
    toast.success(t.deletedTemp, {
      description: t.confirmDelete
    });
  };

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await updateSocialLinks(data.links);

      if (result.error) {
        toast.error(t.error, {
          description: result.error,
        });
      } else {
        setUpdated(false);
        toast.success(t.updateSuccess);
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <SectionColumns
        title={t.socialLinks}
        description={t.description}
      >
        <div className="flex items-center gap-2 mb-2">
          <p>{t.note}</p>
          <a target="_blank" href="https://lucide.dev/icons">lucide</a>
        </div>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 inline-block">{t.siteName}</Label>
                    <Input
                      {...register(`links.${index}.name`)}
                      onChange={() => setUpdated(true)}
                    />
                    {errors?.links?.[index]?.name && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.links[index].name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2 inline-block">{t.icon}</Label>
                    <Input
                      {...register(`links.${index}.icon`)}
                      onChange={() => setUpdated(true)}
                      placeholder="<Instagram />"
                    />
                  </div>
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label className="mb-2 inline-block">{t.link}</Label>
                    <Input
                      {...register(`links.${index}.url`)}
                      onChange={() => setUpdated(true)}
                      dir="ltr"
                    />
                    {errors?.links?.[index]?.url && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.links[index].url.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemove(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              append({ name: "", url: "", icon: "" });
              setUpdated(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.addNew}
          </Button>

          <Button
            type="submit"
            disabled={isPending || !updated}
            className="w-full md:w-auto"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : t.saveChanges}
          </Button>
        </div>
      </SectionColumns>
    </form>
  );
}