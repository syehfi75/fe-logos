import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import axios from "@/lib/axios";
import { toast } from "sonner";

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthState {
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
        const { access_token, refresh_token } = res.data;

        Cookies.set("access_token", access_token, { expires: 1 });
        Cookies.set("refresh_token", refresh_token, { expires: 7 });

      const user = await axios.get(`${API_AUTH}/api/profile`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        console.log('user', user);
        

        set({
          accessToken: access_token,
          refreshToken: refresh_token,
          user: user.data,
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
