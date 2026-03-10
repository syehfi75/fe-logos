"use client";
import useHomeStore from "@/store/useHomeStore";
import Image from "next/image";
import { useState } from "react";

export default function PremiumClass() {
  const data = useHomeStore((state) => state.homeData?.section3); 
  const [showAll, setShowAll] = useState(false);
  const displayCourses = showAll ? data?.course : data?.course.slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">{data?.title}</h2>
        <p className="text-gray-600 text-xl mb-4">{data?.desc}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {displayCourses?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover w-full h-full"
                  loading="eager"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                  {item.title}
                </h3>

                <div className="mt-auto pt-4">
                  {item.status ? (
                    <>
                      <p className="text-gray-900 font-medium mb-4">
                        {formatPrice(item.price)}
                      </p>
                      <button className="bg-[#2D1044] text-white w-full py-3 rounded-xl font-semibold hover:bg-[#3d165c] transition-colors">
                        Become a member
                      </button>
                    </>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {!showAll && data?.course.length > 4 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="border-2 border-[#2D1044] text-[#2D1044] px-10 py-3 rounded-full font-bold hover:bg-[#2D1044] hover:text-white transition-all hover:cursor-pointer"
            >
              Load More Programs
            </button>
          </div>
        )}
        {showAll && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(false)}
              className="text-gray-400 hover:text-gray-600 font-medium transition-all hover:cursor-pointer"
            >
              Show Less
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
