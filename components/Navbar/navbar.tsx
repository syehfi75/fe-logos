"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, User } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const disabledRoutes = ["/mentor", "/lesson"];
  const disableNavbar = disabledRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const navRef = useRef(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const nav = navRef.current;

    setIsScrolled(false);
    setIsOpen(false);
    setShowUserMenu(false);

    if (isHome) {
      gsap.set(nav, {
        y: 20,
        width: "95%",
        maxWidth: "1200px",
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
        padding: "20px 40px",
        borderRadius: "0px",
        boxShadow: "none",
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
            borderRadius: "0px",
            duration: 0.6,
            ease: "power3.inOut",
          });
        },
      });
      return () => trigger.kill();
    } else {
      setIsScrolled(true);
      gsap.set(nav, {
        y: 0,
        width: "100%",
        maxWidth: "100%",
        backgroundColor: "rgb(255, 255, 255)",
        padding: "16px 40px",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        borderRadius: "0px",
        backdropFilter: "none",
      });
    }
  }, [isHome, pathname]);

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

  const textColorClass =
    isHome && !isScrolled && !isOpen ? "text-white" : "text-purple-900";

  if (disableNavbar) {
    return null;
  }

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full z-[60] flex items-center justify-between"
      >
        <div
          className={`text-xl font-bold z-[70] transition-colors duration-300 cursor-pointer ${textColorClass}`}
          onClick={() => router.push("/")}
        >
          LOGO
        </div>

        <div
          className={`hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${textColorClass}`}
        >
          <Link href="/" className="hover:opacity-70">
            Home
          </Link>
          <Link href="#" className="hover:opacity-70">
            Programs
          </Link>
          <Link href="#" className="hover:opacity-70">
            Membership
          </Link>
        </div>

        <div className="flex items-center gap-3 z-[70]">
          {user && (
            <Link
              href="/cart"
              className="relative p-2 flex items-center justify-center"
            >
              <ShoppingCart
                width={24}
                height={24}
                className={`transition-colors duration-300 ${textColorClass}`}
              />
              {mounted && items.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {items.length}
                </span>
              )}
            </Link>
          )}

          {mounted && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 border-purple-500 overflow-hidden flex items-center justify-center transition-colors ${isHome && !isScrolled ? "bg-white/20" : "bg-purple-50"}`}
                >
                  <User
                    width={24}
                    height={24}
                    className={
                      isHome && !isScrolled ? "text-white" : "text-purple-900"
                    }
                  />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="font-bold text-purple-900 text-xs truncate capitalize">
                      {user.username || "User"}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-xs font-bold text-gray-700 hover:bg-purple-50 uppercase"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-black text-red-500 hover:bg-red-50 uppercase cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2 bg-purple-600 text-white text-[10px] font-bold uppercase rounded-full cursor-pointer"
            >
              Login
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span
              className={`h-0.5 w-6 transition-all ${isOpen ? "rotate-45 translate-y-2 bg-purple-900" : isHome && !isScrolled ? "bg-white" : "bg-purple-900"}`}
            />
            <span
              className={`h-0.5 w-6 transition-all ${isOpen ? "opacity-0" : isHome && !isScrolled ? "bg-white" : "bg-purple-900"}`}
            />
            <span
              className={`h-0.5 w-6 transition-all ${isOpen ? "-rotate-45 -translate-y-2 bg-purple-900" : isHome && !isScrolled ? "bg-white" : "bg-purple-900"}`}
            />
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 bg-white z-[55] flex flex-col items-center justify-center gap-8 text-3xl font-bold text-purple-900">
          <Link href="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="#" onClick={() => setIsOpen(false)}>
            Programs
          </Link>
          {mounted && user && (
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
          )}
        </div>
      )}
    </>
  );
}
