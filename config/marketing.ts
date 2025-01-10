// config/marketing.ts
import { MarketingConfig, NavItem } from "@/types";

export const staticNav: NavItem[] = [
  {
    titleKey: "home",  
    href: "/",
  },
  {
    titleKey: "services",
    href: "/services",
  },
  {
    titleKey: "about",
    href: "/about",
  },
  {
    titleKey: "contact",
    href: "/#contact",
  },
];

export async function getMarketingConfig(): Promise<MarketingConfig> {
  return {
    mainNav: staticNav, // إزالة spread operator
  };
}