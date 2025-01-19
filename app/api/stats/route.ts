// app/api/stats/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // التحقق من المصادقة
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // الإحصائيات الأساسية
    const [totalVisits, dailyVisits, monthlyVisits, uniqueVisitors] = await Promise.all([
      db.visit.count(),
      db.visit.count({
        where: { createdAt: { gte: startOfDay } }
      }),
      db.visit.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
      db.visit.groupBy({
        by: ['ip'],
        where: { createdAt: { gte: startOfDay } },
        _count: true
      })
    ]);

    return NextResponse.json({
      totalVisits,
      dailyVisits,
      monthlyVisits,
      uniqueVisitorsToday: uniqueVisitors.length,
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