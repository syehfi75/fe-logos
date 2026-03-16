"use client";
import { useState } from "react";
import Image from "next/image";
import { Trash2, ChevronLeft, Check } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import PaymentList from "@/components/Subscribe/PaymentList";
import { useFetchUmum } from "@/utils/useFetchUmum";

export default function CartPage() {
  const { items, removeItem } = useCartStore();
  const [step, setStep] = useState(1);
  const [listPayment, loadingPayment] = useFetchUmum(
    "apiBase",
    "/api/xendit/available-payment-method",
  );

  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center mb-16 relative max-w-md mx-auto">
          <div className="absolute w-full h-[2px] bg-gray-200" />
          <div
            className="absolute h-[2px] bg-green-500 transition-all duration-500"
            style={{ width: step > 1 ? "100%" : "0%" }}
          />

          <div className="relative z-10 flex justify-between w-full">
            <StepCircle
              num={1}
              label="Cart"
              active={step >= 1}
              completed={step > 1}
            />
            <StepCircle
              num={2}
              label="Payment"
              active={step === 2}
              completed={false}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="p-2 bg-white rounded-full shadow-sm"
                >
                  <ChevronLeft />
                </button>
              )}
              <h1 className="text-3xl font-black text-purple-900 italic uppercase">
                {step === 1 ? "Your Cart" : "Select Payment"}
              </h1>
            </div>

            {step === 1 ? (
              <div className="space-y-4">
                {items.length === 0 ? (
                  <div className="bg-white p-20 rounded-[40px] text-center italic text-gray-400">
                    Cart is empty.
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-5 rounded-[30px] flex items-center gap-4 shadow-sm border border-gray-50"
                    >
                      <div className="w-20 h-20 bg-purple-100 rounded-2xl overflow-hidden relative">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-purple-900">
                          {item.title}
                        </h3>
                        <p className="font-black text-purple-600 italic">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 p-2
                         cursor-pointer rounded-full hover:bg-red-100 transition-colors"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <PaymentList
                methods={listPayment || []}
                selectedPlan={items.map((i) => Number(i.id))}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-purple-900 text-white p-8 rounded-[40px] sticky top-32 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 italic uppercase tracking-widest">
                Summary
              </h2>
              <div className="flex justify-between mb-4 text-purple-300">
                <span>Items ({items.length})</span>
                <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
              <hr className="border-purple-800 mb-6" />
              <div className="flex justify-between mb-8 text-2xl font-black italic">
                <span>Total</span>
                <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>

              {step === 1 && (
                <button
                  disabled={items.length === 0}
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-white text-purple-900 font-black rounded-full uppercase tracking-widest hover:bg-purple-100 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Checkout Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCircle({ num, label, active, completed }: any) {
  return (
    <div className="flex flex-col items-center relative">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
          completed
            ? "bg-green-500 border-green-500 text-white"
            : active
              ? "bg-purple-900 border-purple-900 text-white shadow-lg shadow-purple-200"
              : "bg-white border-gray-200 text-gray-400"
        }`}
      >
        {completed ? (
          <Check className="w-5 h-5" />
        ) : (
          <span className="font-black">{num}</span>
        )}
      </div>
      <span
        className={`absolute -bottom-7 text-[10px] font-black uppercase tracking-tighter ${active ? "text-purple-900" : "text-gray-400"}`}
      >
        {label}
      </span>
    </div>
  );
}
