"use client";
import { useLocale } from 'next-intl'; 
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

// مكون BlurBackground منفصل
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

interface ServiceData {
  id: number;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  image: string;
  isActive: boolean;
}

interface ServicesSectionProps {
  services: ServiceData[];
  data: {
    title: {
      ar: string;
      en: string;
    };
  }
}

const ServicesSection = ({ data, services }: ServicesSectionProps) => {
  const locale = useLocale(); 
  const title = locale === 'ar' ? data.title.ar : data.title.en;

  return (
    <section className="sectionO sectionBGColor relative">
      <div className="overlay-wrapper overlay-wrapperR">
        <BlurBackground position="right" />
      </div>
      <div className="overlay-wrapper overlay-wrapperL">
        <BlurBackground position="left" />
      </div>
      <div className="container relative">
        <div className="pt-10">
          <div className="ballsCT">
            <div className="ballsColor">
              <div className="ballC"></div>
              <div className="ballC"></div>
              <div className="ballC"></div>
            </div>
            <div>
              <span className="uppercase font-bold text-white">
                {locale === 'ar' ? ".خدماتنا" : "OUR SERVICES."}
              </span>
            </div>
          </div>

          <div className="textSOC mt-5 sm:mt-10 w-full">
            <div 
              className="uppercase max-w-4xl mx-auto font-bold text-white text-center text-xl md:text-2xl lg:text-3xl"
              dangerouslySetInnerHTML={{ __html: title }}
            />            
            <div className="cards mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <div key={service.id} className={`cardS ${index % 2 !== 0 ? 'orgCS' : ''}`}>
                  {service.image && (
                    <Image
                      width={300}
                      height={300}
                      src={service.image}
                      alt={service.subtitle}
                      className="w-full h-auto object-cover"
                    />
                  )}
                  <div className="textCardS">
                    <p 
                      className="text-base lg:text-xl"
                      dangerouslySetInnerHTML={{ 
                        __html: locale === 'ar' ? service.title_ar : service.title_en 
                      }} 
                    />
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: locale === 'ar' ? service.subtitle_ar : service.subtitle_en 
                      }}
                      className="mt-2 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Image 
        className="arrowSC arrowSC2" 
        width={80}
        height={80}
        src="/images/arrow2.svg" 
        alt="arrow decoration" 
      />
    </section>
  );
};

export default ServicesSection;