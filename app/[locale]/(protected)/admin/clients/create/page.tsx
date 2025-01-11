// app/admin/clients/create/page.tsx
import { ClientForm } from "@/components/forms/ClientForm";
import { getLocale } from 'next-intl/server';
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === 'ar' ? "إضافة عميل جديد" : "Add New Client",
    description: locale === 'ar' 
      ? "إضافة عميل جديد للشركة" 
      : "Add a new client to the company",
  };
}

export default async function CreateClientPage() {
  const locale = await getLocale();

  return (
    <div className="p-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <ClientForm mode="create" />
    </div>
  );
}