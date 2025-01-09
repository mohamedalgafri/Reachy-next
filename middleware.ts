import createMiddleware from 'next-intl/middleware';
import { auth } from "@/auth";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    publicRoutes,
} from "@/routes";
import { NextResponse } from 'next/server';

const locales = ['ar', 'en'];
const defaultLocale = 'ar';

// إنشاء middleware للترجمة
const i18nMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
});

export default auth(async function middleware(req) {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    
    // التحقق من المسارات
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isLoginPage = nextUrl.pathname.includes("/auth/login");
    const isAdminRoute = nextUrl.pathname.includes("/admin") || nextUrl.pathname.includes("/dashboard");

    if (isApiAuthRoute) {
        return null;
    }

    if (isLoginPage && isLoggedIn) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    if (isAdminRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }

    // تطبيق middleware الترجمة
    return i18nMiddleware(req);
});

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};