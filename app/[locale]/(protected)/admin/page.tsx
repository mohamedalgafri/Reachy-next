'use client';

import { useState, useEffect } from "react";
import { use } from 'react';
import { Users, Eye, Globe } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card } from "@/components/ui/card";
import { InfoCard } from "@/components/dashboard/info-card";
import { VisitorsTable } from "@/components/dashboard/visitors-table";
import { getStats } from '@/actions/stats';

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default function AdminPage({ params }: AdminPageProps) {
  const { locale } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const result = await getStats();
        
        if (!result.success) {
          throw new Error(result.error);
        }

        setStats(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <DashboardHeader 
          heading={locale === "ar" ? "لوحة التحكم" : "Dashboard"} 
          text={locale === "ar" ? "جاري التحميل..." : "Loading..."} 
        />
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col gap-5">
        <DashboardHeader 
          heading={locale === "ar" ? "لوحة التحكم" : "Dashboard"} 
          text={locale === "ar" ? "حدث خطأ" : "An error occurred"} 
        />
        <Card className="p-6">
          <p className="text-center text-destructive">
            {error || (locale === "ar" ? "فشل في تحميل البيانات" : "Failed to load data")}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <DashboardHeader 
        heading={locale === "ar" ? "لوحة التحكم" : "Dashboard"} 
        text={locale === "ar" ? "إحصائيات الزوار" : "Visitor Statistics"} 
      />
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InfoCard
          title={locale === "ar" ? "إجمالي الزيارات" : "Total Visits"}
          value={stats.totalVisits.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
          icon={Users}
          description={locale === "ar" ? "منذ إطلاق الموقع" : "Since launch"}
        />
        <InfoCard
          title={locale === "ar" ? "زيارات اليوم" : "Today's Visits"}
          value={stats.dailyVisits.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
          icon={Eye}
          description={locale === "ar" ? "اليوم" : "Today"}
        />
        <InfoCard
          title={locale === "ar" ? "الزيارات الشهرية" : "Monthly Visits"}
          value={stats.monthlyVisits.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
          icon={Globe}
          description={locale === "ar" ? "هذا الشهر" : "This month"}
        />
      </div>

      <VisitorsTable data={stats.countryData} locale={locale} />

      <div className="text-sm text-muted-foreground text-center">
        {locale === "ar" 
          ? `آخر تحديث: ${new Date(stats.lastUpdated).toLocaleString()}` 
          : `Last updated: ${new Date(stats.lastUpdated).toLocaleString()}`}
      </div>
    </div>
  );
}