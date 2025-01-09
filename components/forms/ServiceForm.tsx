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

interface ServiceFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

export function ServiceForm({ initialData, mode }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [title_ar, setTitleAr] = useState(initialData?.title_ar || '');
  const [title_en, setTitleEn] = useState(initialData?.title_en || '');
  const [subtitle_ar, setSubtitleAr] = useState(initialData?.subtitle_ar || '');
  const [subtitle_en, setSubtitleEn] = useState(initialData?.subtitle_en || '');
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

      toast.success(
        mode === "create" 
          ? "تم إنشاء الخدمة بنجاح" 
          : "تم تحديث الخدمة بنجاح"
      );
      
      router.push('/admin/services');
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
            {mode === "create" ? "إضافة خدمة جديدة" : "تعديل الخدمة"}
          </h2>
          <CardDescription>
            أدخل تفاصيل الخدمة باللغتين العربية والإنجليزية
          </CardDescription>
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
                  <Label>عنوان الخدمة</Label>
                  <TextEditor
                    value={title_ar}
                    onChange={setTitleAr}
                    dir="rtl"
                  />
                </div>

                <div>
                  <Label>الوصف المختصر</Label>
                  <TextEditor
                    value={subtitle_ar}
                    onChange={setSubtitleAr}
                    dir="rtl"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="en" className="space-y-4">
                <div>
                  <Label>Service Title</Label>
                  <TextEditor
                    value={title_en}
                    onChange={setTitleEn}
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label>Brief Description</Label>
                  <TextEditor
                    value={subtitle_en}
                    onChange={setSubtitleEn}
                    dir="ltr"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label>صورة الخدمة</Label>
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
                {loading ? "جاري الحفظ..." : "حفظ الخدمة"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}