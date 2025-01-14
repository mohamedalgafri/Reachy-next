// app/admin/clients/[clientId]/edit/page.tsx
import { ClientForm } from "@/components/forms/ClientForm";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getLocale } from 'next-intl/server';
import { Metadata } from "next";

interface ClientEditPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === 'ar' ? "تعديل العميل" : "Edit Client",
    description: locale === 'ar' 
      ? "تعديل بيانات العميل" 
      : "Edit client information",
  };
}

export default async function ClientEditPage({ params }: ClientEditPageProps) {
  const locale = await getLocale();
  
  // تأكد من أن clientId موجود
  if (!params.id) {
    notFound();
  }

  // حاول العثور على العميل
  const client = await db.client.findUnique({
    where: {
      id: parseInt(params.id)
    }
  });

  // إذا لم يتم العثور على العميل
  if (!client) {
    notFound();
  }

  return (
    <div className="p-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <ClientForm 
        initialData={client} 
        mode="edit" 
      />
    </div>
  );
}