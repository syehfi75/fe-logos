"use client";
import useHomeStore from "@/store/useHomeStore";

export default function HeroHomePage() {
  const data = useHomeStore((state) => state.homeData?.heroSection); 
  if (!data) return;

  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#4c0a87] to-[#1a0236]">
      <div className="text-center px-4">
        <p className="text-gray-300 text-xl mb-4">{data.subtitle}</p>
        <h1 className="text-white font-bold text-6xl md:text-80px mb-10 leading-tight">
          {data.title}
        </h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="bg-white text-black px-8 py-3 rounded-xl font-bold">
            {data.button1.title}
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold">
            {data.button2.title}
          </button>
        </div>
      </div>
    </section>
  );
}