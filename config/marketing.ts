import { MarketingConfig } from "@/types";

export const staticNav = [
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
    mainNav: [...staticNav],
  };
}