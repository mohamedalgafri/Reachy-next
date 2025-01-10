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

const i18nMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
});

function matchesPath(cleanPath: string, routePattern: string) {
    if (routePattern.endsWith('*')) {
        const baseRoute = routePattern.slice(0, -1);
        return cleanPath.startsWith(baseRoute);
    }
    return cleanPath === routePattern;
}

// أنشئ middleware المصادقة
const authMiddleware = auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    
    // تجاهل مسارات API
    if (nextUrl.pathname.startsWith('/api')) {
        return null;
    }

    // استخراج اللغة والمسار النظيف
    const currentLocale = nextUrl.pathname.split('/')[1] || defaultLocale;
    const cleanPath = '/' + nextUrl.pathname.split('/').slice(2).join('/');

    const isApiAuthRoute = cleanPath.startsWith(apiAuthPrefix);
    const isAuthRoute = authRoutes.some(route => matchesPath(cleanPath, route));
    const isAdminRoute = adminRoutes.some(route => matchesPath(cleanPath, route));

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL(`/${currentLocale}${DEFAULT_LOGIN_REDIRECT}`, nextUrl));
    }

    if (isAdminRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL(`/${currentLocale}/auth/login`, nextUrl));
    }

    return NextResponse.next();
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

    // التحقق مما إذا كان المسار يبدأ بلغة
    const pathnameHasLocale = locales.some(
        locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // إذا لم يكن المسار يبدأ بلغة، قم بإعادة التوجيه إلى المسار مع اللغة الافتراضية
    if (!pathnameHasLocale) {
        return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
    }

    try {
        // تنفيذ middleware المصادقة
        const authResult = await authMiddleware(request);
        if (authResult instanceof Response) {
            return authResult;
        }

        // تطبيق i18n middleware
        return i18nMiddleware(request);
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        // تطابق كل المسارات
        '/((?!api|_next|_vercel|.*\\.).*)',
        // تطابق مسارات اللغة
        '/',
        '/(ar|en)/:path*',
    ]
};