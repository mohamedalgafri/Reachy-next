// app/[locale]/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { AdminGuard } from "@/components/auth/admin-guard";
import { getDashboardLinks } from "@/config/dashboard";
import {
  DashboardSidebar,
  MobileSheetSidebar,
} from "@/components/layout/dashboard-sidebar";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { getSiteSettings } from "@/lib/settings";
import { Toaster } from "@/components/ui/toaster";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SearchCommand } from "@/components/dashboard/search-command";
import { auth } from "@/auth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function ProtectedLayout({ 
  children,
  params: { locale } 
}: ProtectedLayoutProps) {
  const session = await auth();
  
  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  const [settings, sidebarLinks] = await Promise.all([
    getSiteSettings(),
    getDashboardLinks()
  ]);
  
  // تصفية الروابط بناءً على صلاحيات المستخدم
  const filteredLinks = sidebarLinks
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!item.authorizeOnly) return true;
        return item.authorizeOnly === session.user.role;
      })
    }))
    .filter(section => section.items.length > 0);

  return (
    <AdminGuard>
      <div className="relative flex min-h-screen w-full">
        <Toaster />
        <DashboardSidebar links={filteredLinks} settings={settings} />

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-50 flex h-14 bg-background px-4 lg:h-[60px] xl:px-8 items-center gap-2">
              <MobileSheetSidebar links={filteredLinks} settings={settings} />

              <div className="w-full flex-1">
                <SearchCommand links={filteredLinks} />
              </div>

              <LanguageSwitcher />
              <ModeToggle />
              <UserAccountNav 
                user={{
                  name: session.user.name,
                  email: session.user.email,
                  image: session.user.image
                }}
              />
          </header>

          <main className="flex-1 p-4 xl:px-8">
            <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
              {children}
            </MaxWidthWrapper>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}