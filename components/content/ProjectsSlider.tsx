"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";


// استيراد ستايلات Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import DonationProgress from "./DonationProgress";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  targetAmount: number;
  currentAmount: number;
  slug: string;
}

export default function ProjectsSlider({ projects }: { projects: Project[] }) {
  return (
    <div className="relative group">
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-prev',
          prevEl: '.swiper-button-next',
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          550: {
            slidesPerView: 2,
          },
          991: {
            slidesPerView: 3,
          },
        }}
        // dir="rtl"
        className="!px-2"
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id} className="">
            <Link href={`/projects/${project.slug}`}>
              <Card className="h-full overflow-hidden">
                <div className="relative h-40">
                  {project.coverImage ? (
                    <Image
                      fill
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <CardHeader className="pb-0 pt-3 min-h-[85px]">
                  <CardTitle className="text-lg line-clamp-1">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DonationProgress
                    className="mt-0"
                    currentAmount={project.currentAmount}
                    targetAmount={project.targetAmount}
                  />
                </CardContent>
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button 
        className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden lg:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden lg:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Hide default Swiper navigation arrows */}
      <style jsx global>{`
        .swiper-button-next::after,
        .swiper-button-prev::after {
          display: none;
        }
      `}</style>
    </div>
  );
}