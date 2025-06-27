"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  // make state for tabs login and signup
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();

  const state = searchParams.get("state") || "login";
  useEffect(() => {
    if (state === "register") {
      setActiveTab("signup");
    }
  }, [state]);
  return (
    <>
      <div className="flex justify-center flex-col items-center min-h-screen w-full">
        <h1 className="mb-8">Logos Village</h1>
        <div className="flex justify-center items-center w-full max-w-md p-2">
          <button
            className={`w-full p-2 cursor-pointer border-b-2 ${
              activeTab === "login"
                ? "border-[#01533F] text-[#01533F]"
                : "border-gray-600/40"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`w-full p-2 cursor-pointer border-b-2 ${
              activeTab === "signup"
                ? "border-[#01533F] text-[#01533F]"
                : "border-gray-600/40"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Create account
          </button>
        </div>
        <div className="flex flex-col items-center justify-center w-full max-w-md p-6 gap-2">
          {activeTab === "login" ? (
            <>
              <input
                type="text"
                placeholder="Email"
                className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none "
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none "
              />
              <span className="ml-auto mt-2">Forgot password?</span>
              <button className="rounded-full bg-[#01533F] text-white w-full p-4 cursor-pointer hover:bg-[#014a3b] transition-colors mt-6 mb-4">
                Login with Email
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="First Name"
                className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none "
              />
              <input
                type="text"
                placeholder="Last Name"
                className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none "
              />
              <input
                type="text"
                placeholder="Email"
                className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none "
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none "
              />
              <button className="rounded-full bg-[#01533F] text-white w-full p-4 cursor-pointer hover:bg-[#014a3b] transition-colors mt-6 mb-4">
                Sign up with Email
              </button>
            </>
          )}
          <div>
            <span className="text-gray-500">or continue with</span>
          </div>
        </div>
      </div>
    </>
  );
}
