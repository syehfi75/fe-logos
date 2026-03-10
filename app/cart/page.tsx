"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const { items, removeItem } = useCartStore();

  const totalPrice = items.reduce(
    (acc: any, item: { price: any }) => acc + item.price,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-[1000px] mx-auto pt-40 px-6">
        <Link
          href="/"
          className="flex items-center text-purple-600 font-bold mb-8 transition-all"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Programs
        </Link>

        <h1 className="text-3xl font-black text-purple-900 mb-8 uppercase tracking-tighter italic">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LIST ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl text-center shadow-sm">
                <p className="text-gray-400 italic">Your cart is empty.</p>
              </div>
            ) : (
              items.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-gray-100"
                >
                  <div className="w-24 h-16 relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-purple-900 text-sm leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-purple-600 font-black">
                      Rp {item.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 p-2 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* SUMMARY */}
          <div className="bg-purple-900 text-white p-8 rounded-[40px] h-fit sticky top-32 shadow-2xl shadow-purple-200">
            <h2 className="text-xl font-bold mb-6 italic uppercase">Summary</h2>
            <div className="flex justify-between mb-4 text-purple-200">
              <span>Items ({items.length})</span>
              <span>Rp {totalPrice.toLocaleString()}</span>
            </div>
            <hr className="border-purple-800 mb-6" />
            <div className="flex justify-between mb-8">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-black">
                Rp {totalPrice.toLocaleString()}
              </span>
            </div>
            <button
              disabled={items.length === 0}
              className="w-full py-4 bg-white text-purple-900 font-black rounded-full uppercase tracking-widest hover:bg-purple-100 transition-colors disabled:bg-purple-800 disabled:text-purple-400"
            >
              Checkout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
