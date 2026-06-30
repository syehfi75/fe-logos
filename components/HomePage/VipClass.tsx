"use client";
import useHomeStore from "@/store/useHomeStore";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// @ts-ignore: swiper style side-effect imports may lack type declarations
import "swiper/css";
// @ts-ignore: swiper style side-effect imports may lack type declarations
import "swiper/css/navigation";

export default function VipClass() {
  const data = useHomeStore((state) => state.homeData?.section5);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-12 relative">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">
            {data?.title}
          </h2>
          <p className="text-gray-500 text-lg">{data?.desc}</p>
        </div>

        <div className="relative group">
          <button className="swiper-button-prev-custom absolute left-0 sm:-left-10 top-30 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-700 shadow-md hover:bg-gray-50 hover:scale-105 transition duration-200 disabled:opacity-0 disabled:pointer-events-none">
            <ChevronLeft />
          </button>

          <button className="swiper-button-next-custom absolute right-0 sm:-right-10 top-30 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-700 shadow-md hover:bg-gray-50 hover:scale-105 transition duration-200 disabled:opacity-0 disabled:pointer-events-none">
            <ChevronRight />
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="w-full"
          >
            {data?.course?.map((item: any, index: any) => (
              <SwiperSlide key={index} className="pb-4">
                <div className="flex flex-col gap-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-sm">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-w-7xl) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                      {item.title}
                    </h3>
                    {/* <p className="text-gray-500 mt-1">Rp 250.000</p> */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
