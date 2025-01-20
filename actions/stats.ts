'use server'


import { db } from '@/lib/db'
import { startOfDay, startOfMonth, subDays, subMonths } from 'date-fns'
import { revalidatePath } from 'next/cache'

interface StatsResponse {
  success: boolean
  data?: {
    totalVisits: number
    dailyVisits: number
    monthlyVisits: number
    dailyTrend: number
    monthlyTrend: number
    countryData: Array<{
      country: string
      countryName: string
      visits: number
      percentage: number
    }>
    lastUpdated: string
  }
  error?: string
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

    const data = {
      totalVisits,
      dailyVisits,
      monthlyVisits,
      dailyTrend,
      monthlyTrend,
      countryData,
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
    const existingVisit = await db.visit.findFirst({
      where: {
        ip: data.ip,
        path: data.path,
        createdAt: {
          gte: subDays(new Date(), 1), // تجاهل الزيارات المكررة خلال 24 ساعة
        },
      },
    })

    if (existingVisit) {
      return { success: true, data: existingVisit }
    }

    const visit = await db.visit.create({
      data
    })

    revalidatePath('/admin')
    return { success: true, data: visit }
  } catch (error) {
    console.error('[VISIT_CREATE]', error)
    return { 
      success: false, 
      error: 'حدث خطأ أثناء تسجيل الزيارة'
    }
  }
}