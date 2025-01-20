'use server'

import { db } from '@/lib/db';
import { startOfDay, startOfMonth } from 'date-fns'
import { revalidatePath } from 'next/cache'

export async function getStats() {
  try {
    // Get total visits
    const totalVisits = await db.visit.count();

    // Get today's visits
    const today = startOfDay(new Date());
    const dailyVisits = await db.visit.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // Get this month's visits
    const monthStart = startOfMonth(new Date());
    const monthlyVisits = await db.visit.count({
      where: {
        createdAt: {
          gte: monthStart,
        },
      },
    });

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

    revalidatePath('/admin')
    revalidatePath('/ar/admin')
    revalidatePath('/en/admin')

    return {
      success: true,
      data: {
        totalVisits,
        dailyVisits,
        monthlyVisits,
        countryData,
        lastUpdated: new Date().toISOString(),
      }
    }
  } catch (error) {
    console.error('[STATS_GET]', error)
    return {
      success: false,
      error: 'حدث خطأ أثناء جلب الإحصائيات'
    }
  }
}