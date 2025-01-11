'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageUploader } from './ImageUploader';
import { toast } from "sonner";
import { createFeature, updateFeature } from '@/actions/feature';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from 'next-intl';

interface FeatureFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

export function FeatureForm({ initialData, mode }: FeatureFormProps) {
  const router = useRouter();
  const locale = useLocale();
  
  // Form state
  const [title_ar, setTitleAr] = useState(initialData?.title_ar || '');
  const [title_en, setTitleEn] = useState(initialData?.title_en || '');
  const [subtitle_ar, setSubtitleAr] = useState(initialData?.subtitle_ar || '');
  const [subtitle_en, setSubtitleEn] = useState(initialData?.subtitle_en || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [previewImages, setPreviewImages] = useState<string[]>(
    initialData?.image ? [initialData.image] : []
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const translations = {
    ar: {
      createTitle: "إضافة ميزة جديدة",
      editTitle: "تعديل الميزة",
      title: "العنوان",
      briefDescription: "الوصف المختصر",
      arabic: "العربية",
      english: "English",
      image: "الصورة",
      save: "حفظ",
      saving: "جاري الحفظ...",
      back: "رجوع",
      allFieldsRequired: "جميع الحقول مطلوبة باللغتين",
      featureAddedSuccess: "تم إضافة الميزة بنجاح",
      featureUpdatedSuccess: "تم تحديث الميزة بنجاح",
      unexpectedError: "حدث خطأ غير متوقع",
      titlePlaceholderAr: "أدخل العنوان بالعربية",
      titlePlaceholderEn: "Enter title in English",
      descPlaceholderAr: "أدخل الوصف المختصر بالعربية",
      descPlaceholderEn: "Enter brief description in English"
    },
    en: {
      createTitle: "Add New Feature",
      editTitle: "Edit Feature",
      title: "Title",
      briefDescription: "Brief Description",
      arabic: "Arabic",
      english: "English",
      image: "Image",
      save: "Save",
      saving: "Saving...",
      back: "Back",
      allFieldsRequired: "All fields are required in both languages",
      featureAddedSuccess: "Feature added successfully",
      featureUpdatedSuccess: "Feature updated successfully",
      unexpectedError: "An unexpected error occurred",
      titlePlaceholderAr: "Enter title in Arabic",
      titlePlaceholderEn: "Enter title in English",
      descPlaceholderAr: "Enter brief description in Arabic",
      descPlaceholderEn: "Enter brief description in English"
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
        formData.append('path', 'features');
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await response.json();
        imageUrl = uploadData.secure_url || '';
      }

      const featureData = {
        title_ar,
        title_en,
        subtitle_ar,
        subtitle_en,
        image: imageUrl,
      };

      const result = mode === "create" 
        ? await createFeature(featureData)
        : await updateFeature(initialData.id, featureData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(mode === "create" ? t.featureAddedSuccess : t.featureUpdatedSuccess);
      
      router.push('/admin/features');
      router.refresh();
    } catch (err: any) {
      setError(err.message || t.unexpectedError);
      toast.error(err.message || t.unexpectedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {mode === "create" ? t.createTitle : t.editTitle}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Tabs defaultValue={locale} className="w-full">
              <TabsList>
                <TabsTrigger value="ar">{t.arabic}</TabsTrigger>
                <TabsTrigger value="en">{t.english}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ar" className="space-y-4">
                <div>
                  <Label>{t.title}</Label>
                  <Input
                    value={title_ar}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder={t.titlePlaceholderAr}
                    dir="rtl"
                  />
                </div>

                <div>
                  <Label>{t.briefDescription}</Label>
                  <Textarea
                    value={subtitle_ar}
                    onChange={(e) => setSubtitleAr(e.target.value)}
                    placeholder={t.descPlaceholderAr}
                    className="min-h-[100px]"
                    dir="rtl"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="en" className="space-y-4">
                <div>
                  <Label>{t.title}</Label>
                  <Input
                    value={title_en}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder={t.titlePlaceholderEn}
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label>{t.briefDescription}</Label>
                  <Textarea
                    value={subtitle_en}
                    onChange={(e) => setSubtitleEn(e.target.value)}
                    placeholder={t.descPlaceholderEn}
                    className="min-h-[100px]"
                    dir="ltr"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label>{t.image}</Label>
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
                disabled={loading}
              >
                {t.back}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}