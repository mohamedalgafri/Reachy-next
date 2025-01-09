// components/forms/FeatureForm.tsx
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

interface FeatureFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

export function FeatureForm({ initialData, mode }: FeatureFormProps) {
  const router = useRouter();
  
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
      toast.error('جميع الحقول مطلوبة باللغتين');
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

      toast.success(
        mode === "create" 
          ? "تم إضافة الميزة بنجاح" 
          : "تم تحديث الميزة بنجاح"
      );
      
      router.push('/admin/features');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
      toast.error(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {mode === "create" ? "إضافة ميزة جديدة" : "تعديل الميزة"}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

<Tabs defaultValue="ar" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ar">العربية</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ar" className="space-y-4">
                <div>
                  <Label>العنوان</Label>
                  <Input
                    value={title_ar}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="أدخل العنوان بالعربية"
                    dir="rtl"
                  />
                </div>

                <div>
                  <Label>الوصف المختصر</Label>
                  <Textarea
                    value={subtitle_ar}
                    onChange={(e) => setSubtitleAr(e.target.value)}
                    placeholder="أدخل الوصف المختصر بالعربية"
                    className="min-h-[100px]"
                    dir="rtl"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="en" className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={title_en}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Enter title in English"
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label>Brief Description</Label>
                  <Textarea
                    value={subtitle_en}
                    onChange={(e) => setSubtitleEn(e.target.value)}
                    placeholder="Enter brief description in English"
                    className="min-h-[100px]"
                    dir="ltr"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label>الصورة</Label>
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
                {loading ? "جاري الحفظ..." : "حفظ"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                رجوع
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}