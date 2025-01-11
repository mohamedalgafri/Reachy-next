// app/(protected)/admin/sections/page.tsx
import { db } from "@/lib/db";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getLocale, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

interface PageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === 'ar' ? "إدارة الأقسام" : "Sections Management",
    description: locale === 'ar' ? "إدارة أقسام الموقع" : "Manage website sections",
  };
}

export default async function SectionsPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);

  const sections = await db.section.findMany({
    include: {
      page: true,
      inputs: {
        orderBy: {
          order: 'asc'
        }
      }
    },
    orderBy: {
      order: 'asc'
    }
  });

  const translations = {
    ar: {
      title: "إدارة الأقسام",
      description: "قم بإدارة أقسام الموقع"
    },
    en: {
      title: "Sections Management",
      description: "Manage website sections"
    }
  };

  const t = translations[locale as keyof typeof translations];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground mt-1">{t.description}</p>
        </div>
      </div>

      <DataTable columns={columns} data={sections} />
    </div>
  );
}