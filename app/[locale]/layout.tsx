// app/[locale]/layout.tsx
import { Suspense } from 'react';
import Loading from "../loading";
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
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={cn(
        "min-h-screen bg-background antialiased",
        montserrat.variable,
        fontArabic.variable
      )}
      lang={locale}>
      <Providers locale={locale} messages={messages}>
        <Suspense fallback={<Loading />}>
          <main className="min-h-screen bg-background antialiased">
            {children}
          </main>
        </Suspense>
      </Providers>
    </div>
  );
}