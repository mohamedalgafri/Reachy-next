import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { getSiteSettings } from "@/lib/settings";
import * as FA6Icons from 'react-icons/fa6';
import Image from "next/image";

export async function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const settings = await getSiteSettings();

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
        className="iconS flex items-center justify-center action flex-wrap text-white"
        key={item.name}
        href={item.url}
      >
        <IconComponent className="size-5" />
      </Link>
    );
  };

  return (
    <footer className="footer">
      <div className="footerContant container">
        <Image 
          width={0}
          height={0} 
          className="logoF" 
          src={settings?.logoImage} 
          alt="logo" 
        />
        
        <div className="flex gap-1 flex-wrap translate-x-6 rtl:-translate-x-6">
          {settings?.socialLinks?.map((item) => renderSocialIcon(item))}
        </div>
        
        <span className="text-sm">© 2025 REACHY Marketing Agency.</span>
      </div>
    </footer>
  );
}