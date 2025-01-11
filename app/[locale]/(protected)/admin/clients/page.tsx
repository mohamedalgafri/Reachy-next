// app/(protected)/admin/clients/page.tsx
import { columns } from "./columns";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { Link } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === 'ar' ? "إدارة العملاء" : "Clients Management",
    description: locale === 'ar' 
      ? "إدارة قائمة عملاء الشركة" 
      : "Manage company clients list",
  };
}

export default async function ClientsPage() {
  const locale = await getLocale();
  const clients = await db.client.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const translations = {
    ar: {
      title: "إدارة العملاء",
      description: "قم بإدارة قائمة عملاء الشركة",
      addClient: "إضافة عميل"
    },
    en: {
      title: "Clients Management",
      description: "Manage company clients list",
      addClient: "Add Client"
    }
  };

  const t = translations[locale as keyof typeof translations];

  return (
    <div className="p-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.description}</p>
        </div>
        <Button>
          <Link 
            href="/admin/clients/create" 
            className="flex items-center gap-1"
            locale={locale}
          >
            <Plus className="w-4 h-4" />
            {t.addClient}
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={clients} />
    </div>
  );
}