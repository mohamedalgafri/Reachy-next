import createMiddleware from 'next-intl/middleware';
import { auth } from "@/auth";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    publicRoutes,
    authRoutes,
    adminRoutes
} from "@/routes";
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { db } from './lib/db';

export const locales = ['ar', 'en'];
export const defaultLocale = 'ar';

// دالة تتبع الزيارات
async function trackVisit(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for")?.split(',')[0] || request.ip || "127.0.0.1";
        const userAgent = request.headers.get("user-agent") || "";
        const referer = request.headers.get("referer") || "";
        const url = new URL(request.url);

        // تخزين الزيارة في قاعدة البيانات
        await db.visit.create({
            data: {
                ip,
                country: 'UN', // سيتم تحديثه لاحقاً مع خدمة تحديد الموقع
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

function matchesPath(cleanPath: string, routePattern: string) {
    if (routePattern.endsWith('*')) {
        return cleanPath.startsWith(routePattern.slice(0, -1));
    }
    return cleanPath === routePattern;
}

const i18nMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
});

export default async function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // تجاهل المسارات الخاصة
    if (pathname.startsWith('/_next') || 
        pathname.startsWith('/api/') || 
        pathname.includes('.')) {
        return NextResponse.next();
    }

    // تتبع الزيارة إذا كانت صفحة عامة
    if (!pathname.startsWith('/admin') && !pathname.includes('/auth/')) {
        await trackVisit(request);
    }

    const pathnameHasLocale = locales.some(
        locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    const currentLocale = pathname.split('/')[1] || defaultLocale;
    const cleanPath = '/' + pathname.split('/').slice(pathnameHasLocale ? 2 : 1).join('/');

    if (!pathnameHasLocale) {
        const newUrl = new URL(`/${defaultLocale}${pathname}${search}`, request.url);
        return NextResponse.redirect(newUrl);
    }

    const i18nResponse = await i18nMiddleware(request);
    if (i18nResponse) return i18nResponse;

    const session = await auth()(request);
    const isLoggedIn = !!session?.user;
    const isAdmin = session?.user?.role === "ADMIN";

    if (cleanPath.startsWith(apiAuthPrefix)) {
        return NextResponse.next();
    }

    if (publicRoutes.some(route => matchesPath(cleanPath, route))) {
        return NextResponse.next();
    }

    if (authRoutes.some(route => matchesPath(cleanPath, route))) {
        if (isLoggedIn) {
            return NextResponse.redirect(
                new URL(`/${currentLocale}${DEFAULT_LOGIN_REDIRECT}`, request.url)
            );
        }
        return NextResponse.next();
    }

    if (adminRoutes.some(route => matchesPath(cleanPath, route))) {
        if (!isLoggedIn) {
            const callbackUrl = encodeURIComponent(request.url);
            return NextResponse.redirect(
                new URL(`/${currentLocale}/auth/login?callbackUrl=${callbackUrl}`, request.url)
            );
        }
        if (!isAdmin) {
            return NextResponse.redirect(
                new URL(`/${currentLocale}`, request.url)
            );
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!.+\\.[\\w]+$|_next).*)",
        "/",
        "/(ar|en)/:path*"
    ]
};