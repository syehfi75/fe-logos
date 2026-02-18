"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { banner1, banner2, banner3, banner4, banner5 } from "./assets";

export default function BeginJourney() {
  const slideShowRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  (useGSAP(() => {
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
      },
    );

    animationRef.current = tween;
    tween.timeScale(0.5);

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
    []);

  return (
    <>
      <div className="container mx-auto overflow-hidden mt-8">
        <div className="flex flex-col justify-center items-center gap-4 mb-10">
          <h1 className="text-7xl font-bold">
            Begin Your Healing and Growth Journey Today
          </h1>
          <p className="text-2xl text-gray-500 text-center">
            Release inner blocks and align mind, heart, and soul to resolve life
            challenges with SEFT.
          </p>
        </div>
        <div className="flex justify-center gap-4 p-2.5">
          
          <div className="flex flex-col gap-2 bg-white p-4 border border-gray-200 rounded-xl shadow-lg max-w-[365px]">
            <h3 className="font-bold text-2xl">FREE CLASS</h3>
            <p className="text-gray-500 text-xl">
              Free class to learn basic SEFT and understand solving emotional
              mental and spiritual life challenges simply.
            </p>
            <p className="text-xl text-red-500 mt-4">Coming Soon</p>
          </div>
        </div>
      </div>
    </>
  );
}
