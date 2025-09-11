"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { banner1, banner2, banner3, banner4, banner5 } from "./assets";

export default function BeginJourney() {
  const slideShowRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    const el = slideShowRef.current;
    if (!el) return;

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

    animationRef.current = tween;
    tween.timeScale(0.5)

    const slowDown = () => tween.timeScale(0.3);
    const normalSpeed = () => tween.timeScale(0.5);

    el.addEventListener("mouseenter", slowDown);
    el.addEventListener("mouseleave", normalSpeed);

    return () => {
      el.removeEventListener("mouseenter", slowDown);
      el.removeEventListener("mouseleave", normalSpeed);
      tween.kill();
    };
  }),
    [];

  return (
    <>
      <div className="container mx-auto px-20 overflow-hidden mt-8">
        <div className="flex flex-col justify-center items-center gap-4 mb-10">
          <h1 className="text-7xl font-bold">Begin your journey today</h1>
          <p className="text-2xl text-gray-500 text-center">
            Unlock your fullest potential in any field with only 20-minutes a
            day of invaluable coaching from the world’s best
          </p>
          <button className="outline-0 bg-logos-green text-white font-bold text-xl p-4 rounded-full w-64">
            Become a member
          </button>
        </div>
      </div>
      <div className="mt-32">
        <div className="container mx-auto px-20 w-full">
          <div className="flex flex-col gap-4 w-2/3">
            <p className="uppercase text-logos-green">growth in all areas</p>
            <h4 className="text-4xl font-bold">
              100+ of the world’s top programs for personal growth and
              transformation
            </h4>
            <p className="text-lg text-gray-500">
              Forge lasting transformations in your mind, body, soul, love and
              career with 20-minute micro-coaching sessions each day led by
              top-tier teachers worldwide.
            </p>
          </div>
        </div>
        <div className="overflow-hidden w-full mt-6">
          <div ref={slideShowRef} className="flex gap-4 cursor-pointer w-max">
            <div className="slide rounded-md w-[450px] h-[200px] shrink-0">
              <Image src={banner1} alt="" />
            </div>
            <div className="slide rounded-md w-[450px] h-[200px] shrink-0">
              <Image src={banner2} alt="" />
            </div>
            <div className="slide rounded-md w-[450px] h-[200px] shrink-0">
              <Image src={banner3} alt="" />
            </div>
            <div className="slide rounded-md w-[450px] h-[200px] shrink-0">
              <Image src={banner4} alt="" />
            </div>
            <div className="slide rounded-md w-[450px] h-[200px] shrink-0">
              <Image src={banner5} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
