// app/(admin)/[locale]/admin/page.tsx
import { getTranslations } from "next-intl/server";
import { Building2, Users2, MessagesSquare, Settings } from "lucide-react";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import { getDashboardStats } from "@/lib/analytics";

export async function generateMetadata({ params: { locale } }) {
  return constructMetadata({
    title: locale === "ar" ? "لوحة التحكم" : "Dashboard",
    description: locale === "ar" ? "لوحة التحكم الخاصة بالموقع" : "Website dashboard",
  });
}

export default async function AdminPage({ params: { locale } }) {
  const stats = await getDashboardStats();

  return (
    <>
      <DashboardHeader 
        heading={locale === "ar" ? "لوحة التحكم" : "Dashboard"} 
        text={locale === "ar" ? "لوحة التحكم الخاصة بالموقع" : "Website dashboard"} 
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* <InfoCard
            title={t('stats.sections')}
            value={stats.sectionsCount}
            icon={Building2}
            description={t('stats.sectionsDescription')}
          /> */}
        </div>
      </div>
    </>
  );
}