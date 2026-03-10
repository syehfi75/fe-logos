"use client";
import useHomeStore from "@/store/useHomeStore";

export default function BeginJourney() {
  const data = useHomeStore((state) => state.homeData?.section1); 
  if (!data) return null; 

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">
            {data.title}
          </h2>
          <p className="text-gray-500 text-lg md:text-[32px] max-w-3xl mx-auto">
            {data.desc}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.packages.map((card: any, index: any) => (
            <div
              key={index}
              className="flex flex-col justify-between p-8 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <h3 className="font-bold text-xl mb-4 text-gray-900">
                  {card.title}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-8">
                  {card.desc}
                </p>
              </div>
              <div className="mt-auto">
                {!card.status ? (
                  <span className="text-red-500 font-medium">Coming Soon</span>
                ) : (
                  <button className="flex items-center gap-2 font-medium text-gray-900 hover:gap-3 transition-all">
                    {card.text}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
