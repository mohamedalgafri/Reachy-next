// app/[locale]/layout.tsx
import { getMessages } from '@/lib/messages';
import { setRequestLocale } from 'next-intl/server';
import { Providers } from './providers';
import { fontArabic, montserrat } from '@/assets/fonts';
import { cn } from '@/lib/utils';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}


export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = params.locale;
  const messages = await getMessages(locale);
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={cn(
        "min-h-screen bg-background antialiased",
        montserrat.variable,
        fontArabic.variable,
        {
          'font-arabic': locale === 'ar',
          'font-montserrat': locale !== 'ar'
        }
      )}>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}