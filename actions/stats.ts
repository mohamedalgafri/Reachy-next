'use server'


import { db } from '@/lib/db'
import { startOfDay, startOfMonth, subDays, subMinutes, subMonths } from 'date-fns'
import { revalidatePath } from 'next/cache'

interface StatsResponse {
  success: boolean;
  data?: {
    totalVisits: number;
    dailyVisits: number;
    monthlyVisits: number;
    dailyTrend: number;
    monthlyTrend: number;
    countryData: Array<{
      country: string;
      countryName: string;
      visits: number;
      percentage: number;
    }>;
    monthlyStats: Array<{
      date: string;
      visits: number;
    }>;
    lastUpdated: string;
  };
  error?: string;
}

export async function getStats(): Promise<StatsResponse> {
  try {
    // Get total visits
    const totalVisits = await db.visit.count()

    // Get today's visits
    const today = startOfDay(new Date())
    const yesterdayStart = startOfDay(subDays(new Date(), 1))

    const [dailyVisits, yesterdayVisits] = await Promise.all([
      db.visit.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),
      db.visit.count({
        where: {
          createdAt: {
            gte: yesterdayStart,
            lt: today,
          },
        },
      }),
    ])

    // Get this month's visits
    const monthStart = startOfMonth(new Date())
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1))

    const [monthlyVisits, lastMonthVisits] = await Promise.all([
      db.visit.count({
        where: {
          createdAt: {
            gte: monthStart,
          },
        },
      }),
      db.visit.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lt: monthStart,
          },
        },
      }),
    ])

    // Calculate trends
    const dailyTrend = yesterdayVisits ? (dailyVisits - yesterdayVisits) / yesterdayVisits * 100 : 0
    const monthlyTrend = lastMonthVisits ? (monthlyVisits - lastMonthVisits) / lastMonthVisits * 100 : 0

    // Get visits by country
    const countryVisits = await db.visit.groupBy({
      by: ['country', 'countryName'],
      _count: {
        country: true,
      },
      orderBy: {
        _count: {
          country: 'desc',
        },
      },
      take: 10,
    })

    // Calculate percentages
    const countryData = countryVisits.map((item) => ({
      country: item.country,
      countryName: item.countryName,
      visits: item._count.country,
      percentage: item._count.country / totalVisits,
    }))

    const monthlyStats = await db.visit.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      },
    });

    // Transform the data into the format expected by the chart
    const transformedMonthlyStats = monthlyStats.map(stat => ({
      date: stat.createdAt.toISOString(),
      visits: stat._count.id
    }));

    const data = {
      totalVisits,
      dailyVisits,
      monthlyVisits,
      dailyTrend,
      monthlyTrend,
      countryData,
      monthlyStats: transformedMonthlyStats,
      lastUpdated: new Date().toISOString(),
    }

    revalidatePath('/admin')
    return { success: true, data }
  } catch (error) {
    console.error('[STATS_GET]', error)
    return {
      success: false,
      error: 'حدث خطأ أثناء جلب الإحصائيات'
    }
  }
}

// إضافة زيارة جديدة
export async function createVisit(data: {
  ip: string
  country: string
  countryName: string
  city?: string
  userAgent: string
  path: string
  referrer?: string
}) {
  try {
    // تحقق من وجود زيارة سابقة في آخر 24 ساعة
    const existingVisit = await db.visit.findFirst({
      where: {
        ip: data.ip,
        path: data.path,
        createdAt: {
          // gte: subDays(new Date(), 1),
          gte: subMinutes(new Date(), 1),
        },
      },
    })

    console.log('[CREATE_VISIT] Checking existing visit:', existingVisit);

    // إذا لم تكن هناك زيارة سابقة، قم بإنشاء زيارة جديدة
    if (!existingVisit) {
      const visit = await db.visit.create({
        data
      })
      console.log('[CREATE_VISIT] New visit created:', visit);
      revalidatePath('/admin')
      revalidatePath('/admin')
      revalidatePath('/[locale]/admin')
      revalidatePath('/ar/admin')
      revalidatePath('/en/admin')
      return { success: true, data: visit }
    } else {
      console.log('[CREATE_VISIT] Duplicate visit detected within 24 hours');
      return { success: true, data: existingVisit }
    }
  } catch (error) {
    console.error('[CREATE_VISIT] Error:', error)
    return {
      success: false,
      error: 'حدث خطأ أثناء تسجيل الزيارة'
    }
  }
}