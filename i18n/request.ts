import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async ({ locale }) => {
  const headersList = await headers();
  
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Asia/Dubai',
  };
  
});