import { NavMobile } from "@/components/layout/mobile-nav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { getMarketingConfig } from "@/config/marketing";
import { getSiteSettings } from "@/lib/settings";


interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  const dynamicNavItems = await getMarketingConfig();
  const navItems = dynamicNavItems.mainNav;
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col bg-white">
      <NavMobile navItems={navItems} settings={settings} />
      <NavBar navItems={navItems} settings={settings} />
        {children}
      <SiteFooter className="border-t" />
    </div>
  );
}