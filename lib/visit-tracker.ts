// lib/visit-tracker.ts
import { NextRequest } from "next/server";
import { db } from "./db";

export async function trackVisit(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    const url = new URL(request.url);

    // تجاهل المسارات غير المهمة
    if (
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/api') ||
      url.pathname.includes('favicon') ||
      url.pathname.includes('.') ||
      url.pathname.startsWith('/admin')
    ) {
      return;
    }

    await db.visit.create({
      data: {
        ip,
        country: 'UN',
        countryName: 'Unknown',
        path: url.pathname,
        userAgent,
        referrer: referer,
      },
    });
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
}