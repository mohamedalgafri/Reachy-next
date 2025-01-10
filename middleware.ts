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

export const locales = ['ar', 'en'];
export const defaultLocale = 'ar';

// تحسين دالة مطابقة المسار
function matchesPath(cleanPath: string, routePattern: string) {
    if (routePattern.endsWith('*')) {
        const baseRoute = routePattern.slice(0, -1);
        return cleanPath.startsWith(baseRoute);
    }
    return cleanPath === routePattern;
}

// دمج middleware المصادقة مع i18n
const nextIntlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
});

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // تجاهل المسارات الخاصة
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // التحقق من اللغة وإضافتها إذا لم تكن موجودة
    const pathnameHasLocale = locales.some(
        locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        return NextResponse.redirect(
            new URL(`/${defaultLocale}${pathname}`, request.url)
        );
    }

    // تطبيق i18n middleware أولاً
    const response = await nextIntlMiddleware(request);
    
    if (response && response instanceof Response) {
        return response;
    }

    // استخراج المسار النظيف واللغة
    const currentLocale = pathname.split('/')[1] || defaultLocale;
    const cleanPath = '/' + pathname.split('/').slice(2).join('/');

    // التحقق من المصادقة
    const session = await auth()(request);
    const isLoggedIn = !!session?.auth;

    // التحقق من نوع المسار
    const isApiAuthRoute = cleanPath.startsWith(apiAuthPrefix);
    const isAuthRoute = authRoutes.some(route => matchesPath(cleanPath, route));
    const isAdminRoute = adminRoutes.some(route => matchesPath(cleanPath, route));

    // تطبيق قواعد المصادقة
    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(
            new URL(`/${currentLocale}${DEFAULT_LOGIN_REDIRECT}`, request.url)
        );
    }

    if (isAdminRoute && !isLoggedIn) {
        return NextResponse.redirect(
            new URL(`/${currentLocale}/auth/login`, request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // تطابق كل المسارات ما عدا الخاصة
        '/((?!api|_next|_vercel|.*\\.).*)',
        // تطابق مسارات اللغة
        '/',
        '/(ar|en)/:path*',
    ]
};