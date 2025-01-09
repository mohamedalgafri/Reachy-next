// app/[locale]/client-provider.tsx
'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import ModalProvider from "@/components/modals/providers";
import { Analytics } from "@/components/analytics";

export function ClientSideProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ModalProvider>
          {children}
        </ModalProvider>
        <Analytics />
        <Toaster richColors closeButton position="top-center" />
        <TailwindIndicator />
      </ThemeProvider>
    </>
  );
}