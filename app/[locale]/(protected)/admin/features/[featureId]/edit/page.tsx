// app/(protected)/admin/features/[featureId]/edit/page.tsx
import { FeatureForm } from "@/components/forms/FeatureForm";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getLocale } from 'next-intl/server';
import { Metadata } from "next";

interface FeatureEditPageProps {
  params: {
    featureId: string;
    locale: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === 'ar' ? "تعديل الميزة" : "Edit Feature",
    description: locale === 'ar' 
      ? "تعديل معلومات الميزة" 
      : "Edit feature information",
  };
}

export default async function FeatureEditPage({ params }: FeatureEditPageProps) {
  const locale = await getLocale();
  
  const feature = await db.feature.findUnique({
    where: {
      id: Number(params.featureId)
    }
  });

  if (!feature) {
    notFound();
  }

  return (
    <div className="p-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <FeatureForm 
        initialData={feature} 
        mode="edit" 
      />
    </div>
  );
}