"use client";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const searchParams = useSearchParams();
  const state = searchParams.get("state") || "login";

  useEffect(() => {
    if (state === "register") {
      setActiveTab("signup");
    }
  }, [state]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  return (
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
              name="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={handleLoginChange}
              className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none"
            />
            <div className="relative w-full">
              <span className="absolute top-2.5 right-2 cursor-pointer">
                {passwordVisible ? (
                  <EyeOff onClick={() => setPasswordVisible(false)} />
                ) : (
                  <Eye onClick={() => setPasswordVisible(true)} />
                )}
              </span>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
                className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none"
              />
            </div>
            <span className="ml-auto mt-2 text-sm text-gray-600 cursor-pointer">
              Forgot password?
            </span>
            <button className="rounded-full bg-[#01533F] text-white w-full p-4 cursor-pointer hover:bg-[#014a3b] transition-colors mt-6 mb-4">
              Login with Email
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={signupForm.firstName}
              onChange={handleSignupChange}
              className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={signupForm.lastName}
              onChange={handleSignupChange}
              className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none"
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={signupForm.email}
              onChange={handleSignupChange}
              className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none"
            />
            <div className="relative w-full">
              <span className="absolute top-2.5 right-2 cursor-pointer">
                {passwordVisible ? (
                  <EyeOff onClick={() => setPasswordVisible(false)} />
                ) : (
                  <Eye onClick={() => setPasswordVisible(true)} />
                )}
              </span>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={signupForm.password}
                onChange={handleSignupChange}
                className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none"
              />
            </div>
            <button className="rounded-full bg-[#01533F] text-white w-full p-4 cursor-pointer hover:bg-[#014a3b] transition-colors mt-6 mb-4">
              Sign up with Email
            </button>
          </>
        )}
        <div className="flex items-center my-4 w-full max-w-md">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 uppercase text-sm">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
