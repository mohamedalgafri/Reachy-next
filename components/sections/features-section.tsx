'use client';

import Image from "next/image";
import { Feature } from "@prisma/client";
import { useLocale } from "next-intl";

interface FeaturesSectionProps {
  data: {
    title: {
      ar: string;
      en: string;
    };
    features: Feature[];
  };
}

export default function FeaturesSection({ data, features }: FeaturesSectionProps) {
  const locale = useLocale();
  
  return (
    <section className="sectionWR sectionBGColor">
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
                {locale === "ar" ? "لماذا ريتشي؟" : "WHY REACHY?"}
              </span>
            </div>
          </div>

          <div className="textSOC mt-5 sm:mt-10 w-full">
            <h2 
              className="uppercase max-w-3xl mx-auto font-bold text-white text-center text-xl md:text-2xl lg:text-3xl"
              dangerouslySetInnerHTML={{ __html: data.title[locale] }}
            />

            <div className="cards mt-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="cardWR">
                  {feature.image && (
                    <div className="relative w-8 h-8 mb-4">
                      <Image
                        src={feature.image}
                        alt="image" 
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h4 
                    className="text-2xl"
                    dangerouslySetInnerHTML={{ 
                      __html: locale === "ar" ? feature.title_ar : feature.title_en
                    }}
                  />
                  <p 
                    className="text-base"
                    dangerouslySetInnerHTML={{
                      __html: locale === "ar" ? feature.subtitle_ar : feature.subtitle_en
                    }} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Image className="arrowSC arrowSC3"   width={0}
  height={0} src="images/arrow3.svg" alt="image"  />
    </section>
  );
}