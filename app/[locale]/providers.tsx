'use client';

import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { ClientSideProvider } from "./client-provider";

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
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
  );
}