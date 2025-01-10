// app/[locale]/providers.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from 'next-intl';
import { Suspense } from "react";
import { ClientSideProvider } from "./client-provider";
import Loading from "../loading";

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <Suspense fallback={<Loading />}>
      <SessionProvider>
        <NextIntlClientProvider 
          locale={locale} 
          messages={messages}
          timeZone="Asia/Dubai"
        >
          <ClientSideProvider>
            {children}
          </ClientSideProvider>
        </NextIntlClientProvider>
      </SessionProvider>
    </Suspense>
  );
}