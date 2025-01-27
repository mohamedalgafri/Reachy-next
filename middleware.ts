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
import { getIpInfo } from '@/lib/get-ip-info';

export const locales = ['ar', 'en'];
export const defaultLocale = 'ar';

// المسارات التي لا نريد تسجيل زيارات لها
const ignoreVisitPaths = [
    '/_next',
    '/api/',
    '/admin', 
    '/auth/', 
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '.json',
    '.xml',
    '.txt',
    '.ico',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
];

// تحسين دالة مطابقة المسار
function matchesPath(cleanPath: string, routePattern: string) {
    if (routePattern.endsWith('*')) {
        return cleanPath.startsWith(routePattern.slice(0, -1));
    }
    return cleanPath === routePattern;
}

function shouldTrackVisit(pathname: string) {
    
    if (pathname === '/' || pathname === '/ar' || pathname === '/en' || pathname.startsWith('/ar/') || pathname.startsWith('/en/')) {
        return true;
    }

    if (ignoreVisitPaths.some(path => pathname.includes(path))) {
        return false;
    }

    return true;
}

// إنشاء middleware للترجمة
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

    // تسجيل الزيارة إذا كان المسار مؤهلاً
    if (shouldTrackVisit(pathname)) {
        const acceptHeader = request.headers.get('accept') || '';
        const isHtmlRequest = acceptHeader.includes('text/html');
        const isGetRequest = request.method === 'GET';
        
        if (isHtmlRequest && isGetRequest) {
            try {
                const ipInfo = await getIpInfo();
                const userAgent = request.headers.get('user-agent') || 'Unknown';
                const referrer = request.headers.get('referer') || undefined;

                // استخدام API route لتسجيل الزيارة
                const response = await fetch(new URL('/api/track-visit', request.url).toString(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ip: ipInfo.ip,
                        country: ipInfo.country,
                        countryName: ipInfo.countryName,
                        city: ipInfo.city,
                        userAgent,
                        path: pathname,
                        referrer,
                    }),
                });

                const result = await response.json();
            } catch (error) {
                console.error('[VISIT_TRACKING_ERROR]', error);
            }
        }
    }


    // استخراج اللغة والمسار النظيف
    const pathnameHasLocale = locales.some(
        locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    const currentLocale = pathname.split('/')[1] || defaultLocale;
    const cleanPath = '/' + pathname.split('/').slice(pathnameHasLocale ? 2 : 1).join('/');

    // إعادة توجيه إذا لم تكن اللغة موجودة في المسار
    if (!pathnameHasLocale) {
        const newUrl = new URL(`/${defaultLocale}${pathname}${search}`, request.url);
        return NextResponse.redirect(newUrl);
    }

    // تطبيق middleware الترجمة
    const i18nResponse = await i18nMiddleware(request);
    if (i18nResponse) return i18nResponse;

    // التحقق من حالة المصادقة
    const session = await auth()(request);
    const isLoggedIn = !!session?.user;
    const isAdmin = session?.user?.role === "ADMIN";

    // مسارات API
    if (cleanPath.startsWith(apiAuthPrefix)) {
        return NextResponse.next();
    }

    // المسارات العامة
    if (publicRoutes.some(route => matchesPath(cleanPath, route))) {
        return NextResponse.next();
    }

    // تحويل المستخدم المسجل دخول من صفحة تسجيل الدخول
    if (authRoutes.some(route => matchesPath(cleanPath, route))) {
        if (isLoggedIn) {
            return NextResponse.redirect(
                new URL(`/${currentLocale}${DEFAULT_LOGIN_REDIRECT}`, request.url)
            );
        }
        return NextResponse.next();
    }

    // التحقق من صلاحيات الوصول للوحة التحكم
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
        // تجاهل الملفات الثابتة والمسارات الخاصة
        "/((?!api|_next|admin|auth|assets|favicon.ico).*)",
        // تطبيق على المسار الرئيسي
        "/",
        // تطبيق على مسارات اللغة
        "/(ar|en)/:path*",
        "/admin/:path*",  
        "/admin"  
    ]
};