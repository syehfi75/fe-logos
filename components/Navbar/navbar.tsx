"use client";

import { logoutUser, useAuthStore } from "@/store/auth";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Navbar() {
  const user = useAuthStore((state) => state);
  // const userLogout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  

  return (
    <>
      <nav className="relative z-10 flex items-center justify-between p-4 bg-logos-green text-white font-grostek">
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-lg">
              Logo
            </a>
            <a href="#" className="text-lg">
              Membership
            </a>
            <a href="#" className="text-lg">
              Categories
            </a>
            <a href="#" className="text-lg">
              Community
            </a>
            <a href="#" className="text-lg">
              Results
            </a>
            <a href="#" className="text-lg">
              At Work
            </a>
            <a href="#" className="text-lg">
              Support
            </a>
          </div>
          {user.user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="hover:text-logos-green transition"
              >
                <CircleUserRound size={28} />
              </button>

              <div
                className={`absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg z-50 overflow-hidden transform transition-all duration-200 origin-top ${
                  open
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="flex flex-col py-2 px-4">
                  <span className="text-sm text-gray-600 mb-2">
                    {user.user.username}
                  </span>
                  <button
                    onClick={() => {
                      logoutUser();
                      setOpen(false);
                      // router.push("/");
                    }}
                    className="text-left text-red-600 hover:bg-red-600/15 text-sm cursor-pointer rounded-lg transition-colors duration-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href={"/login"} className="text-lg">
                Login
              </Link>
              <Link
                href="/login?state=register"
                className="text-lg border border-white px-4 py-2 rounded-full hover:bg-gray/30 hover:text-white transition-colors"
              >
                Create an account
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
