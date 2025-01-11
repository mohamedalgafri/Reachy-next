// app/(protected)/admin/features/page.tsx
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
    title: locale === 'ar' ? "إدارة المميزات" : "Features Management",
    description: locale === 'ar' 
      ? "إدارة المميزات التي تعرض في الموقع" 
      : "Manage features displayed on the site",
  };
}

export default async function FeaturesPage() {
  const locale = await getLocale();
  const features = await db.feature.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedFeatures = features.map(feature => ({
    ...feature,
    createdAt: feature.createdAt.toISOString(),
    updatedAt: feature.updatedAt.toISOString(),
  }));

  const translations = {
    ar: {
      title: "إدارة المميزات",
      description: "إدارة المميزات التي تعرض في الموقع",
      addFeature: "إضافة ميزة"
    },
    en: {
      title: "Features Management",
      description: "Manage features displayed on the site",
      addFeature: "Add Feature"
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
            href="/admin/features/create" 
            className="flex gap-1"
            locale={locale}
          >
            <Plus className="w-4 h-4" />
            {t.addFeature}
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={formattedFeatures} />
    </div>
  );
}