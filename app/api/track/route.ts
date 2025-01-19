// app/api/track/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";
    const userAgent = headersList.get("user-agent") || "";
    const referer = headersList.get("referer") || "";
    const { pathname } = await request.json();

    await prisma.visit.create({
      data: {
        ip,
        country: 'UN',
        countryName: 'Unknown',
        path: pathname,
        userAgent,
        referrer: referer,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}