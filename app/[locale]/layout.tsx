import { Providers } from './providers';
import { setRequestLocale } from 'next-intl/server';
import { cn } from "@/lib/utils";
import { montserrat , fontArabic } from "@/assets/fonts";
import { getMessages } from '@/lib/messages';


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
        <main className="min-h-screen bg-background antialiased">
          {children}
        </main>
      </Providers>
    </div>
  );
}