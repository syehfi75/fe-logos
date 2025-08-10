"use client";
import { usePaymentStore } from "@/store/payment";
import { useEffect, useMemo } from "react";
import Navbar from "../Navbar/navbar";
import PaymentList from "./PaymentList";
import { useFetchUmum } from "@/utils/useFetchUmum";
import { formatPrice } from "@/utils/formatPrice";

export default function SubscribePage({ slug }: Props) {
  const { list, loading, fetchPlans } = usePaymentStore();
  const [listPayment, loadingPayment] = useFetchUmum(
    "apiBase",
    "/api/xendit/available-payment-method"
  );

  useEffect(() => {
    if (!list.length) fetchPlans();
  }, [list.length, fetchPlans]);

  const selectedPlan = useMemo(() => {
    return list.find((item: any) => item.type === slug[0]);
  }, [list, slug]);

  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const formatted = nextMonth.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-container">
        <div className="sticky w-full p-20 bg-gray-300/20">
          <h1 className="text-xl font-bold">Review order details</h1>
          {loading ? (
            <p>Loading</p>
          ) : (
            <>
              <div>
                {selectedPlan && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold">
                      {selectedPlan.name}
                    </h2>
                    <p>{selectedPlan.description}</p>
                    <div className="border-t border-b p-2 mt-4">
                      <p>Starting membership on {formatted}</p>
                    </div>
                    <div className="flex justify-between border-b p-2">
                      <p>Monthly</p>
                      <p>{formatPrice(selectedPlan.price)}</p>
                    </div>
                    <div className="flex justify-between p-2 font-extrabold text-2xl">
                      <p>Total</p>
                      <p>{formatPrice(selectedPlan.price)}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="w-full p-20 bg-white">
          <h1 className="mb-4 text-xl font-bold">Choose payment method</h1>
          {loadingPayment ? (
            <p>Loading payment methods...</p>
          ) : (
            <PaymentList methods={listPayment} selectedPlan={selectedPlan?.id} />
          )}
        </div>
      </div>
    </>
  );
}

interface Props {
  slug: string;
}
