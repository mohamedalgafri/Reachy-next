"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarNavItem } from "@/types";
import { Menu, PanelLeftClose, PanelRightClose } from "lucide-react";
import { useTranslations } from 'next-intl';

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Icons } from "@/components/shared/icons";
import { RealTimeBadge } from '@/components/RealTimeBadge';
import Image from "next/image";

interface SidebarProps {
  links: SidebarNavItem[];
  settings?: {
    logoText?: string;
    logoImage?: string;
  }
}

interface SidebarNavProps extends SidebarProps {
  isExpanded?: boolean;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

function SidebarNav({ links, settings, isExpanded, isMobile, onLinkClick }: SidebarNavProps) {
  const path = usePathname();
  const t = useTranslations();

  const IconComponent = ({ iconName }: { iconName?: string }) => {
    const Icon = Icons[iconName || "arrowRight"];
    if (!Icon) {
      const DefaultIcon = Icons["arrowRight"];
      return <DefaultIcon className="size-5" />;
    }
    return <Icon className="size-5" />;
  };


  const NavLinks = () => (
    <>
      {links.map((section) => (
        <section
          key={section.titleKey}
          className="flex flex-col gap-0.5"
        >
          {(isExpanded || isMobile) ? (
            <p className="text-xs py-1 text-muted-foreground">
              {t(section.titleKey)}
            </p>
          ) : (
            <div className="h-4" />
          )}
          {section.items.map((item) => (
            item.href && (
              <Fragment key={`link-fragment-${item.titleKey}`}>
                {(isExpanded || isMobile) ? (
                  <Link
                    href={item.disabled ? "#" : item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted rtl:flex-row-reverse",
                      path === item.href
                        ? "bg-muted"
                        : "text-muted-foreground hover:text-accent-foreground",
                      item.disabled &&
                      "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                    )}
                    onClick={onLinkClick}
                  >
                    <IconComponent iconName={item.icon} />
                    {t(item.titleKey)}
                    {item.badge !== undefined && (
                      <RealTimeBadge
                        initialCount={item.badge}
                        type={item.href.includes('contacts') ? 'contacts' : undefined}
                      />
                    )}
                  </Link>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.disabled ? "#" : item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md py-2 text-sm font-medium hover:bg-muted",
                          path === item.href
                            ? "bg-muted"
                            : "text-muted-foreground hover:text-accent-foreground",
                          item.disabled &&
                          "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                        )}
                      >
                        <span className="flex size-full items-center justify-center">
                          <IconComponent iconName={item.icon} />
                        </span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {t(item.titleKey)}
                    </TooltipContent>
                  </Tooltip>
                )}
              </Fragment>
            )
          ))}
        </section>
      ))}
    </>
  );

  return (
    <nav className={cn(
      "flex flex-1 flex-col gap-4",
      isMobile ? "gap-y-8 p-6 text-lg" : "px-4 pt-1 rtl:text-end"
    )}>
      <NavLinks />
    </nav>
  );
}

export function DashboardSidebar({ links, settings }: SidebarProps) {
  const { isTablet } = useMediaQuery();
  const [isExpanded, setIsExpanded] = useState(!isTablet);

  useEffect(() => {
    setIsExpanded(!isTablet);
  }, [isTablet]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 h-full">
        <ScrollArea className="h-full overflow-y-auto ltr:border-r rtl:border-l">
          <aside className={cn(
            isExpanded ? "w-[220px] xl:w-[260px]" : "w-[68px]",
            "hidden h-screen md:block",
          )}>
            <div className="flex h-full max-h-screen flex-1 flex-col gap-2">
              <div className="flex h-14 items-center p-4 lg:h-[60px] rtl:flex-row-reverse justify-between">
                {isExpanded && (
                  <Link href="/" className="flex gap-2 items-center rtl:flex-row-reverse">
                    {settings?.logoImage && (
                      <Image 
                        src={settings.logoImage} 
                        alt="Logo" 
                        className="size-32 object-contain" 
                      />
                    )}
                    {settings?.logoText && (
                      <span className="font-satoshi text-lg font-bold">
                        {settings.logoText}
                      </span>
                    )}
                  </Link>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "size-9 lg:size-8",
                    isExpanded ? "rtl:mr-auto" : "mx-auto"
                  )}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <PanelLeftClose size={18} className="stroke-muted-foreground" />
                  ) : (
                    <PanelRightClose size={18} className="stroke-muted-foreground" />
                  )}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>

              <SidebarNav 
                links={links} 
                settings={settings} 
                isExpanded={isExpanded}
              />
            </div>
          </aside>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

export function MobileSheetSidebar({ links, settings }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const { isSm, isMobile } = useMediaQuery();

  if (!isSm && !isMobile) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-9 shrink-0 md:hidden mr-auto rtl:mr-0 rtl:ml-auto"
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="flex flex-col p-0 w-[80%] sm:w-[350px]"
      >
        <ScrollArea className="flex-1">
          <SidebarNav 
            links={links} 
            settings={settings} 
            isMobile={true}
            onLinkClick={() => setOpen(false)}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}