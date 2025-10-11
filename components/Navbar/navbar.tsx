"use client";

import { logoutUser, useAuthStore } from "@/store/auth";
import { CircleUserRound, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import { useRouter } from "next/navigation";
import { usePaymentStore } from "@/store/payment";
import { formatPrice } from "@/utils/formatPrice";

const NAV_ITEMS = [
  { href: "/membership", label: "Membership" },
  { href: "/categories", label: "Categories" },
  { href: "/community", label: "Community" },
  { href: "/results", label: "Results" },
  { href: "/work", label: "At Work" },
  { href: "/support", label: "Support" },
];

function Navbar() {
  const userStore = useAuthStore((s) => s);
  const router = useRouter();

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const { list, fetchPlans } = usePaymentStore();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Close menus when clicking outside
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(t)) {
        setOpenUserMenu(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(t)) {
        // only close if click benar2 di luar navbar
        // (biar klik di dalam panel tidak menutup)
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenUserMenu(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {NAV_ITEMS.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className="px-3 py-2 rounded-lg text-sm md:text-base hover:bg-white/10"
          onClick={onClick}
        >
          {it.label}
        </Link>
      ))}
    </>
  );

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full bg-logos-green text-white font-grostek/500 backdrop-blur supports-[backdrop-filter]:bg-logos-green/95 shadow"
        aria-label="Main"
      >
        <div
          ref={mobileRef}
          className="mx-auto max-w-6xl px-4 lg:px-6 h-16 flex items-center justify-between"
        >
          {/* Left: Brand + Desktop nav */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xl font-bold tracking-wide hover:opacity-90"
              aria-label="Go to homepage"
            >
              Logo
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              <NavLinks />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Upgrade button (desktop) */}
            {userStore.user && (
              <button
                className="hidden sm:inline-flex bg-emerald-700 px-3 py-2 rounded-full shadow-md hover:shadow-lg transition"
                onClick={() => setOpenModal(true)}
              >
                Upgrade
              </button>
            )}

            {/* Auth area */}
            {userStore.user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setOpenUserMenu((s) => !s)}
                  className="p-1 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-haspopup="menu"
                  aria-expanded={openUserMenu}
                  aria-label="Open user menu"
                >
                  <CircleUserRound size={28} />
                </button>

                {/* User dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden transform transition-all duration-150 origin-top ${
                    openUserMenu
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                  role="menu"
                >
                  <div className="px-4 py-3 text-sm text-gray-600 border-b">
                    {userStore.user.username}
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setOpenUserMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logoutUser();
                      setOpenUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login" className="text-sm md:text-base">
                  Login
                </Link>
                <Link
                  href="/login?state=register"
                  className="text-sm md:text-base border border-white px-4 py-2 rounded-full hover:bg-white/10"
                >
                  Create an account
                </Link>
              </div>
            )}

            {/* Mobile: Upgrade (icon row) */}
            {userStore.user && (
              <button
                className="inline-flex sm:hidden bg-emerald-700 px-3 py-2 rounded-full"
                onClick={() => setOpenModal(true)}
                aria-label="Upgrade"
              >
                Upgrade
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              onClick={() => setMobileOpen((s) => !s)}
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
            mobileOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!mobileOpen}
        >
          <div className="mx-auto max-w-6xl px-4 pb-4 flex flex-col gap-1">
            <NavLinks onClick={() => setMobileOpen(false)} />

            {!userStore.user ? (
              <div className="mt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/login?state=register"
                  className="w-full text-left px-3 py-2 rounded-lg border border-white hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  Create an account
                </Link>
              </div>
            ) : (
              <div className="mt-3 border-t border-white/20 pt-3">
                <div className="text-white/80 text-sm mb-2">
                  {userStore.user.username}
                </div>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-600/20 text-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modal Upgrade */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Upgrade Membership"
        size="xl"
      >
        <div>
          {list
            ?.filter((item: any) => item.id !== "1" && item.id !== "4")
            .map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  router.push(`/subscribe/${item.type}`);
                  setOpenModal(false);
                }}
              >
                <div className="flex items-center space-x-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <span className="text-lg font-bold">
                  {formatPrice(item.price)}
                </span>
              </div>
            ))}
          <div className="p-4 text-center">
            <p className="text-sm text-gray-600">
              Choose a plan that suits you best.
            </p>
          </div>
        </div>
        <div className="flex justify-end p-4">
          <button
            onClick={() => setOpenModal(false)}
            className="bg-logos-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Navbar;
