import { fontArabic, montserrat } from "@/assets/fonts";
import { cn, constructMetadata } from "@/lib/utils";
import "@/styles/globals.css";
import Script from "next/script";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata = constructMetadata({
  title: "Reachy",
  description: "Reachy",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <Script id="theme-handler" strategy="beforeInteractive">
          {`
            let theme = localStorage.getItem('theme')
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark')
            }
          `}
        </Script>
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          montserrat.variable,
          fontArabic.variable
        )}
      >
        <Suspense fallback={<Loading />}>
        {children}
        </Suspense>
      </body>
    </html>
  );
}