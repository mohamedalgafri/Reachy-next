// lib/analytics.ts
import { cache } from 'react';
import { db } from './db';

export const getDashboardStats = cache(async () => {
  try {
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
      by: ['country'],
      _count: {
        country: true
      },
      having: {
        country: {
          _count: {
            gt: 0
          }
        }
      }
    });

    // تنسيق بيانات الدول
    const countryData = countriesVisits.map(stat => ({
      countryCode: stat.country,
      visits: stat._count.country,
      percentage: `${((stat._count.country / totalVisits) * 100).toFixed(1)}%`
    }));

    // عدد الزوار الفريدين اليوم (حسب IP)
    const uniqueVisitors = await db.visit.groupBy({
      by: ['ip'],
      where: {
        createdAt: {
          gte: startOfDay
        }
      }
    });

    return {
      totalVisits,
      dailyVisits,
      monthlyVisits,
      uniqueVisitorsToday: uniqueVisitors.length,
      countryData,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
});