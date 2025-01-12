// app/[locale]/admin/settings/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { db } from "@/lib/db";
import { getLocale, getTranslations } from 'next-intl/server';
import { UserForms } from "@/components/forms/user-name-form";
import { SiteSettingsForm } from "@/components/forms/SiteSettingsForm";
import { SocialLinksForm } from "@/components/forms/SocialLinksForm";

interface PageProps {
  params: { 
    locale: string 
  }
}


export default async function SettingsPage({ params: { locale } }: PageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  // التحقق من صلاحيات المستخدم
  if (session.user.role !== "ADMIN") {
    redirect(`/${locale}`);
  }

  const settings = await db.settings.findFirst();

  return (
    <div className="container" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <DashboardHeader
        heading={locale === 'ar' ? 'الاعدادات' : 'Settings'}
        text={locale === 'ar' ? 'إدارة إعدادات الموقع' : 'Manage site settings'}
      />
      
      <div className="divide-y divide-border">
        {/* معلومات المستخدم */}
        <div className="py-6">
          <UserForms 
            user={{
              id: session.user.id,
              name: session.user.name || "",
              email: session.user.email || ""
            }}
          />
        </div>

        {/* إعدادات الموقع */}
        <div className="py-6">
          <SiteSettingsForm settings={settings} />
        </div>

        {/* روابط التواصل الاجتماعي */}
        <div className="py-6">
          <SocialLinksForm settings={settings} />
        </div>
      </div>
    </div>
  );
}