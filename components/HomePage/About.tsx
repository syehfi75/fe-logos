"use client";
import useHomeStore from "@/store/useHomeStore";

export default function About() {
  const data = useHomeStore((state) => state.homeData?.section5);
  if (!data) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {data.title}
          </h2>
          <p className="text-gray-500 text-xl max-w-2xl">
            {data.subTitle}
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {data.testimonies?.map((item: any, idx: number) => (
            <div 
              key={idx} 
              className="break-inside-avoid bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {item.title}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 leading-relaxed italic">
                "{item.testimony}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}