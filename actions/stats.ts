'use server'

import { db } from '@/lib/db';
import { startOfDay, startOfMonth, subDays, subMonths } from 'date-fns'
import { revalidatePath } from 'next/cache'

export async function getStats() {
  try {
    // Get total visits
    const totalVisits = await db.visit.count();

    // Get today's visits
    const today = startOfDay(new Date());
    const yesterdayStart = startOfDay(subDays(new Date(), 1));
    
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
      })
    ]);

    // Get this month's visits
    const monthStart = startOfMonth(new Date());
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    
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
      })
    ]);

    // Calculate trends
    const dailyTrend = yesterdayVisits ? ((dailyVisits - yesterdayVisits) / yesterdayVisits) * 100 : 0;
    const monthlyTrend = lastMonthVisits ? ((monthlyVisits - lastMonthVisits) / lastMonthVisits) * 100 : 0;

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
    });

    // Calculate percentages
    const countryData = countryVisits.map((item) => ({
      country: item.country,
      countryName: item.countryName,
      visits: item._count.country,
      percentage: item._count.country / totalVisits,
    }));

    revalidatePath('/admin');
    revalidatePath('/ar/admin');
    revalidatePath('/en/admin');

    return { 
      success: true, 
      data: {
        totalVisits,
        dailyVisits,
        monthlyVisits,
        dailyTrend,
        monthlyTrend,
        countryData,
        lastUpdated: new Date().toISOString(),
      }
    };
  } catch (error) {
    console.error('[STATS_GET]', error);
    return { 
      success: false, 
      error: 'حدث خطأ أثناء جلب الإحصائيات'
    };
  }
}