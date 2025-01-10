// i18n/navigation.ts
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['ar', 'en'] as const;
export const defaultLocale = 'ar';

export const { Link, redirect, usePathname, useRouter } = 
    createSharedPathnamesNavigation({ locales });