// app/admin/services/[serviceId]/edit/page.tsx
import { ServiceForm } from "@/components/forms/ServiceForm";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getLocale } from 'next-intl/server';
import { Metadata } from "next";

interface ServiceEditPageProps {
  params: {
    serviceId: string;
    locale: string;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const translations = {
    ar: {
      title: "تعديل الخدمة",
      description: "تعديل تفاصيل الخدمة"
    },
    en: {
      title: "Edit Service",
      description: "Edit service details"
    }
  };

  const t = translations[locale as keyof typeof translations];

  return {
    title: t.title,
    description: t.description,
  };
}

export default async function ServiceEditPage({ params }: ServiceEditPageProps) {
  const locale = await getLocale();
  
  const service = await db.service.findUnique({
    where: {
      id: Number(params.serviceId)
    }
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="p-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <ServiceForm 
        initialData={service} 
        mode="edit" 
      />
    </div>
  );
}