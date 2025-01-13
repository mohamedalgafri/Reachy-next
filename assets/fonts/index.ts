import { Montserrat ,Almarai } from "next/font/google";
import localFont from "next/font/local";

// إضافة خط Montserrat
export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '700'],  // Light, Regular, Bold
  variable: '--font-montserrat',
  display: 'swap',
});

export const fontArabic = localFont({
  src: "./29ltbukralight.otf",
  variable: "--font-arabic",
  display: 'swap',
  preload: true,
  fallback: ['Almarai', 'system-ui', 'sans-serif']
});

// export const fontArabic = Almarai({
//   subsets: ['arabic'],
//   weight: ['300', '400', '700', '800'],
//   variable: '--font-arabic',
//   display: 'swap',
// });