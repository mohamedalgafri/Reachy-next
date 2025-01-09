"use client";

import { useLocale, useTranslations } from 'next-intl';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from '../LanguageSwitcher';
import * as lucideIcons from 'lucide-react';
import Image from 'next/image';

interface NavItem {
  titleKey: string;
  href: string;
}

interface NavBarProps {
  navItems: NavItem[];
  settings?: {
    logoText?: string;
    logoImage?: string;
    socialLinks?: any;
    email?: String;
    phone?: String;
  }
}

export function NavBar({ navItems, settings }: NavBarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('nav');

  const isActiveLink = (href) => {
    // تجاهل بادئة اللغة (ar/ أو en/) عند المقارنة
    const currentPath = pathname.split('/').slice(2).join('/')
    const itemPath = href.split('/').slice(1).join('/')
    return currentPath === itemPath
  }

  return (
    <>
      <nav className="nevTop">
        <div className="container flex justify-between items-center w-full">
          <div className="leftNavTop">
            <div className="leftItemNavTop">
              {/* البريد الإلكتروني */}
              {settings?.email && (
                <div className="flex gap-2 items-center">
                  <Image src="images/whatsapp-brands-solid.svg" className="size-4 object-contain" alt="" />
                  <span>{settings.email}</span>
                </div>
              )}

              {/* رقم الواتساب */}
              {settings?.phone && (
                <div className="flex gap-2 items-center leftItemNavTopc">
                  <Image src="images/whatsapp-brands-solid.svg" className="size-4 object-contain" alt="" />
                  <span>{t('contactUs')}</span>
                </div>
              )}

              {/* زر تغيير اللغة */}
              <LanguageSwitcher />
            </div>
          </div>

          {/* أيقونات التواصل الاجتماعي */}
          <div className="rightNavTop">

            {settings?.socialLinks?.map((item) => {
              const iconName = item?.icon
                ?.replace(/<|>|\//g, '')
                ?.trim()
                ?.replace(/^\w/, c => c.toUpperCase());

              if (!iconName) return null;

              const IconComponent = lucideIcons[iconName];
              if (!IconComponent) return null;

              return (
                <Link target="_blank" className="iconS flex items-center justify-center  action"
                  key={item.name}
                  href={item.url}>
                  <IconComponent className="size-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* القائمة الرئيسية */}
      <nav className="navbar">
        <div className="container flex justify-between items-center w-full">
          <Link href="/" className="action logo text-white h-7 object-contain object-left">
            {settings?.logoImage && (
              <Image className="size-full" src={settings.logoImage} alt="" />
            )}
          </Link>

          <div className="navMenu flex items-center gap-10 text-white">
            <div className="navMenuList">
              <ul className="flex items-center gap-3">
                {navItems.map((item) => {
                  const isActive = isActiveLink(item.href)
                  return (
                    <li
                      key={item.href}
                      className={cn(
                        "navList uppercase",
                        isActive && "active"
                      )}
                    >
                      <Link href={item.href}>
                        {t(item.titleKey)}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          <div id="menuIcon" className="menuIcon">
            <Image className="openNav" src="images/bars-solid.svg" alt="" />
            <Image className="closeNav" src="images/xmark-solid.svg" alt="" />
          </div>
        </div>
      </nav>
    </>
  );
}