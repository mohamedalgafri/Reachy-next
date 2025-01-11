"use client";

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from "@/lib/utils";
import * as lucideIcons from 'lucide-react';
import Image from 'next/image';
import { LanguageSwitcher } from '../LanguageSwitcher';

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

  const isActiveLink = (href: string) => {
    // تجاهل الروابط التي تبدأ بـ #
    if (href.startsWith('#')) return false;
    
    // معالجة خاصة للصفحة الرئيسية
    if (href === '/') {
      // تحقق مما إذا كان المسار الحالي هو الصفحة الرئيسية
      return pathname === `/${locale}` || pathname === `/${locale}/` || pathname === '/';
    }

    // للصفحات الأخرى، قم بإزالة بادئة اللغة وقارن المسارات
    const cleanPathname = pathname.replace(`/${locale}`, '');
    // إذا كان الرابط لا يبدأ بـ /، أضف / في البداية
    const itemPath = href.startsWith('/') ? href : `/${href}`;
    
    return cleanPathname === itemPath;
  };

  return (
    <>
      <nav className="nevTop">
        <div className="container flex justify-between items-center w-full">
          <div className="leftNavTop">
            <div className="leftItemNavTop">
              {settings?.email && (
                <div className="flex gap-2 items-center">
                  <Image 
                    src="/images/envelope.svg"
                    width={16}
                    height={16}
                    className="size-4 object-contain" 
                    alt="email icon" 
                  />
                  <span>{settings.email}</span>
                </div>
              )}

              {settings?.phone && (
                <div className="flex gap-2 items-center leftItemNavTopc">
                  <Image 
                    src="/images/whatsapp-brands-solid.svg"
                    width={16}
                    height={16}
                    className="size-4 object-contain" 
                    alt="whatsapp icon" 
                  />
                  <span>{t('contactUs')}</span>
                </div>
              )}

              <LanguageSwitcher />
            </div>
          </div>

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
                <Link 
                  target="_blank" 
                  className="iconS flex items-center justify-center action"
                  key={item.name}
                  href={item.url}
                  locale={locale}
                >
                  <IconComponent className="size-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <nav className="navbar">
        <div className="container flex justify-between items-center w-full">
          <Link 
            href="/"
            locale={locale}
            className={`action logo text-white h-7 object-contain ${locale === "ar" ? "object-right" : "object-left"} `}
          >
            {settings?.logoImage && (
              <Image 
                className="size-full" 
                width={28}
                height={28}
                src={settings.logoImage} 
                alt="logo" 
              />
            )}
          </Link>

          <div className="navMenu flex items-center gap-10 text-white">
            <div className="navMenuList">
              <ul className="flex items-center gap-5">
                {navItems.map((item) => {
                  const isActive = isActiveLink(item.href);
                  return (
                    <li
                      key={item.href}
                      className={cn(
                        "navList uppercase textdown",
                        isActive && "active"
                      )}
                    >
                        <Link 
                          href={item.href}
                          locale={locale}
                        >
                          {t(item.titleKey)}
                        </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}