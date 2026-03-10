"use client";
import useHomeStore from "@/store/useHomeStore";

export default function ProvenResults() {
  const data = useHomeStore((state) => state.homeData?.section4); 
  if (!data) return null;
  return (
    <section className="relative w-full min-h-[600px] flex items-center py-20 overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${data.bgImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="max-w-xl">
            <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-8">
              {data.title}
            </h2>
            <div className="text-gray-300 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: data.desc }}></div>
          </div>

          <div className="space-y-12">
            {data.items.map((result: any, index: number) => (
              <div key={index} className="flex items-start gap-6">
              <div className="mt-1.5 w-4 h-4 rounded-full bg-gray-400 flex-shrink-0"></div>
              <div>
                <h3 className="text-white text-2xl font-bold mb-3 uppercase tracking-wider">
                  {result.title}
                </h3>
                <p className="text-white leading-relaxed">
                  {result.desc}
                </p>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
