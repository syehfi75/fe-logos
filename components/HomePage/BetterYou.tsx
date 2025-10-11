"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./styles/swiper-styles.css";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { betters } from "./assets";
import Image from "next/image";

const data = [
  "CAREER GROWTH",
  "GROW MY BUSINESS",
  "MASTER MY BODY",
  "TRANSITION IN LIFE",
  "LOVE CONNECTION",
  "SPIRITUAL SEEKER",
];

export default function BetterYou() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative py-8 mt-16 sm:mt-24 md:mt-32">
      <div className="container mx-auto px-4 sm:px-8 md:px-20 w-full">
        <div className="flex flex-col gap-4 w-full md:w-2/3 text-center md:text-left">
          <p className="uppercase text-logos-green">begin your journey</p>
          <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold">A better you</h4>
          <p className="text-sm sm:text-base md:text-lg text-gray-500">
            Grow your business, elevate your career, establish deep connections,
            uplift your health and more. <b>Tell us your goals</b>, and become a
            better you like never before.
          </p>
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        slidesPerView="auto"
        initialSlide={2}
        centeredSlides
        spaceBetween={12}
        navigation={{
          nextEl: ".next-slide",
          prevEl: ".prev-slide",
        }}
        className="mySwiper px-4 sm:px-6 mt-6 sm:mt-8"
      >
        {data.map((title, i) => (
          <SwiperSlide
            key={i}
            className="!w-[68vw] !h-[90vw] sm:!w-[260px] sm:!h-[380px] md:!w-[288px] md:!h-[431px] rounded-xl overflow-hidden slide-card flex content-center"
            
          >
            <Image
              src={betters[i]}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white font-bold text-center">
              <p className="text-sm sm:text-base md:text-lg font-normal opacity-80 mb-1">
                I'm looking to
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{title}</h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-6 gap-3 sm:gap-4">
        <button
          ref={prevRef}
          className="bg-white p-2 rounded-full shadow-md text-black prev-slide cursor-pointer"
        >
          <ArrowLeft />
        </button>
        <button className="px-4 sm:px-6 py-2 bg-logos-green text-white rounded-full font-semibold text-sm sm:text-base">
          Select path
        </button>
        <button
          ref={nextRef}
          className="bg-white p-2 rounded-full shadow-md text-black next-slide cursor-pointer"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
