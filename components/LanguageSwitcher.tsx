'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { usePathname, useRouter } from '@/i18n/navigation';  
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
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <div
            onClick={switchLocale}
            className="btnLang flex items-center gap-2 cursor-pointer">
            <Image 
                src="/images/iconLang.png"  
                width={24}
                height={24}
                className="size-6 object-contain" 
                alt="language icon"
            />
            <span>{locale === 'ar' ? 'English' : 'عربي'}</span>
        </div>
    );
}