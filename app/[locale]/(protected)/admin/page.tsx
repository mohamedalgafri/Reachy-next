// app/(admin)/[locale]/admin/page.tsx
'use client';

import { useEffect, useState } from "react";
import { Users, Eye, Globe } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import { VisitorsTable } from "@/components/dashboard/visitors-table";
import { Card } from "@/components/ui/card";

interface DashboardStats {
  totalVisits: number;
  dailyVisits: number;
  monthlyVisits: number;
  uniqueVisitorsToday: number;
  countryData: any[];
  lastUpdated: string;
}

export default function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
          value={stats.totalVisits.toLocaleString()}
          icon={Users}
          description={locale === "ar" ? "منذ إطلاق الموقع" : "Since launch"}
        />
        <InfoCard
          title={locale === "ar" ? "زيارات اليوم" : "Today's Visits"}
          value={stats.dailyVisits.toLocaleString()}
          icon={Eye}
          description={locale === "ar" ? "اليوم" : "Today"}
        />
        <InfoCard
          title={locale === "ar" ? "الزيارات الشهرية" : "Monthly Visits"}
          value={stats.monthlyVisits.toLocaleString()}
          icon={Globe}
          description={locale === "ar" ? "هذا الشهر" : "This month"}
        />
      </div>

      <VisitorsTable data={stats.countryData} locale={locale} />

      <div className="text-sm text-muted-foreground text-center">
        {locale === "ar" 
          ? `آخر تحديث: ${new Date(stats.lastUpdated).toLocaleString('ar-SA')}` 
          : `Last updated: ${new Date(stats.lastUpdated).toLocaleString()}`}
      </div>
    </div>
  );
}