import { NextRequest, NextResponse } from 'next/server';
import { subDays, subMinutes } from 'date-fns';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        
        const existingVisit = await db.visit.findFirst({
            where: {
                ip: data.ip,
                path: data.path,
                createdAt: {
                    gte: subDays(new Date(), 1),
                },
            },
        });

        if (existingVisit) {
            return NextResponse.json({ success: true, data: existingVisit });
        }

        const visit = await db.visit.create({
            data
        });

        return NextResponse.json({ success: true, data: visit });
    } catch (error) {
        console.error('[TRACK_VISIT_API_ERROR]', error);
        return NextResponse.json(
            { success: false, error: 'حدث خطأ أثناء تسجيل الزيارة' },
            { status: 500 }
        );
    }
}