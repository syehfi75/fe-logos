"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./styles/swiper-styles.css"; // kita akan styling aktif/pasif di sini
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const data = [
  "CAREER GROWTH",
  "GROW MY BUSINESS",
  "MASTER MY BODY",
  "TRANSITION IN LIFE",
  "LOVE CONNECTION",
  "LOVE CONNECTION",
  "LOVE CONNECTION",
  "LOVE CONNECTION",
  "LOVE CONNECTION",
];

export default function BetterYou() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative py-8 mt-32">
      <div className="container mx-auto px-20 w-full">
        <div className="flex flex-col gap-4 w-2/3">
          <p className="uppercase text-logos-green">immersive experiences</p>
          <h4 className="text-4xl font-bold">
            1,000+ customised tracks to elevate your mindset and feelings
          </h4>
          <p className="text-lg text-gray-500">
            With a push of a button — experience brain changing hypnotic audios,
            sound healings, meditations and instant mood elevations. Take charge
            of your mind.
          </p>
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        slidesPerView="auto"
        centeredSlides
        spaceBetween={20}
        navigation={{
          nextEl: ".next-slide",
          prevEl: ".prev-slide",
        }}
        className="mySwiper px-6 mt-8"
      >
        {data.map((title, i) => (
          <SwiperSlide
            key={i}
            className="!w-[288px] !h-[431px] bg-gray-500 rounded-xl overflow-hidden slide-card"
          >
            <div className="flex flex-col justify-end h-full p-4 text-white font-bold text-xl">
              <p className="text-sm font-normal opacity-80 mb-1">
                I'm looking to
              </p>
              <h2>{title}</h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-6 gap-4">
        <button
          ref={prevRef}
          className="bg-white p-2 rounded-full shadow-md text-black prev-slide cursor-pointer"
        >
          <ArrowLeft />
        </button>
        <button className="px-6 py-2 bg-logos-green text-white rounded-full font-semibold">
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
