import { Providers } from './providers';
import { unstable_setRequestLocale } from 'next-intl/server';
import { cn } from "@/lib/utils";
import { montserrat , fontArabic } from "@/assets/fonts";


interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = await params.locale; 
  unstable_setRequestLocale(locale);
  
  let messages;
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  } catch (error) {
    messages = (await import(`@/i18n/messages/ar.json`)).default;
  }

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}
    className={cn(
      "min-h-screen bg-background antialiased",
      montserrat.variable,
      fontArabic.variable
    )}
    lang={locale}>
      <Providers locale={locale} messages={messages}>
        <main className="min-h-screen bg-background antialiased">
          {children}
        </main>
      </Providers>
    </div>
  );
}