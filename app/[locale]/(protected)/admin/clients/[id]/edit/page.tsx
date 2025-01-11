// app/admin/clients/[clientId]/edit/page.tsx
import { ClientForm } from "@/components/forms/ClientForm";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getLocale } from 'next-intl/server';
import { Metadata } from "next";

interface ClientEditPageProps {
  params: {
    clientId: string;
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
  
  const client = await db.client.findUnique({
    where: {
      id: Number(params.clientId)
    }
  });

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