// app/[locale]/providers.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from 'next-intl';
import { ReduxProvider } from "@/store/provider";
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
    <ReduxProvider>
      <SessionProvider>
        <NextIntlClientProvider 
          locale={locale} 
          messages={messages}
          timeZone="Asia/Dubai"
        >
          <ClientSideProvider>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </ClientSideProvider>
        </NextIntlClientProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}