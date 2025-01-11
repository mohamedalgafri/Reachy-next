"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useState, useRef } from 'react';
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
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoVisible, setIsVideoVisible] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVideoVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const loadVideo = async () => {
            if (!isVideoVisible || !videoRef.current) return;

            try {
                // محاولة تحميل الفيديو
                videoRef.current.load();
                // تعيين المصدر مباشرة
                videoRef.current.src = '/images/02.mp4';
            } catch (error) {
                console.error('Error loading video:', error);
            }
        };

        loadVideo();
    }, [isVideoVisible]);

    const handleVideoLoad = () => {
        if (videoRef.current) {
            videoRef.current.play()
            setVideoLoaded(true);

                // .then(() => {
                //     // تأخير قصير لضمان انتقال سلس
                //     setTimeout(() => {
                //         setVideoLoaded(true);
                //     }, 100);
                // })
                // .catch(error => console.log("Auto-play was prevented:", error));
        }
    };

    return (
        <>
            <div className="bgHeaderHome bgVH">
                {/* Background overlay - سيبقى ظاهراً حتى يتم تحميل الفيديو بالكامل */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-overlay",
                    "transition-opacity duration-1000",
                )}></div>
                
                <div className="bgHeader"></div>
                <div className="overlay-wrapper overlay-wrapperR">
                    <BlurBackground position="right" />
                </div>
                <div className="overlay-wrapper overlay-wrapperL">
                    <BlurBackground position="left" />
                </div>
                
                {/* Video container */}
                <div 
                    className={cn(
                        'transition-opacity duration-1000',
                    )}
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="backVideo w-full h-full object-cover"
                        onLoadedData={handleVideoLoad}
                        preload="metadata"
                    />
                </div>
            </div>

            <header className="headerHome">
                <div className="container headerH relative z-20 flex items-center gap-5 text-white h-full">
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
                            <Link
                                href={locale === "ar" ? "ar/#contact" : "en/#contact"}
                                className="action btnArrow flex items-center gap-1 w-max mt-5 py-1 px-8"
                            >
                                <span className="textbtn">
                                    {locale === 'ar' ? "احجز استشارة مجانية الآن" : "Book a FREE Consultation Now"}
                                </span>
                            </Link>
                            <Image 
                                src="/images/arrowHero.svg" 
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
    );
};

export default HeroSection;