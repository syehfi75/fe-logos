"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import useHomeStore from "@/store/useHomeStore";

export default function MembershipClass() {
  const data = useHomeStore((state) => state.homeData?.section2); 
  const expeRef = useRef<HTMLDivElement>(null);
  const expeRef2 = useRef<HTMLDivElement>(null); 

  useGSAP(() => {
    if (!data || !expeRef.current) return;
    const refList = [
      { el: expeRef.current, speed: 0.55 },
      { el: expeRef2.current, speed: 0.5 },
    ];

    refList.forEach(({ el, speed }) => {
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
  }, [data]);

  return (
    <div className="py-20">
      <div className="container max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col gap-4">
          <h4 className="text-4xl font-bold">
            {data?.title}
          </h4>
          <p className="text-lg text-gray-500">
            {data?.desc}
          </p>
        </div>
      </div>

      <div className="overflow-hidden relative w-full h-4/5 py-[49px]">
      {data?.course && <><div ref={expeRef} className="flex w-max">
          {data.course.slice(0, 9).map((data: any, index: any) => (
            <div key={index} className="w-[250px] md:w-[300px] h-full shrink-0 mr-4">
              <Image
                src={data.image}
                width={300}
                height={150}
                alt=""
                className="rounded-md"
                loading="eager"
              />
            </div>
          ))}
        </div>
        <div ref={expeRef2} className="flex gap-4 w-max mt-5">
          {data.course.slice(10, 19).map((data: any, index: any) => (
            <div
              key={index}
              className="w-[250px] md:w-[300px] h-full shrink-0"
            >
              <Image src={data.image} width={300} height={200} alt="" loading="eager" className="rounded-md" />
            </div>
          ))}
        </div></>}
        
      </div>
    </div>
  );
}
