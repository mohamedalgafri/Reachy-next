"use client";

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';  // استخدام Link من next-intl
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
    // 1. طباعة القيم للتأكد من صحتها
    console.log('Current pathname:', pathname);
    console.log('Link href:', href);
  
    if (href.startsWith('#')) return false;
  
    // 2. معالجة الصفحة الرئيسية بشكل خاص
    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    
    // 3. معالجة باقي الروابط
    const currentPath = pathname.split('/').slice(2).join('/');
    const itemPath = href.startsWith('/') ? href.slice(1) : href;
    
    console.log('Comparing:', { currentPath, itemPath });
    
    return currentPath === itemPath;
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
                // استخدام Link من next-intl
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
          {/* استخدام Link من next-intl للشعار */}
          <Link 
            href="/"
            locale={locale}
            className="action logo text-white h-7 object-contain object-left"
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
                      {item.href.startsWith('#') ? (
                        <a href={item.href}>{t(item.titleKey)}</a>
                      ) : (
                        // استخدام Link من next-intl مع تحديد locale
                        <Link 
                          href={item.href}
                          locale={locale}
                        >
                          {t(item.titleKey)}
                        </Link>
                      )}
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