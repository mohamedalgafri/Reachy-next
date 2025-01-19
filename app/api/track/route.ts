// app/api/track/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = (await headersList.get("x-forwarded-for"))?.split(',')[0] || "127.0.0.1";
    const userAgent = await headersList.get("user-agent") || "";
    const referer = await headersList.get("referer") || "";
    
    // استخراج pathname من الـ request body
    const body = await request.json();
    const { pathname } = body;

    // تجاهل بعض المسارات
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api') ||
      pathname.includes('favicon')
    ) {
      return NextResponse.json({ success: false, message: 'Ignored path' });
    }

    // إنشاء سجل الزيارة
    const visit = await db.visit.create({
      data: {
        ip,
        country: 'UN',
        countryName: 'Unknown',
        path: pathname,
        userAgent,
        referrer: referer,
      },
    });

    return NextResponse.json({ 
      success: true, 
      visit 
    });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to track visit' 
    }, { 
      status: 500 
    });
  }
}