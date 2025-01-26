import { NextRequest, NextResponse } from 'next/server';
import { subHours } from 'date-fns';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        // console.log('[TRACK_VISIT] Received data:', data);

        // تحقق من الزيارة السابقة
        const existingVisit = await db.visit.findFirst({
            where: {
                ip: data.ip,
                createdAt: {
                    gte: subHours(new Date(), 1)
                }
            }
        });


        if (existingVisit) {
            return NextResponse.json({ 
                success: true, 
                data: existingVisit 
            });
        }

        // إنشاء زيارة جديدة
        const visit = await db.visit.create({
            data: {
                ip: data.ip || 'Unknown',
                country: data.country || 'Unknown',
                countryName: data.countryName || 'Unknown',
                city: data.city || 'Unknown',
                userAgent: data.userAgent || 'Unknown',
                entryPage: data.path || '/',
            }
        });


        return NextResponse.json({ 
            success: true, 
            data: visit 
        });
    } catch (error) {
        
        return NextResponse.json({ 
            success: false, 
            error: 'حدث خطأ أثناء تسجيل الزيارة' 
        }, { 
            status: 500 
        });
    }
}