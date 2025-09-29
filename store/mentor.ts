import { deleteDataToken, fetchUmumDataToken } from "@/lib/fetchUmumHelper";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface MentorState {
  mentorKursus: any[] | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchMentorKursus: () => Promise<void>;
  ensureMentorKursus: (maxAgeMs?: number) => Promise<void>;
  deleteCourse: (id: string | number) => Promise<void>;
}

export const useMentorStore = create<MentorState>()(
  devtools((set, get) => ({
    mentorKursus: null,
    loading: false,
    error: null,
    lastFetched: null,

    fetchMentorKursus: async () => {
      set({ loading: true, error: null });
      try {
        const res = await fetchUmumDataToken("apiBase", "/api/mentor/courses");
        if (res.success) {
          set({
            mentorKursus: res.data || null,
            lastFetched: Date.now(),
            loading: false,
          });
        } else {
          set({ error: res.message ?? "Gagal mengambil data", loading: false });
        }
      } catch (error) {
        set({ error: "Terjadi kesalahan jaringan", loading: false });
      }
    },
    ensureMentorKursus: async (maxAgeMs = 5 * 60 * 1000) => {
      const { mentorKursus, fetchMentorKursus } = get();
      // const fresh = lastFetched && Date.now() - lastFetched < maxAgeMs;
      // console.log("mentorKursus", mentorKursus, lastFetched);

      if (mentorKursus) return;
      await fetchMentorKursus();
    },
    deleteCourse: async (id) => {
      const prev = get().mentorKursus;
      set({ mentorKursus: prev?.filter((c: any) => String(c.id) !== String(id)) });
      try {
        const res = await deleteDataToken("apiBase", `/api/mentor/courses/${id}`);
        if (!res.success) {
          throw new Error(res.message || "Gagal menghapus data");
        }
      } catch (err) {
        set({ mentorKursus: prev });
        throw err;
      }
    },
  }))
);
