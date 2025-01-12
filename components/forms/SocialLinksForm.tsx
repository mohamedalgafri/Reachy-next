"use client";

import React, { useState, useTransition, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Trash, Plus, Loader2, Check } from "lucide-react";
import { updateSocialLinks } from "@/actions/settings";
import { Card } from "@/components/ui/card";
import { useLocale } from 'next-intl';
import * as Icons from 'react-icons/fa6';

const DEFAULT_SOCIAL_ICONS = [
  { name: 'X (Twitter)', IconComponent: Icons.FaXTwitter, iconComponent: '<FaXTwitter />' },
  { name: 'Facebook', IconComponent: Icons.FaFacebookF, iconComponent: '<FaFacebookF />' },
  { name: 'Instagram', IconComponent: Icons.FaInstagram, iconComponent: '<FaInstagram />' },
  { name: 'TikTok', IconComponent: Icons.FaTiktok, iconComponent: '<FaTiktok />' },
  { name: 'LinkedIn', IconComponent: Icons.FaLinkedinIn, iconComponent: '<FaLinkedinIn />' },
  { name: 'Snapchat', IconComponent: Icons.FaSnapchat, iconComponent: '<FaSnapchat />' },
  { name: 'YouTube', IconComponent: Icons.FaYoutube, iconComponent: '<FaYoutube />' },
  { name: 'Behance', IconComponent: Icons.FaBehance, iconComponent: '<FaBehance />' },
  { name: 'Pinterest', IconComponent: Icons.FaPinterest, iconComponent: '<FaPinterest />' },
  { name: 'Threads', IconComponent: Icons.FaThreads, iconComponent: '<FaThreads />' }
];

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
  const [customIcons, setCustomIcons] = useState([]);

  const translations = {
    ar: {
      socialLinks: "روابط التواصل الاجتماعي",
      description: "إضافة وتعديل روابط مواقع التواصل الاجتماعي",
      note: "اختر من الأيقونات التالية أو قم بالبحث عن أيقونات أخرى من الموقع",
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
      updateSuccess: "تم تحديث روابط التواصل بنجاح",
      clickToCopy: "انقر لإضافة الأيقونة",
      iconUsed: "الأيقونة مستخدمة",
      moreIcons: "المزيد من الأيقونات"
    },
    en: {
      socialLinks: "Social Links",
      description: "Add and edit social media links",
      note: "Choose from the icons below or search for more icons from the site",
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
      updateSuccess: "Social links updated successfully",
      clickToCopy: "Click to add icon",
      iconUsed: "Icon is used",
      moreIcons: "More Icons"
    }
  };

  const t = translations[locale as keyof typeof translations];
  const socialLinksSchema = getSocialLinkSchema(t);
  type FormData = z.infer<typeof socialLinksSchema>;

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
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

  // تتبع الأيقونات المستخدمة
  const usedIcons = watch('links').map(link => link.icon);

  // دمج الأيقونات الافتراضية مع الأيقونات المخصصة
  const allIcons = useMemo(() => {
    const existingCustomIcons = usedIcons
      .filter(icon => !DEFAULT_SOCIAL_ICONS.some(defaultIcon => defaultIcon.iconComponent === icon))
      .map(icon => ({
        name: 'Custom Icon',
        iconComponent: icon,
        isCustom: true
      }));

    const uniqueCustomIcons = existingCustomIcons.filter(
      icon => !customIcons.some(customIcon => customIcon.iconComponent === icon.iconComponent)
    );

    return [...DEFAULT_SOCIAL_ICONS, ...customIcons, ...uniqueCustomIcons];
  }, [customIcons, usedIcons]);

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

  const handleAddIcon = (iconInfo: any) => {
    // تحقق ما إذا كانت الأيقونة مستخدمة بالفعل
    if (usedIcons.includes(iconInfo.iconComponent)) {
      toast.error(t.iconUsed);
      return;
    }

    append({
      name: iconInfo.name,
      icon: iconInfo.iconComponent,
      url: ""
    });
    setUpdated(true);
  };

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <SectionColumns
        title={t.socialLinks}
        description={t.description}
      >
        <div className="flex flex-col lg:flex-row items-center gap-2 mb-2">
          <p>{t.note}</p>
          <a 
            target="_blank" 
            href="https://react-icons.github.io/react-icons/icons/fa6/"
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            {t.moreIcons}
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
          {allIcons.map((socialIcon) => {
            const isUsed = usedIcons.includes(socialIcon.iconComponent);
            return (
              <button
                key={socialIcon.iconComponent}
                type="button"
                onClick={() => handleAddIcon(socialIcon)}
                disabled={isUsed}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all cursor-pointer group
                  ${isUsed ? 'bg-gray-300 dark:bg-gray-700' : ' hover:bg-gray-300 hover:dark:bg-gray-700 '}`}
                title={isUsed ? t.iconUsed : t.clickToCopy}
              >
                {/* علامة الصح للأيقونات المستخدمة */}
                {isUsed && (
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                
                <div className={`text-base transition-colors ${isUsed ? 'text-black dark:text-white' : 'text-black dark:text-white group-hover:text-black dark:group-hover:text-white'}`}>
                  {socialIcon.isCustom ? (
                    <div className="h-5 w-5 flex items-center justify-center">
                      {/* يمكن إضافة شكل أو رمز للأيقونات المخصصة */}
                      <Icons.FaCode />
                    </div>
                  ) : (
                    <socialIcon.IconComponent />
                  )}
                </div>
                <span className={`text-xs text-center transition-colors ${isUsed ? 'text-black dark:text-white' : 'text-black dark:text-white group-hover:text-black dark:group-hover:text-white'}`}>
                  {socialIcon.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      onChange={(e) => {
                        setUpdated(true);
                        // إذا كانت أيقونة جديدة، أضفها إلى القائمة المخصصة
                        const iconComponent = e.target.value;
                        if (!DEFAULT_SOCIAL_ICONS.some(icon => icon.iconComponent === iconComponent) &&
                            !customIcons.some(icon => icon.iconComponent === iconComponent)) {
                          setCustomIcons(prev => [...prev, {
                            name: 'Custom Icon',
                            iconComponent,
                            isCustom: true
                          }]);
                        }
                      }}
                      placeholder="<FaFacebookF />"
                      dir="ltr"
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