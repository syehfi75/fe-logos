import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import axios from "@/lib/axios";
import { toast } from "sonner";
// import axios from "axios";

// let intervalId: NodeJS.Timeout | null = null;

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthState {
  // startTokenWatcher: () => void;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const API_AUTH = process.env.NEXT_PUBLIC_API_AUTH;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      login: async (email, password) => {
        const res = await axios.post(`${API_AUTH}/api/login`, {
          email,
          password,
        });

        const { access_token, refresh_token, user } = res.data;

        Cookies.set("access_token", access_token, { expires: 1 });
        Cookies.set("refresh_token", refresh_token, { expires: 7 });

        set({
          accessToken: access_token,
          refreshToken: refresh_token,
          user,
        });
      },

      logout: () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },
      // startTokenWatcher: () => {
      //   if (intervalId) return;
      //   const refresh_token = Cookies.get("refresh_token");
      //   if (!refresh_token) return;

      //   intervalId = setInterval(async () => {
      //     const token = Cookies.get("access_token");

      //     if (!token) {
      //       const res = await axios.post(
      //         `${API_AUTH}/api/refresh-token`,
      //         null,
      //         { headers: { Authorization: `Bearer ${refresh_token}` } }
      //       );

      //       const { access_token } = res.data;
      //       console.log("res.data.access_token: ", access_token);

      //       Cookies.set("access_token", access_token);
      //     }
      //   }, 5000);
      // },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        // refreshToken: state.refreshToken,
      }),
    }
  )
);

// Bisa dipanggil dari luar (axios.ts)
export const logoutUser = async () => {
  try {
    const token = useAuthStore.getState().accessToken;
    await axios.post(`${API_AUTH}/api/logout`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    useAuthStore.getState().logout();
    toast.success("Logout berhasil!");
  } catch (error) {}
};
