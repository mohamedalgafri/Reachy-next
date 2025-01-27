"use client";

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from "@/lib/utils";
import * as FA6Icons from 'react-icons/fa6';
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
    if (href.startsWith('#')) return false;

    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/` || pathname === '/';
    }

    const cleanPathname = pathname.replace(`/${locale}`, '');
    const itemPath = href.startsWith('/') ? href : `/${href}`;

    return cleanPathname === itemPath;
  };

  const renderSocialIcon = (item: any) => {
    const cleanIconName = item?.icon?.replace(/<|>|\//g, '')?.trim();
    if (!cleanIconName) return null;

    let iconName;
    if (cleanIconName.startsWith('Fa')) {
      iconName = cleanIconName;
    } else {
      iconName = `Fa${cleanIconName}`;
    }

    const IconComponent = FA6Icons[iconName];
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
  };

  return (
    <>
      <nav className="nevTop">
        <div className="container flex justify-between items-center w-full">
          <div className="leftNavTop">
            <div className="leftItemNavTop">
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
                  className="flex gap-2 items-center leftItemNavTopc"
                >
                  <FA6Icons.FaWhatsapp />
                  <span>{t('contactUs')}</span>
                </a>
              )}

              <LanguageSwitcher />
            </div>
          </div>

          <div className="rightNavTop">
            {settings?.socialLinks?.map((item) => renderSocialIcon(item))}
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
                        className='text-white'
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