// app/(protected)/admin/settings/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { db } from "@/lib/db";
import { UserNameForm } from "@/components/forms/user-name-form";
import { SiteSettingsForm } from "@/components/forms/SiteSettingsForm";
import { SocialLinksForm } from "@/components/forms/SocialLinksForm";
import { getLocale } from 'next-intl/server';

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata() {
  const locale = await getLocale();
  
  return constructMetadata({
    title: locale === 'ar' ? "الإعدادات" : "Settings",
    description: locale === 'ar' ? "إعدادات الموقع" : "Site Settings",
  });
}

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const locale = await getLocale();
  if (!user?.id) redirect("/login");

  const settings = await db.settings.findFirst();

  const translations = {
    ar: {
      settings: "الإعدادات",
      description: "إدارة إعدادات الموقع"
    },
    en: {
      settings: "Settings",
      description: "Manage site settings"
    }
  };

  const t = translations[locale as keyof typeof translations];

  return (
    <div className="container" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <DashboardHeader
        heading={t.settings}
        text={t.description}
      />
      <div className="divide-y divide-muted pb-10">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        <SiteSettingsForm settings={settings} />
        <SocialLinksForm settings={settings} />
      </div>
    </div>
  );
}