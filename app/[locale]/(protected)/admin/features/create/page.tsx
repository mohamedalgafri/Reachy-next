// app/(protected)/admin/features/create/page.tsx
import { FeatureForm } from "@/components/forms/FeatureForm";
import { getLocale } from 'next-intl/server';
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === 'ar' ? "إضافة ميزة جديدة" : "Add New Feature",
    description: locale === 'ar' 
      ? "إضافة ميزة جديدة للموقع" 
      : "Add a new feature to the site",
  };
}

export default async function CreateFeaturePage() {
  const locale = await getLocale();

  return (
    <div className="p-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <FeatureForm mode="create" />
    </div>
  );
}