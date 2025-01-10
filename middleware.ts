import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/navigation';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: ['/', '/(ar|en)/:path*']
};