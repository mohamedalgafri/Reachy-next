// app/(protected)/admin/services/page.tsx
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
    title: locale === 'ar' ? "إدارة الخدمات" : "Services Management",
    description: locale === 'ar' 
      ? "إدارة الخدمات التي تقدمها الشركة" 
      : "Manage company services",
  };
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const services = await db.service.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const translations = {
    ar: {
      title: "إدارة الخدمات",
      description: "قم بإدارة الخدمات التي تقدمها الشركة",
      addService: "إضافة خدمة"
    },
    en: {
      title: "Services Management",
      description: "Manage company services",
      addService: "Add Service"
    }
  };

  const t = translations[locale as keyof typeof translations];

  return (
    <div className="p-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t.description}
          </p>
        </div>
        <Button>
          <Link 
            className="flex gap-1" 
            href="/admin/services/create"
            locale={locale}
          >
            <Plus className="w-4 h-4" />
            {t.addService}
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={services} />
    </div>
  );
}