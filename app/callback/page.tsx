"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth";
import { X } from "lucide-react";
// import { usePostUmumToken } from "@/utils/useFetchUmum";

export default function CallbackPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const CALLBACK_URL = process.env.NEXT_PUBLIC_SSO_LOGIN;
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState("Menghubungkan ke SSO...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  // const [postLogin] = usePostUmumToken("apiBase", "/mlm/sso/login");

  useEffect(() => {
    const ssoToken = Cookies.get("sso_token");

    if (!ssoToken) {
      router.push("/");
      return;
    }

    async function fetchToken() {
      try {
        setLoadingStatus("Memverifikasi akun Anda...");

        const res = await fetch(`${API_BASE}/mlm/sso/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: ssoToken }),
        });

        // const res = await postLogin({ token: ssoToken });

        const userProfile = await res.json();

        if (!userProfile.status) {
          setErrorMessage(userProfile.message || "Verifikasi gagal.");
          return;
        }

        Cookies.set("access_token", userProfile.access_token, { path: "/" });
        Cookies.set("refresh_token", userProfile.refresh_token, { path: "/" });
        useAuthStore.setState({
          accessToken: userProfile.access_token,
          user: userProfile.user,
        });
        Cookies.remove("sso_token");

        setLoadingStatus(
          "Login berhasil! Mengalihkan dalam 5 detik. Jika tidak, klik tombol di bawah.",
        );

        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
            }
            return prev - 1;
          });
        }, 1000);

        setTimeout(() => {
          clearInterval(interval);
          router.replace("/dashboard");
        }, 5000);
      } catch (error) {
        console.error("Gagal memproses callback:", error);
        setErrorMessage("Terjadi kesalahan jaringan atau server.");
      }
    }

    fetchToken();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-sm w-full text-center border border-slate-100">
        <h1 className="text-xl font-bold text-slate-800 mb-6">
          {errorMessage ? "Signing In Failed" : "Signing In..."}
        </h1>

        {errorMessage ? (
          <div>
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              <X className="w-6 h-6" />
            </div>
            <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
            <button
              onClick={() =>
                router.push(`${CALLBACK_URL}`)
              }
              className="mt-5 w-full bg-slate-900 text-white py-2 rounded-lg text-md font-semibold cursor-pointer hover:bg-slate-800 transition"
            >
              Kembali ke Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {loadingStatus.includes("Mengalihkan") ? (
              <>
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold mb-4 animate-pulse">
                  {countdown}
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">
                  {loadingStatus}
                </p>

                <button
                  onClick={() => router.replace("/dashboard")}
                  className="text-xs text-blue-500 hover:text-blue-700 font-semibold underline transition mt-1"
                >
                  klik di sini
                </button>
              </>
            ) : (
              <>
                <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-slate-500 font-medium">
                  {loadingStatus}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
