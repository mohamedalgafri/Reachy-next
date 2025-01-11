'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { TextEditor } from './TextEditor';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageUploader } from './ImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { createService, updateService } from '@/actions/service';
import { useLocale } from 'next-intl';

interface ServiceFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

export function ServiceForm({ initialData, mode }: ServiceFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [title_ar, setTitleAr] = useState(initialData?.title_ar || '');
  const [title_en, setTitleEn] = useState(initialData?.title_en || '');
  const [subtitle_ar, setSubtitleAr] = useState(initialData?.subtitle_ar || '');
  const [subtitle_en, setSubtitleEn] = useState(initialData?.subtitle_en || '');
  const [previewImages, setPreviewImages] = useState<string[]>(
    initialData?.image ? [initialData.image] : []
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const translations = {
    ar: {
      create: "إضافة خدمة جديدة",
      edit: "تعديل الخدمة",
      description: "أدخل تفاصيل الخدمة باللغتين العربية والإنجليزية",
      arabic: "العربية",
      english: "English",
      serviceTitle: "عنوان الخدمة",
      serviceTitleEn: "Service Title",
      briefDesc: "الوصف المختصر",
      briefDescEn: "Brief Description",
      serviceImage: "صورة الخدمة",
      save: "حفظ",
      saving: "جاري الحفظ...",
      cancel: "إلغاء",
      allFieldsRequired: "جميع الحقول مطلوبة باللغتين",
      createSuccess: "تم إنشاء الخدمة بنجاح",
      updateSuccess: "تم تحديث الخدمة بنجاح",
      unexpectedError: "حدث خطأ غير متوقع"
    },
    en: {
      create: "Add New Service",
      edit: "Edit Service",
      description: "Enter service details in both Arabic and English",
      arabic: "Arabic",
      english: "English",
      serviceTitle: "Service Title",
      serviceTitleAr: "Service Title (Arabic)",
      briefDesc: "Brief Description",
      briefDescAr: "Brief Description (Arabic)",
      serviceImage: "Service Image",
      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
      allFieldsRequired: "All fields are required in both languages",
      createSuccess: "Service created successfully",
      updateSuccess: "Service updated successfully",
      unexpectedError: "An unexpected error occurred"
    }
  };

  const t = translations[locale as keyof typeof translations];

  const handleImagesChange = (files: File[]) => {
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(urls);
    setImageFiles(files);
  };

  const handleRemoveImage = () => {
    setPreviewImages([]);
    setImageFiles([]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title_ar || !title_en || !subtitle_ar || !subtitle_en) {
      toast.error(t.allFieldsRequired);
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrl = initialData?.image || '';
      if (imageFiles.length > 0) {
        const formData = new FormData();
        formData.append('file', imageFiles[0]);
        formData.append('path', 'services');
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await response.json();
        imageUrl = uploadData.secure_url || '';
      }

      const serviceData = {
        title_ar,
        title_en,
        subtitle_ar,
        subtitle_en,
        image: imageUrl,
      };

      const result = mode === "create" 
        ? await createService(serviceData)
        : await updateService(initialData.id, serviceData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(mode === "create" ? t.createSuccess : t.updateSuccess);
      
      router.push('/admin/services');
      router.refresh();
    } catch (err: any) {
      setError(err.message || t.unexpectedError);
      toast.error(err.message || t.unexpectedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {mode === "create" ? t.create : t.edit}
          </h2>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Tabs defaultValue="ar" className="w-full">
              <TabsList>
                <TabsTrigger value="ar">{t.arabic}</TabsTrigger>
                <TabsTrigger value="en">{t.english}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ar" className="space-y-4">
                <div>
                  <Label>{locale === 'ar' ? t.serviceTitle : t.serviceTitleAr}</Label>
                  <TextEditor
                    value={title_ar}
                    onChange={setTitleAr}
                    dir="rtl"
                  />
                </div>

                <div>
                  <Label>{locale === 'ar' ? t.briefDesc : t.briefDescAr}</Label>
                  <TextEditor
                    value={subtitle_ar}
                    onChange={setSubtitleAr}
                    dir="rtl"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="en" className="space-y-4">
                <div>
                  <Label>{t.serviceTitle}</Label>
                  <TextEditor
                    value={title_en}
                    onChange={setTitleEn}
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label>{t.briefDesc}</Label>
                  <TextEditor
                    value={subtitle_en}
                    onChange={setSubtitleEn}
                    dir="ltr"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label>{t.serviceImage}</Label>
              <ImageUploader
                onImagesChange={handleImagesChange}
                previewImages={previewImages}
                onRemoveImage={handleRemoveImage}
                maxImages={1}
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? t.saving : t.save}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t.cancel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}