"use client";
import { usePostUmum } from "@/utils/useFetchUmum";
import React, { useState } from "react";

type PaymentMethod = {
  code: string;
  name: string;
  type: string;
  status: string;
};

type Props = {
  methods: PaymentMethod[];
  typeOrder?: string[];
  selectedPlan?: any;
};

const typeLabel: Record<string, string> = {
  BANK_TRANSFER: "Bank Transfer",
  EWALLET: "E-Wallet",
  RETAIL_OUTLET: "Retail Outlet",
  CARD: "Kartu Kredit/Debit",
  QRIS: "QRIS",
};

const typeEmoji: Record<string, string> = {
  BANK_TRANSFER: "🏦",
  EWALLET: "💳",
  RETAIL_OUTLET: "🏪",
  CARD: "💳",
  QRIS: "📱",
};

function groupByType(items: PaymentMethod[]) {
  return items.reduce<Record<string, PaymentMethod[]>>((acc, item) => {
    const key = item.type?.toUpperCase() || "OTHER";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export default function PaymentList({ methods, typeOrder, selectedPlan }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [postPayment] = usePostUmum("apiBase", "/api/user/subscribe/manual-with-paymentmethod");

  const handleSubmit = async () => {
    if (!selectedCode || !selectedPlan) return;
    const body = {
      plan_id: selectedPlan,
      payment_method: selectedCode,
    };
    console.log('body', body);
    
    const result = await postPayment(body);
    if (result?.success) {
      console.log("Subscription successful:", result?.data);
    } else {
      console.error("Subscription failed:", result?.message);
    }
  };

  const grouped = groupByType(methods);

  const types = Object.keys(grouped).sort((a, b) => {
    const ai = typeOrder ? typeOrder.indexOf(a) : -1;
    const bi = typeOrder ? typeOrder.indexOf(b) : -1;
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="w-full space-y-3">
      {types.map((t, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={t}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            {/* Header */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{typeEmoji[t] ?? "🗂️"}</span>
                <h3 className="font-semibold">
                  {typeLabel[t] ?? t}{" "}
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    ({grouped[t].length})
                  </span>
                </h3>
              </div>
              <span
                className={`ml-auto transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {/* Content */}
            {isOpen && (
              <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[t].map((m) => {
                  const isDisabled = m.status !== "ACTIVE";
                  return (
                    <label
                      key={m.code}
                      className={`flex items-center gap-3 rounded-xl border border-gray-100 p-3 hover:border-gray-200 cursor-pointer ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.code}
                        disabled={isDisabled}
                        checked={selectedCode === m.code}
                        onChange={() => setSelectedCode(m.code)}
                        className="h-4 w-4"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{m.name}</span>
                        {/* <span className="text-xs text-gray-500">{m.code}</span> */}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Output pilihan */}
      <button
        className="bg-logos-green text-white p-3.5 rounded-full cursor-pointer w-full text-xl hover:shadow-md disabled:bg-gray-400 disabled:cursor-default transition-all"
        disabled={!selectedCode}
        onClick={() => {
          console.log("Selected payment method code:", selectedCode, selectedPlan);
          handleSubmit();
          
        }}
      >
        Subscribe
      </button>
      {/* <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
        <p className="text-sm">
          Metode terpilih: <strong>{selectedCode}</strong>
        </p>
      </div>   */}
    </div>
  );
}
