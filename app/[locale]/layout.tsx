import { Providers } from './providers';
import { montserrat } from "@/assets/fonts";
import { unstable_setRequestLocale } from 'next-intl/server';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // تخزين params بشكل كامل أولاً
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
  unstable_setRequestLocale(locale);
  
  let messages;
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  } catch (error) {
    messages = (await import(`@/i18n/messages/ar.json`)).default;
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={montserrat.variable}
        suppressHydrationWarning
      >
        <Providers 
          locale={locale} 
          messages={messages}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}