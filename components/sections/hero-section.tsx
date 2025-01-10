"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

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

const BlurBackground = ({ position }: { position: 'left' | 'right' }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetch(`/images/bg${position === 'right' ? 'R' : 'L'}.webp`)
            .then(response => response.blob())
            .then(() => setIsLoaded(true))
            .catch(error => console.error('Error loading image:', error));
    }, [position]);

    return (
        <div
            className={cn(
                'blur-background',
                position === 'right' ? 'blurR' : 'blurL',
                isLoaded && 'loaded'
            )}
        />
    );
};

const HeroSection = ({ data }: HeroSectionProps) => {
    const locale = useLocale();
    const [videoLoaded, setVideoLoaded] = useState(false);

    const handleVideoLoad = (video: HTMLVideoElement) => {
        if (video) {
            video.play().catch(error => console.log("Auto-play was prevented:", error));
            setVideoLoaded(true);
        }
    };
    
    return (
        <>
            <div className="bgHeaderHome bgVH">
                <div className="bgHeader"></div>
                <div className="overlay-wrapper overlay-wrapperR">
                    <BlurBackground position="right" />
                </div>
                <div className="overlay-wrapper overlay-wrapperL">
                    <BlurBackground position="left" />
                </div>
                <div 
                    className={cn(
                        'absolute inset-0 ',
                        'opacity-0 transition-opacity duration-1000',
                        videoLoaded && 'opacity-100'
                    )}
                >
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="backVideo lazy-video w-full h-full object-cover"
                        onLoadedData={(e) => handleVideoLoad(e.target as HTMLVideoElement)}
                    >
                        <source src="/images/02.mp4" type="video/mp4" />
                    </video>
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

                        <div className={`arrowBtn`}>
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
                                alt="image"  
                                width={80}
                                height={80}
                                className={locale === 'ar' ? 'transform rotate-180' : ''}
                                priority
                            />
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
};

export default HeroSection;