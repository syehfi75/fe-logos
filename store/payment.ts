// store/payment.ts
import { create } from "zustand";
import { fetchUmumData } from "@/lib/fetchUmumHelper";

type PaymentPlan = {
  id: string;
  code: string;
  name: string;
  type: string;
  status: string;
  description: string;
  price: string;
};

type PaymentState = {
  list: PaymentPlan[];
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  setPlans: (plans: PaymentPlan[]) => void;
  clear: () => void;
};

export const usePaymentStore = create<PaymentState>((set) => ({
  list: [],
  loading: false,
  error: null,

  setPlans: (plans) => set({ list: plans }),
  clear: () => set({ list: [] }),

  fetchPlans: async () => {
    set({ loading: true, error: null });
    const hasil = await fetchUmumData<PaymentPlan[]>("apiBase", "/api/subscribe/plan");
    
    if (hasil.success) {
      set({ list: hasil?.data || [], loading: false });
    } else {
      set({ error: hasil.message ?? "Gagal mengambil data", loading: false });
    }
  },
}));
