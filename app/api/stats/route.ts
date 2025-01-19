// app/api/stats/route.ts
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // التحقق من المصادقة
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // الإحصائيات الأساسية
    const [totalVisits, dailyVisits, monthlyVisits] = await Promise.all([
      db.visit.count(),
      db.visit.count({
        where: { createdAt: { gte: startOfDay } }
      }),
      db.visit.count({
        where: { createdAt: { gte: startOfMonth } }
      })
    ]);

    // إحصائيات حسب الدول
    const countriesVisits = await db.visit.groupBy({
      by: ['country', 'countryName'],
      _count: {
        country: true
      }
    });

    // عدد الزوار الفريدين اليوم
    const uniqueVisitors = await db.visit.groupBy({
      by: ['ip'],
      where: {
        createdAt: {
          gte: startOfDay
        }
      }
    });

    const countryData = countriesVisits.map(stat => ({
      countryCode: stat.country,
      country: stat.countryName,
      visits: stat._count.country,
      percentage: `${((stat._count.country / totalVisits) * 100).toFixed(1)}%`
    }));

    return NextResponse.json({
      totalVisits,
      dailyVisits,
      monthlyVisits,
      uniqueVisitorsToday: uniqueVisitors.length,
      countryData,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}