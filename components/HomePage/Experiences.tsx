"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { covers, covers2, phone } from "./assets";

export default function Experiences() {
  const expeRef = useRef<HTMLDivElement>(null);
  const expeRef2 = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const refList = [
      { el: expeRef.current, speed: 1 },
      { el: expeRef2.current, speed: 0.5 },
    ];

    refList.forEach(({ el, speed }) => {
      if (!el) return;

      // Duplikasi konten untuk looping
      el.innerHTML += el.innerHTML;
      const totalWidth = el.scrollWidth / 2;

      const tween = gsap.fromTo(
        el,
        { x: 0 },
        {
          x: -totalWidth,
          duration: 20,
          ease: "none",
          repeat: -1,
        }
      );

      tween.timeScale(speed);

      const slowDown = () => tween.timeScale(0.3);
      const normalSpeed = () => tween.timeScale(speed);

      el.addEventListener("mouseenter", slowDown);
      el.addEventListener("mouseleave", normalSpeed);

      return () => {
        el.removeEventListener("mouseenter", slowDown);
        el.removeEventListener("mouseleave", normalSpeed);
        tween.kill();
      };
    });
  }, []);

  return (
    <div className="mt-16 sm:mt-24 md:mt-32">
      <div className="container mx-auto px-4 sm:px-8 md:px-20 w-full">
        <div className="flex flex-col gap-4 w-full md:w-2/3 text-center md:text-left">
          <p className="uppercase text-logos-green">immersive experiences</p>
          <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            1,000+ customised tracks to elevate your mindset and feelings
          </h4>
          <p className="text-sm sm:text-base md:text-lg text-gray-500">
            With a push of a button — experience brain changing hypnotic audios,
            sound healings, meditations and instant mood elevations. Take charge
            of your mind.
          </p>
        </div>
      </div>

      <div className="overflow-hidden relative w-full h-[420px] sm:h-[500px] md:h-[580px] lg:h-[640px] mt-6 sm:mt-8 md:mt-10 py-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[220px] sm:w-[280px] md:w-[340px] lg:w-[380px] h-auto">
          <div className="relative w-full aspect-[9/19]">
            <Image src={phone} alt="Phone mockup" fill sizes="(max-width: 640px) 220px, (max-width: 768px) 280px, (max-width: 1024px) 340px, 380px" style={{ objectFit: "contain" }} />
          </div>
        </div>
        <div ref={expeRef} className="flex w-max gap-2 sm:gap-3 md:gap-4">
          {covers.map((src, index) => (
            <div key={index} className="relative w-[40vw] h-[40vw] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] shrink-0">
              <Image src={src} alt="" fill className="rounded-md" sizes="(max-width: 640px) 40vw, (max-width: 768px) 150px, (max-width: 1024px) 180px, 200px" style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
        <div ref={expeRef2} className="flex w-max gap-2 sm:gap-3 md:gap-4 mt-4">
          {covers2.map((src, index) => (
            <div key={index} className="relative w-[40vw] h-[40vw] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] shrink-0">
              <Image src={src} alt="" fill className="rounded-md" sizes="(max-width: 640px) 40vw, (max-width: 768px) 150px, (max-width: 1024px) 180px, 200px" style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
