"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { ShoppingCart, User } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    gsap.set(nav, {
      y: 20,
      width: "95%",
      maxWidth: "1200px",
    });

    const trigger = ScrollTrigger.create({
      start: "top -10",
      onEnter: () => {
        setIsScrolled(true);
        gsap.to(nav, {
          y: 15,
          width: window.innerWidth < 768 ? "90%" : "80%",
          maxWidth: "1000px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(15px)",
          padding: "10px 24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          borderRadius: "100px",
          duration: 0.7,
          ease: "expo.out",
        });
      },
      onLeaveBack: () => {
        setIsScrolled(false);
        gsap.to(nav, {
          y: 20,
          width: "95%",
          maxWidth: "1200px",
          backgroundColor: "transparent",
          backdropFilter: "blur(0px)",
          padding: "20px 40px",
          boxShadow: "none",
          duration: 0.6,
          ease: "power3.inOut",
        });
      },
    });

    return () => trigger.kill();
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        clipPath: "circle(150% at 100% 0%)",
        duration: 1,
        ease: "expo.inOut",
      });
    } else {
      gsap.to(menuRef.current, {
        clipPath: "circle(0% at 100% 0%)",
        duration: 0.8,
        ease: "expo.inOut",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push("/");
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full z-[60] flex items-center justify-between"
      >
        <div
          className={`text-xl font-bold z-[70] transition-colors duration-500 ${
            isScrolled || isOpen ? "text-purple-900" : "text-white"
          }`}
        >
          LOGO
        </div>

        <div
          className={`hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] ${
            isScrolled ? "text-gray-600" : "text-white"
          }`}
        >
          <Link href="/" className="hover:text-purple-500 transition-colors">
            Home
          </Link>
          <Link href="#" className="hover:text-purple-500 transition-colors">
            Programs
          </Link>
          <Link href="#" className="hover:text-purple-500 transition-colors">
            Membership
          </Link>
        </div>
        <div className="flex items-center gap-3 z-[70]">
          {mounted && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 group focus:outline-none"
              >
                <ShoppingCart width={34} height={34} />
                <div className="w-10 h-10 rounded-full border-2 border-purple-500 overflow-hidden transition-transform cursor-pointer">
                  <User width={34} height={34} />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 overflow-hidden transition-all duration-300">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="font-bold text-purple-900 text-xs truncate">
                      {user.username || "User"}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors uppercase"
                  >
                    Dashboard
                  </Link>
                  {/* <Link
                    href="/profile"
                    className="block px-4 py-2 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors uppercase"
                  >
                    Settings
                  </Link> */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-black text-red-500 hover:bg-red-50 uppercase transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="cursor-pointer px-6 py-2 bg-purple-600 text-white text-[10px] font-bold uppercase rounded-full shadow-lg hover:bg-purple-700 hover:scale-105 transition-all active:scale-95"
            >
              Login
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none"
          >
            <span
              className={`h-0.5 w-6 bg-current transition-all duration-500 ${
                isOpen
                  ? "rotate-45 translate-y-2 text-purple-900"
                  : isScrolled
                    ? "text-purple-900"
                    : "text-white"
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-current transition-all duration-300 ${
                isOpen
                  ? "opacity-0"
                  : isScrolled
                    ? "text-purple-900"
                    : "text-white"
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-current transition-all duration-500 ${
                isOpen
                  ? "-rotate-45 -translate-y-2 text-purple-900"
                  : isScrolled
                    ? "text-purple-900"
                    : "text-white"
              }`}
            />
          </button>
        </div>
      </nav>

      <div
        ref={menuRef}
        style={{ clipPath: "circle(0% at 100% 0%)" }}
        className="fixed inset-0 bg-white z-[55] flex flex-col items-center justify-center gap-8 text-3xl font-bold text-purple-900"
      >
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="hover:scale-110 transition-transform"
        >
          Home
        </Link>
        <Link
          href="#"
          onClick={() => setIsOpen(false)}
          className="hover:scale-110 transition-transform"
        >
          Programs
        </Link>
        <Link
          href="#"
          onClick={() => setIsOpen(false)}
          className="hover:scale-110 transition-transform"
        >
          Membership
        </Link>
        {mounted && user && (
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="text-purple-500"
          >
            Dashboard
          </Link>
        )}
      </div>
    </>
  );
}
