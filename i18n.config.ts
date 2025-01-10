// i18n.config.ts
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './i18n/navigation';

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`./i18n/messages/${locale}.json`)).default,
    timeZone: 'Asia/Dubai',
    defaultLocale,
    locales: ['ar', 'en']
  };
});