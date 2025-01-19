// app/(admin)/[locale]/admin/page.tsx
import { getTranslations } from "next-intl/server";
import { Users, Eye, Globe, BarChart } from "lucide-react";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import { VisitorsTable } from "@/components/dashboard/visitors-table";
import { getDashboardStats } from "@/lib/analytics";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";

export async function generateMetadata({ params: { locale } }) {
  return constructMetadata({
    title: locale === "ar" ? "لوحة التحكم" : "Dashboard",
    description: locale === "ar" ? "لوحة التحكم الخاصة بالموقع" : "Website dashboard",
  });
}

export default async function AdminPage({ params: { locale } }) {
  const stats = await getDashboardStats();
  const t = await getTranslations('dashboard');

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DashboardHeader 
        heading={locale === "ar" ? "لوحة التحكم" : "Dashboard"} 
        text={locale === "ar" ? "إحصائيات الزوار" : "Visitor Statistics"} 
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            title={locale === "ar" ? "إجمالي الزيارات" : "Total Visits"}
            value={stats.totalVisits.toLocaleString()}
            icon={Users}
            description={locale === "ar" ? "منذ إطلاق الموقع" : "Since launch"}
          />
          <InfoCard
            title={locale === "ar" ? "الزوار اليوم" : "Today's Visitors"}
            value={stats.uniqueVisitorsToday.toLocaleString()}
            icon={Eye}
            description={locale === "ar" ? "زوار فريدين" : "Unique visitors"}
          />
          <InfoCard
            title={locale === "ar" ? "زيارات اليوم" : "Today's Visits"}
            value={stats.dailyVisits.toLocaleString()}
            icon={BarChart}
            description={locale === "ar" ? "اليوم" : "Today"}
          />
          <InfoCard
            title={locale === "ar" ? "الزيارات الشهرية" : "Monthly Visits"}
            value={stats.monthlyVisits.toLocaleString()}
            icon={Globe}
            description={locale === "ar" ? "هذا الشهر" : "This month"}
          />
        </div>

        <Suspense fallback={<Card className="p-4">Loading...</Card>}>
          <VisitorsTable data={stats.countryData} locale={locale} />
        </Suspense>

        <div className="text-sm text-muted-foreground text-center">
          {locale === "ar" 
            ? `آخر تحديث: ${new Date(stats.lastUpdated).toLocaleString('ar-SA')}` 
            : `Last updated: ${new Date(stats.lastUpdated).toLocaleString()}`}
        </div>
      </div>
    </>
  );
}