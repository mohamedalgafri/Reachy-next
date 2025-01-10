// app/[locale]/layout.tsx
import { unstable_setRequestLocale } from 'next-intl/server';
import { Providers } from './providers';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // Store locale in a variable after awaiting params
  const locale = await Promise.resolve(params.locale);
  await unstable_setRequestLocale(locale);
  
  // Import messages using the resolved locale
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}