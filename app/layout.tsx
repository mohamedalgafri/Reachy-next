import "@/styles/globals.css";
import { montserrat } from "@/assets/fonts";
import { cn, constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          montserrat.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}