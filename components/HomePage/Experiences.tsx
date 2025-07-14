"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

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
    <div className="mt-32">
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

      <div className="overflow-hidden relative w-full h-full mt-6">
        <div className="bg-gray-950 w-[150px] h-[250px] absolute left-2/4 top-0 z-10 -translate-x-1/2"></div>
        <div ref={expeRef} className="flex gap-4 w-max">
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-500 rounded-md w-[150px] h-[150px] shrink-0"
            ></div>
          ))}
        </div>
        <div ref={expeRef2} className="flex gap-4 w-max mt-4">
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-500 rounded-md w-[150px] h-[150px] shrink-0"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
