"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function FullPageLoader() {
  const overlayRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        delay: 0.5,
        onComplete: () => {
          setIsVisible(false);
        },
      });
      gsap.fromTo(
        "main",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.7 },
      );
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-blue-600" />
      <p className="mt-4 font-medium text-gray-500 tracking-widest uppercase text-xs">
        Loading Content
      </p>
    </div>
  );
}
