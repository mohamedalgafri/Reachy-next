'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { usePathname } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { FaLanguage } from 'react-icons/fa6';

export function LanguageSwitcher() {
    const locale = useLocale();
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
        const currentPath = pathname.replace(`/${locale}`, '') || '/';
        const newPath = `/${nextLocale}${currentPath}`;
        window.location.href = newPath;
    };

    return (
        <button 
            onClick={switchLocale}
            className="btnLang flex items-center gap-2 cursor-pointer"
            aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
        >
            <Image 
                src="/images/iconLang.png"  
                width={24}
                height={24}
                className="size-6 object-contain" 
                alt="language icon"
            />
            {/* <FaLanguage /> */}
            {locale === 'ar' ? 
            <span>English</span>
             :
             <span className='font-arabic'>عربي</span>
            }
            
        </button>
    );
}