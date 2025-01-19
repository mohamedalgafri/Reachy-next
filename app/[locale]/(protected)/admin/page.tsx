'use client';

import { Users, Eye, Globe, BarChart } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import { VisitorsTable } from "@/components/dashboard/visitors-table";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Stats {
  totalVisits: number;
  dailyVisits: number;
  monthlyVisits: number;
  uniqueVisitorsToday: number;
  countryData: any[];
  lastUpdated: string;
}

export default function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} className="p-6">
              <div className="animate-pulse h-20"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col gap-5">
        <DashboardHeader 
          heading={locale === "ar" ? "لوحة التحكم" : "Dashboard"} 
          text={locale === "ar" ? "حدث خطأ" : "Error occurred"} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <DashboardHeader 
        heading={locale === "ar" ? "لوحة التحكم" : "Dashboard"} 
        text={locale === "ar" ? "إحصائيات الزوار" : "Visitor Statistics"} 
      />
      
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

      <VisitorsTable data={stats.countryData} locale={locale} />

      <div className="text-sm text-muted-foreground text-center">
        {locale === "ar" 
          ? `آخر تحديث: ${new Date(stats.lastUpdated).toLocaleString('ar-SA')}` 
          : `Last updated: ${new Date(stats.lastUpdated).toLocaleString()}`}
      </div>
    </div>
  );
}