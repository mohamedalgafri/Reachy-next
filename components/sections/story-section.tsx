"use client";
import { Download } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

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
               position === 'right' ? 'blurR2' : 'blurL2',
               isLoaded && 'loaded'
           )}
       />
   );
};

interface StorySectionProps {
 data: {
   title: {
     ar: string;
     en: string;
   };
   subTitle: {
     ar: string;
     en: string;
   };
   profileUrl?: string;
 }
}

const StorySection = ({ data }: StorySectionProps) => {
 const locale = useLocale();

 return (
   <section className="sectionOS sectionBGColor">
     <div className="container relative">
       <div className="overlay-wrapper2 overlay-wrapperR">
         <BlurBackground position="right" />
       </div>
       <div className="overlay-wrapper2 overlay-wrapperL">
         <BlurBackground position="left" />
       </div>
       <div className="pt-10 relative">
         <div className="ballsCT">
           <div className="ballsColor">
             <div className="ballC"></div>
             <div className="ballC"></div>
             <div className="ballC"></div>
           </div>
           <div>
             <span className="uppercase font-bold text-white">
               {locale === 'ar' ? 'قصتنا.' : 'OUR STORY.'}
             </span>
           </div>
         </div>

         <div className="textSOC text-center mt-5 sm:mt-10 w-full">
           <div 
             className="uppercase max-w-4xl mx-auto font-bold text-white text-center text-xl md:text-2xl lg:text-3xl"
             dangerouslySetInnerHTML={{ __html: data.title[locale] }}
           />
           <div 
             className="text-white text-center max-w-2xl flex mx-auto w-full mt-5"
             dangerouslySetInnerHTML={{ __html: data.subTitle[locale] }}
           />

           <div className="btnsS flex gap-4 items-center justify-center mx-auto mt-5 text-white">
             <a href="" className="action btnArrow flex items-center gap-1 w-max py-1 px-8">
               <span className="textbtn">
                 {locale === 'ar' ? 'المزيد عنا' : 'More About us'}
               </span>
             </a>
             {data.profileUrl && (
               <div className="textdown">
                 <a 
                   href="" 
                   target="_blank"
                   className="flex items-center gap-2"
                   onClick={(e) => {
                     e.preventDefault();
                     window.open(data.profileUrl, '_blank');
                   }}
                 >
                   <Download className="h-5 w-5" />
                   {locale === 'ar' ? 'تحميل الملف التعريفي' : 'Download Profile'}
                 </a>
               </div>
             )}
           </div>
         </div>
       </div>
     </div>
     <Image 
       className="arrowSC arrowSC1" 
       width={80}
       height={80} 
       src="/images/arrow1.svg" 
       alt="decorative arrow"
     />
   </section>
 );
};

export default StorySection;