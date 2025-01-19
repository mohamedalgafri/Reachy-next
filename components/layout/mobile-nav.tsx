"use client";

import { useEffect, useState } from "react";
import { useSelectedLayoutSegment, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from "@/lib/utils";
import * as FA6Icons from 'react-icons/fa6';
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
  const pathname = usePathname();
  const t = useTranslations('nav');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const isActiveLink = (href: string) => {
    if (href.startsWith('#')) return false;

    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/` || pathname === '/';
    }

    const cleanPathname = pathname.replace(`/${locale}`, '');
    const itemPath = href.startsWith('/') ? href : `/${href}`;

    return cleanPathname === itemPath;
  };

  const renderSocialIcon = (item: any) => {
    // إزالة الـ <>/ من اسم المكون
    const cleanIconName = item?.icon?.replace(/<|>|\//g, '')?.trim();
    if (!cleanIconName) return null;

    // معالجة الاسم للحصول على اسم المكون الصحيح
    let iconName;
    // التحقق من وجود Fa في بداية الاسم
    if (cleanIconName.startsWith('Fa')) {
      iconName = cleanIconName;
    } else {
      // إضافة Fa إلى بداية الاسم إذا لم يكن موجوداً
      iconName = `Fa${cleanIconName}`;
    }

    // الحصول على المكون من مكتبة FA6Icons
    const IconComponent = FA6Icons[iconName];
    if (!IconComponent) return null;

    return (
      <Link
        target="_blank"
        key={item.name}
        href={item.url}
        locale={locale}
        className="hover:text-primary transition-colors"
      >
        <IconComponent className="size-5" />
      </Link>
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "absolute top-6 z-50 rounded-full p-2 transition-colors duration-200 hover:bg-muted focus:outline-none active:bg-muted lg:hidden",
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
          "fixed bgBM inset-0 z-20 w-full  overflow-auto bg-background px-5 py-16  lg:hidden",
          "transform transition-transform duration-300 ease-in-out",
          locale === "ar" 
            ? open ? "translate-x-0" : "-translate-x-full"  
            : open ? "translate-x-0" : "translate-x-full",  
        )}
      >
        <div className="flex flex-col h-full">
          {/* Contact Info */}
          <div className="flex flex-col gap-4 mb-6 text-sm">

            {settings?.email && (
              <a
                href={`mailto:${settings?.email}`}
                target='_blank'
                className="flex gap-2 items-center"
              >
                <FA6Icons.FaEnvelope />
                <span>{settings.email}</span>
              </a>
            )}

            {settings?.phone && (
              <a
                href={`https://wa.me/${settings?.phone}`}
                target='_blank'
                className="flex  items-center gap-2">
                <FA6Icons.FaWhatsapp className="text-xl" />
                <span>{locale === "ar" ? "دعونا نتحدث!" : "Lets Talk!"}</span>
              </a>
            )}
          </div>

          {/* Navigation Items */}
          <ul className="grid divide-y divide-muted">
            {navItems.map((item, index) => {
              const isActive = isActiveLink(item.href);
              return (
                <li
                  key={index}
                  className={cn(
                    "py-3",
                    isActive && "active"
                  )}
                >
                  <Link
                    href={item.disabled ? "#" : item.href}
                    onClick={() => setOpen(false)}
                    locale={locale}
                    className={cn(
                      "flex w-full font-medium transition-colors hover:text-foreground/80 text-white",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                  >
                    {t(item.titleKey)}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Footer Section */}
          <div className="mt-auto pt-4 border-t">
            <div className="flex flex-col gap-4">
              {/* Language Switcher */}
              <div className="flex justify-between items-center">
                <LanguageSwitcher />
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 flex-wrap">
                {settings?.socialLinks?.map((item) => renderSocialIcon(item))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}