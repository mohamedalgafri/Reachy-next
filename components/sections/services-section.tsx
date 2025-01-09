// components/sections/services-section.tsx
"use client";

import { useLocale } from 'next-intl'; 
import Image from 'next/image';

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
    <section className="sectionO sectionBGColor">
      <div className="container relative">
        <div className="pt-10">
          <div className="ballsCT">
            <div className="ballsColor">
              <div className="ballC"></div>
              <div className="ballC"></div>
              <div className="ballC"></div>
            </div>
            <div>
              <span className="uppercase font-bold text-white">{locale === 'ar' ? ".خدماتنا" : "OUR SERVICES."}</span>
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
                    <Image   width={300}
                      height={300} src={service.image} alt={service.subtitle} />
                  )}
                  <div className="textCardS">
                    <p className="text-base lg:text-xl" 
                       dangerouslySetInnerHTML={{ __html: locale === 'ar' ? service.title_ar : service.title_en }} 
                    />
                    <ul>
                      <div 
                        dangerouslySetInnerHTML={{ __html: locale === 'ar' ? service.subtitle_ar : service.subtitle_en }}
                        className="mt-2"
                      />
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Image className="arrowSC arrowSC2"   width={0}
  height={0} src="images/arrow2.svg" alt="image"  />
    </section>
  );
};

export default ServicesSection;