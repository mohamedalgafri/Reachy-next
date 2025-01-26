'use server'

import { db } from '@/lib/db'
import { 
  startOfDay, 
  startOfMonth, 
  subMonths, 
  format,
  endOfMonth, 
  subDays,
  subHours
} from 'date-fns';
import { revalidatePath } from 'next/cache'

interface StatsResponse {
  success: boolean;
  data?: {
    totalVisits: number;
    dailyVisits: number;
    monthlyVisits: number;
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
    const today = startOfDay(new Date());
    const monthStart = startOfMonth(new Date());
    const yearStart = startOfMonth(subMonths(new Date(), 11));

    // جلب الإحصائيات الأساسية
    const [totalVisits, dailyVisits, monthlyVisits, countryVisits] = await Promise.all([
      db.visit.count(),
      db.visit.count({
        where: { createdAt: { gte: today } }
      }),
      db.visit.count({
        where: { createdAt: { gte: monthStart } }
      }),
      db.visit.groupBy({
        by: ['country', 'countryName'],
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
        take: 10
      })
    ]);


    

    // معالجة بيانات الدول
    const countryData = countryVisits.map(item => ({
      country: item.country,
      countryName: item.countryName,
      visits: item._count.country,
      percentage: item._count.country / totalVisits
    }));

    // إنشاء مصفوفة للأشهر الـ 12 الماضية
    const last12Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return startOfMonth(date);
      
    });

    // جلب الزيارات الشهرية كاملة
    const visitsPerMonth = await Promise.all(
      last12Months.map(async (month) => {
        const count = await db.visit.count({
          where: {
            createdAt: {
              gte: startOfMonth(month),
              lt: endOfMonth(month)
            }
          }
        });
    
        return {
          date: format(month, 'yyyy-MM'),
          visits: count
        };
      })
    );


    return {
      success: true,
      data: {
        totalVisits,
        dailyVisits,
        monthlyVisits,
        countryData,
        monthlyStats: visitsPerMonth,
        lastUpdated: new Date().toISOString()
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
          gte: subHours(new Date(), 12),
        },
      },
    })

    console.log('[CREATE_VISIT] Checking existing visit:', existingVisit);

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