import { fetchUmumData } from "@/lib/fetchUmumHelper";
import { create } from "zustand";

interface HomeState {
  homeData: any | null;
  loading: boolean;
  error: string | null;
  setHomeData: (data: any) => void;
  fetchHomeData: () => Promise<void>;
}

const useHomeStore = create<HomeState>((set) => ({
  homeData: null,
  loading: false,
  error: null,

  setHomeData: (data) =>
    set({
      homeData: data,
      loading: false,
    }),

  fetchHomeData: async () => {
    set({ loading: true });
    try {
      const response = await fetchUmumData("apiBase", "/api/content/homepage");
      if (!response.success) throw new Error("Gagal mengambil data");
      const data = response.data;
      set({ homeData: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useHomeStore;
