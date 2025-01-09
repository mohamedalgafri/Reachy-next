import { Montserrat, Almarai } from "next/font/google";
import localFont from "next/font/local";

// إضافة خط Montserrat
export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '700'],  // Light, Regular, Bold
  variable: '--font-montserrat',
  display: 'swap',
});

export const fontHeading = localFont({
  src: "./CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export const fontSatoshi = localFont({
  src: "./satoshi-variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
  style: "normal",
});

export const fontArabic = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-arabic',
  display: 'swap',
});