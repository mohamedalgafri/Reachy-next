import { NextRequest, NextResponse } from 'next/server';
import { subHours } from 'date-fns';
import { db } from '@/lib/db';

const VISIT_CHECK_HOURS = 12;

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const existingVisit = await db.visit.findFirst({
            where: {
                ip: data.ip,
                createdAt: {
                    gte: subHours(new Date(), VISIT_CHECK_HOURS)
                }
            }
        });

        if (existingVisit) {
            return NextResponse.json({ success: true, data: existingVisit });
        }

        const visit = await db.visit.create({
            data: {
                ip: data.ip || 'Unknown',
                country: data.country || 'Unknown',
                countryName: data.countryName || 'Unknown',
                city: data.city || 'Unknown',
            }
        });

        return NextResponse.json({ success: true, data: visit });
    } catch (error) {
        console.error('[TRACK_VISIT_ERROR]', error);
        return NextResponse.json({ 
            success: false, 
            error: 'حدث خطأ أثناء تسجيل الزيارة' 
        }, { status: 500 });
    }
}