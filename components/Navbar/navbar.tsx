"use client";

import { logoutUser, useAuthStore } from "@/store/auth";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import { useRouter } from "next/navigation";
import { usePaymentStore } from "@/store/payment";

function Navbar() {
  const user = useAuthStore((state) => state);
  const router = useRouter();
  // const userLogout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { list, fetchPlans } = usePaymentStore();
  

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

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
            <Link href="/" className="text-lg">
              Logo
            </Link>
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
              <div className="flex items-center">
                <button
                  className="bg-emerald-700 cursor-pointer ml-auto p-2 rounded-full mr-8 w-35 shadow-md hover:shadow-xl transition-all"
                  onClick={() => setOpenModal(!openModal)}
                >
                  Upgrade
                </button>
                <button
                  onClick={() => setOpen(!open)}
                  className="hover:text-logos-green transition"
                >
                  <CircleUserRound size={28} />
                </button>
              </div>

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
                  <Link
                    href="/dashboard"
                    className="text-sm hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors text-black"
                  >
                    Dashboard
                  </Link>
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
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="Upgrade Membership"
          size="xl"
        >
          <div>
            {list?.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  router.push(`/subscribe/${item.type}`);
                  setOpenModal(false);
                }}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <span className="text-lg font-bold">{item.price}</span>
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
      </nav>
    </>
  );
}

export default Navbar;
