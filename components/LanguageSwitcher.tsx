'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const switchLocale = () => {
        const nextLocale = locale === 'ar' ? 'en' : 'ar';
        const newPathname = pathname.replace(`/${locale}`, `/${nextLocale}`);
        router.push(newPathname);
    };

    return (
        <div
            onClick={switchLocale}
            className="btnLang flex items-center gap-2">
            <Image src="/images/iconLang.png"  
            width={24}
            height={24}
            className="size-6 object-contain" alt="image"
            />
            <span>{locale === 'ar' ? 'English' : 'عربي'}</span>
        </div>
  );
}