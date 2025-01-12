'use client';

import { Client } from "@prisma/client";
import { useLocale } from "next-intl";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from "next/image";

interface ClientsSectionProps {
    clients: Client[];
}

export default function ClientsSection({ clients }: ClientsSectionProps) {
    const locale = useLocale();

    return (
        <section className="sectionOC sectionBGColor">
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
                                {locale === "ar" ? "عملائنا" : "Our Clients."}
                            </span>
                        </div>
                    </div>

                    <div className="textSOC mt-5 sm:mt-10 w-full">
                        <div className="sliderSec relative">
                            <div className="swiper-button-next next-BoardO"></div>
                            <div className="swiper-button-prev prev-BoardO"></div>
                            
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={15}
                                slidesPerView={2}
                                navigation={{
                                    nextEl: '.next-BoardO',
                                    prevEl: '.prev-BoardO',
                                }}
                                breakpoints={{
                                    500: {
                                        slidesPerView: 3,
                                        spaceBetween: 15,
                                    },
                                    767: {
                                        slidesPerView: 4,
                                        spaceBetween: 15,
                                    },
                                    991: {
                                        slidesPerView: 5,
                                        spaceBetween: 40,
                                    },
                                }}
                                className="sliderOC"
                            >
                                {clients.map((client) => (
                                    <SwiperSlide key={client.name}>
                                        <a href="#" className="cardOC block">
                                            <div className="relative w-full aspect-[4/3]">
                                                <Image
                                                    src={client.image}
                                                    alt={client.name}
                                                    fill
                                                    className="object-contain"
                                                    sizes="(max-width: 400px) 50vw, (max-width: 767px) 33vw, (max-width: 991px) 25vw, 20vw"
                                                />
                                            </div>
                                        </a>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}