"use client";
import useHomeStore from "@/store/useHomeStore";
import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";

export default function AudioClass() {
  const data = useHomeStore((state) => state.homeData?.section4);

  if (!data) return null;
  return (
    <section className="relative w-full min-h-[600px] flex items-center py-20 my-20 overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${data.backgroundImage})`,
        }}
      >
        <div
          className="absolute inset-0 opacity-85"
          style={{ background: `${data.background}` }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-12 relative">
        <div className="mb-8">
          <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-8">
            {data.title}
          </h2>
          <div className="text-gray-300 text-lg leading-relaxed">
            <p>{data.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-center mt-12 w-max mx-auto">
          {data.course?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col justify-center bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm w-full md:w-[550px] "
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
                      {/* <button className="bg-[#2D1044] text-white w-full py-3 rounded-xl font-semibold hover:bg-[#3d165c] transition-colors">
                          Become a member
                        </button> */}
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
      </div>
    </section>
  );
}
