import { Pathnames } from 'next-intl/navigation';
 
export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'ar';

export const pathnames = {
  '/': '/',
  '/auth/login': '/auth/login',
  '/admin': '/admin',
  // أضف باقي المسارات هنا
} satisfies Pathnames<typeof locales>;