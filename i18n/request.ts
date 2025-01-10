import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return {
      messages,
      timeZone: 'Asia/Dubai',
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return {
      messages: {},
      timeZone: 'Asia/Dubai',
    };
  }
});