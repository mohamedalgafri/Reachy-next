// components/sections/hero-section.tsx
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale } from "next-intl";
import Image from "next/image";

interface HeroSectionProps {
    data: {
        title: {
            ar: string;
            en: string;
        };
        subTitle: {
            ar: string;
            en: string;
        };
        buttonText: {
            ar: string;
            en: string;
        };
        buttonLink: string;
    }
}

const HeroSection = ({ data }: HeroSectionProps) => {
    const locale = useLocale();
    
    return (
        <>
            <div className="bgHeaderHome">
                <div className="bgHeader"></div>
                <div className="overlay-wrapper overlay-wrapperR">
                    <div className="blur-background blurR"></div>
                </div>
                <div className="overlay-wrapper overlay-wrapperL">
                    <div className="blur-background blurL"></div>
                </div>
                <div>
                    {/* <video autoPlay loop className="backVideo lazy-video" muted playsInline>
                        <source src="images/02.mp4" type="video/mp4" />
                    </video> */}
                </div>
            </div>

            <header className="headerHome">
                <div className="container relative z-20 flex items-center gap-5 text-white h-full">
                    <div className="textHomeHero text-start">
                        <div className="ballsCT">
                            <div className="ballsColor">
                                <div className="ballC"></div>
                                <div className="ballC"></div>
                                <div className="ballC"></div>
                            </div>
                            <div>
                                <span className="uppercase font-bold text-white">
                                    {locale === 'ar' ? 'مرحباً!' : 'WELCOME!'}
                                </span>
                            </div>
                        </div>

                        <div 
                            className="text-xl md:text-2xl lg:text-2xl rtl:mb-1 uppercase" 
                            dangerouslySetInnerHTML={{ 
                                __html: data.title[locale] 
                            }} 
                        />
                        
                        <div 
                            className="text-2xl md:text-3xl lg:text-6xl uppercase" 
                            dangerouslySetInnerHTML={{ 
                                __html: data.subTitle[locale] 
                            }} 
                        />

                        <div className={`arrowBtn ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <a 
                                href={data.buttonLink} 
                                className="action btnArrow flex items-center gap-1 w-max mt-5 py-1 px-8"
                            >
                                <span className="textbtn">
                                    {data.buttonText[locale]}
                                </span>
                            </a>
                            <Image 
                                src="images/arrowHero.svg" 
                                alt="" 
                                className={locale === 'ar' ? 'transform rotate-180' : ''}
                            />
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
};

export default HeroSection;