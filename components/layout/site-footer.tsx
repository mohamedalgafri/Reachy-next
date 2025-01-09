import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";

import { getSiteSettings } from "@/lib/settings";
import * as lucideIcons from 'lucide-react';
import Image from "next/image";

export async function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {

  const settings = await getSiteSettings();

  return (
    <>

    <footer className=" footer">
    <div className="footerContant container">
      <Image className="logoF" src={settings?.logoImage} alt=""/>
      <div className="flex gap-1">
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
      <span className="text-sm">© 2025 REACHY Marketing Agency.</span>
    </div>
  </footer>

    </>

  );
}
