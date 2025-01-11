// app/admin/services/create/page.tsx
import { ServiceForm } from "@/components/forms/ServiceForm";
import { getLocale } from 'next-intl/server';
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === 'ar' ? "إضافة خدمة جديدة" : "Add New Service",
    description: locale === 'ar' 
      ? "إضافة خدمة جديدة للموقع" 
      : "Add a new service to the website",
  };
}

export default async function CreateServicePage() {
  const locale = await getLocale();

  return (
    <div className="p-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <ServiceForm mode="create" />
    </div>
  );
}