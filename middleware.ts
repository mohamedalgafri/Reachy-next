import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n/navigation'; // أو المسار الصحيح

export default createMiddleware({
  // منع كشف اللغة تلقائياً
  localeDetection: false,
  // اللغات المدعومة
  locales: locales,
  // اللغة الافتراضية
  defaultLocale: defaultLocale,
  // إضافة بادئة اللغة دائماً
  localePrefix: 'always'
});
 
export const config = {
  // تجاهل المسارات التي لا تحتاج إلى i18n
  matcher: ['/((?!api|_next|.*\\..*).*)']
};