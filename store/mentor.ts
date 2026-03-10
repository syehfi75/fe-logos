import { deleteDataToken, fetchUmumDataToken } from "@/lib/fetchUmumHelper";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface MentorState {
  mentorKursus: any[] | null;
  loading: boolean;
  error: string | null;
  fetchMentorKursus: () => Promise<void>;
  ensureMentorKursus: (maxAgeMs?: number) => Promise<void>;
  deleteCourse: (id: string | number) => Promise<void>;
}

export const useMentorStore = create<MentorState>()(
  devtools((set, get) => ({
    mentorKursus: null,

    fetchMentorKursus: async () => {
      set({ loading: true, error: null });
      try {
        const res = await fetchUmumDataToken("apiBase", "/api/mentor/courses");
        if (res.success) {
          set({
            mentorKursus: res.data || null,
            loading: false,
          });
        } else {
          set({ error: res.message ?? "Gagal mengambil data", loading: false });
        }
      } catch (error) {
        set({ error: "Terjadi kesalahan jaringan", loading: false });
      }
    },
    ensureMentorKursus: async () => {
      const { mentorKursus, loading, fetchMentorKursus } = get();
      if (mentorKursus && mentorKursus.length > 0) {
        return;
      }
      if (loading) return;
      await fetchMentorKursus();
    },
    deleteCourse: async (id) => {
      const prev = get().mentorKursus;
      set({
        mentorKursus: prev?.filter((c: any) => String(c.id) !== String(id)),
      });
      try {
        const res = await deleteDataToken(
          "apiBase",
          `/api/mentor/courses/${id}`,
        );
        if (!res.success) {
          throw new Error(res.message || "Gagal menghapus data");
        }
      } catch (err) {
        set({ mentorKursus: prev });
        throw err;
      }
    },
  })),
);
