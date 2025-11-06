"use client";

import { useAuthMentorStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const login = useAuthMentorStore((state) => state.loginMentor);
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      setLoading(false);
      router.replace("/mentor/dashboard");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="flex justify-center flex-col items-center mt-48 w-full px-4 md:px-0">
        <h1 className="text-4xl font-bold mb-8">Mentor Login</h1>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={loginForm.email}
            onChange={handleLoginChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={loginForm.password}
            onChange={handleLoginChange}
          />
          <button
            type="submit"
            className={`rounded-full w-full p-4 text-white transition-colors mt-6 mb-4 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-logos-green hover:bg-[#014a3b] cursor-pointer"
              }`}
            onClick={submitLogin}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
