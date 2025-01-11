'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageUploader } from './ImageUploader';
import { toast } from "sonner";
import { createClient, updateClient } from '@/actions/client';
import { Loader2 } from "lucide-react";
import { useLocale } from 'next-intl';

interface ClientFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

export function ClientForm({ initialData, mode }: ClientFormProps) {
  const router = useRouter();
  const locale = useLocale();
  
  // Form state
  const [name, setName] = useState(initialData?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [previewImages, setPreviewImages] = useState<string[]>(
    initialData?.image ? [initialData.image] : []
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const translations = {
    ar: {
      createTitle: "إضافة عميل جديد",
      editTitle: "تعديل العميل",
      clientName: "اسم العميل",
      clientLogo: "شعار العميل",
      save: "حفظ",
      saving: "جاري الحفظ...",
      saveClient: "حفظ العميل",
      cancel: "إلغاء",
      nameRequired: "اسم العميل مطلوب",
      namePlaceholder: "أدخل اسم العميل",
      clientAddedSuccess: "تم إضافة العميل بنجاح",
      clientUpdatedSuccess: "تم تحديث العميل بنجاح",
      unexpectedError: "حدث خطأ غير متوقع"
    },
    en: {
      createTitle: "Add New Client",
      editTitle: "Edit Client",
      clientName: "Client Name",
      clientLogo: "Client Logo",
      save: "Save",
      saving: "Saving...",
      saveClient: "Save Client",
      cancel: "Cancel",
      nameRequired: "Client name is required",
      namePlaceholder: "Enter client name",
      clientAddedSuccess: "Client added successfully",
      clientUpdatedSuccess: "Client updated successfully",
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
    
    if (!name) {
      toast.error(t.nameRequired);
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrl = initialData?.image || '';
      if (imageFiles.length > 0) {
        const formData = new FormData();
        formData.append('file', imageFiles[0]);
        formData.append('path', 'clients');
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await response.json();
        imageUrl = uploadData.secure_url || '';
      }

      const clientData = {
        name,
        image: imageUrl,
      };

      const result = mode === "create" 
        ? await createClient(clientData)
        : await updateClient(initialData.id, clientData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(
        mode === "create" 
          ? t.clientAddedSuccess 
          : t.clientUpdatedSuccess
      );
      
      router.push('/admin/clients');
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

            <div>
              <Label>{t.clientName}</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                dir="ltr"
              />
            </div>

            <div>
              <Label>{t.clientLogo}</Label>
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
                {loading ? t.saving : t.saveClient}
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