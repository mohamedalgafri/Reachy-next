'use server'

import { db } from '@/lib/db'
import { eachDayOfInterval, endOfDay, startOfDay, startOfMonth, subMonths } from 'date-fns'
import { revalidatePath } from 'next/cache'

export async function getStats() {
  try {
    // Get total visits
    const totalVisits = await db.visit.count()

    // Get today's visits
    const today = startOfDay(new Date())
    const dailyVisits = await db.visit.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    })

    // Get this month's visits
    const monthStart = startOfMonth(new Date())
    const monthlyVisits = await db.visit.count({
      where: {
        createdAt: {
          gte: monthStart,
        },
      },
    })

    const sixMonthsAgo = subMonths(startOfDay(new Date()), 5);
    const days = eachDayOfInterval({
      start: sixMonthsAgo,
      end: new Date()
    });

    const monthlyStats = await Promise.all(
      days.map(async (day) => {
        const visits = await db.visit.count({
          where: {
            createdAt: {
              gte: startOfDay(day),
              lt: endOfDay(day)
            }
          }
        });

        return {
          date: day.toISOString(),
          visits
        };
      })
    );

    // Get visits by country
    const visits = await db.visit.groupBy({
      by: ['country', 'countryName', 'createdAt'],
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
    const countryData = visits.map((item) => ({
      country: item.country,
      countryName: item.countryName,
      visits: item._count.country,
      percentage: item._count.country / totalVisits,
      createdAt: item.createdAt.toISOString()
    }))

    revalidatePath('/admin');
    revalidatePath('/ar/admin');
    revalidatePath('/en/admin');

    return {
      success: true,
      data: {
        totalVisits,
        dailyVisits,
        monthlyVisits,
        monthlyStats,
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