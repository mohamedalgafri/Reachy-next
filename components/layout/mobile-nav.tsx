// app/[locale]/NavMobile.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";

import * as lucideIcons from 'lucide-react';
import Image from 'next/image';
import { LanguageSwitcher } from "../LanguageSwitcher";

interface NavItem {
  titleKey: string;
  href: string;
  disabled?: boolean;
}

interface NavMobileProps {
  scroll?: boolean;
  large?: boolean;
  navItems: NavItem[];
  settings?: {
    logoText?: string;
    logoImage?: string;
    socialLinks?: any;
    email?: string;
    phone?: string;
  };
}

export function NavMobile({ scroll = false, large = false, navItems, settings }: NavMobileProps) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const selectedLayout = useSelectedLayoutSegment();
  const locale = useLocale();
  const t = useTranslations('nav');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "absolute top-6 z-50 rounded-full p-2 transition-colors duration-200 hover:bg-muted focus:outline-none active:bg-muted md:hidden",
          open && "hover:bg-muted active:bg-muted",
          locale === "ar" ? "left-4" : "right-4"
        )}
      >
        {open ? (
          <X className="size-5 text-white" />
        ) : (
          <Menu className="size-5 text-white" />
        )}
      </button>

      <nav
        className={cn(
          "fixed inset-0 z-20 hidden w-full overflow-auto bg-background px-5 py-16 lg:hidden",
          open && "block",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Contact Info */}
          <div className="flex flex-col gap-4 mb-6 text-sm">
            {settings?.email && (
              <div className="flex items-center gap-2">
                <Image 
                  src="/images/envelope.svg" 
                  width={16}
                  height={16} 
                  alt="email"
                />
                <span>{settings.email}</span>
              </div>
            )}
            
            {settings?.phone && (
              <div className="flex items-center gap-2">
                <Image 
                  src="/images/whatsapp-brands-solid.svg" 
                  width={16}
                  height={16} 
                  alt="phone"
                />
                <span>{settings.phone}</span>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <ul className="grid divide-y divide-muted">
            {navItems.map((item, index) => (
              <li key={index} className="py-3">
                <Link
                  href={item.disabled ? "#" : item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex w-full font-medium transition-colors hover:text-foreground/80",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {t(item.titleKey)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer Section */}
          <div className="mt-auto pt-4 border-t">
            <div className="flex flex-col gap-4">
              {/* Language Switcher */}
              <div className="flex justify-between items-center">
                <LanguageSwitcher />
                <ModeToggle />
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {settings?.socialLinks?.map((item) => {
                  const iconName = item?.icon
                    ?.replace(/<|>|\//g, '')
                    ?.trim()
                    ?.replace(/^\w/, c => c.toUpperCase());

                  if (!iconName) return null;

                  const IconComponent = lucideIcons[iconName];
                  if (!IconComponent) return null;

                  return (
                    <Link 
                      target="_blank" 
                      key={item.name} 
                      href={item.url}
                      className="hover:text-primary transition-colors"
                    >
                      <IconComponent className="size-5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}