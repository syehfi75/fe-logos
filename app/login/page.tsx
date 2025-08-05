"use client";
import { useAuthStore } from "@/store/auth";
import axios from "axios";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "login" | "signup" | "forgot_pass"
  >("login");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [emailPass, setEmailPass] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    role: "member",
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

  const handleLoginSubmit = async () => {
    setIsLoading(true);
    try {
      
      // console.log("Login sukses:", data);
      await login(loginForm.email, loginForm.password)

      // localStorage.setItem("token", data.token);

      setIsLoading(false);
      router.push("/dashboard");
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response?.data?.messages.error || "Unknown error");
    }
  };

  const handleRegisterSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_AUTH + "/api/register",
        signupForm
      );

      const data = res.data;
      setIsLoading(false);
      toast.success(
        "Please confirm your account by clicking the activation link in the email we have sent."
      );
    } catch (error: any) {
      setIsLoading(false);
      const errorData = error.response?.data;

      if (errorData && typeof errorData === "object") {
        const messages = Object.values(errorData.messages).join("\n");
        toast.error(messages);
      } else {
        toast.error(
          error.response?.data?.messages.error || "Unknown error occurred."
        );
      }
      // toast.error(error.response?.data?.messages.error || "Unknown error");
    }
  };

  const handleForgotPass = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_AUTH + "/api/forgot-password",
        {
          email: emailPass,
        }
      );

      // const data = res.data;
      // console.log("register:", data);
      setIsLoading(false);
      toast.success(
        "A security token has been emailed to you. Enter it in the box below to continue."
      );
    } catch (error: any) {
      console.error("Login gagal:", error);
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Unknown error");
    }
  };

  return (
    <div className="flex justify-center flex-col items-center mt-48 w-full px-4 md:px-0">
      {activeTab !== "forgot_pass" ? (
        <>
          <h1 className="mb-8">Logos Village</h1>
          <div className="flex justify-center flex-row-reverse items-center w-full max-w-md p-2">
            <button
              className={`w-full p-2 cursor-pointer border-b-2 transition-colors duration-300 ease-in-out ${
                activeTab === "login"
                  ? "border-logos-green text-logos-green"
                  : "border-gray-600/40 text-gray-500"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`w-full p-2 cursor-pointer border-b-2 transition-colors duration-300 ease-in-out ${
                activeTab === "signup"
                  ? "border-logos-green text-logos-green"
                  : "border-gray-600/40 text-gray-500"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Create account
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center relative">
            <button
              className="cursor-pointer absolute -left-[60px]"
              onClick={() => setActiveTab("login")}
            >
              <ArrowLeft />
            </button>
            <h1 className="font-bold text-3xl">Reset your password</h1>
          </div>
        </>
      )}
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
                  <Eye onClick={() => setPasswordVisible(false)} />
                ) : (
                  <EyeOff onClick={() => setPasswordVisible(true)} />
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
            <button
              className="ml-auto mt-2 text-sm text-gray-600 cursor-pointer"
              onClick={() => setActiveTab("forgot_pass")}
            >
              Forgot password?
            </button>
            <button
              onClick={handleLoginSubmit}
              disabled={isLoading}
              className={`rounded-full w-full p-4 text-white transition-colors mt-6 mb-4 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-logos-green hover:bg-[#014a3b] cursor-pointer"
              }`}
            >
              {isLoading ? "Logging in..." : "Login with Email"}
            </button>
          </>
        ) : activeTab === "forgot_pass" ? (
          <>
            <div className="flex flex-col items-start gap-4 w-full">
              <input
                type="email"
                name=""
                id=""
                placeholder="Email"
                className="w-full p-2 rounded-lg outline-0 border-2 border-gray-400/20 focus:border-logos-green transition-all duration-500"
                value={emailPass}
                onChange={(e) => setEmailPass(e.target.value)}
              />
              <span>We will send you a link to recover password</span>
              <button
                className="bg-logos-green w-full p-2 rounded-full cursor-pointer hover:hover:bg-[#014a3b] text-white transition-colors duration-500"
                onClick={handleForgotPass}
              >
                Send recovery link
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={signupForm.username}
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
                  <Eye onClick={() => setPasswordVisible(false)} />
                ) : (
                  <EyeOff onClick={() => setPasswordVisible(true)} />
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
            <div className="relative w-full">
              <span className="absolute top-2.5 right-2 cursor-pointer">
                {passwordVisible ? (
                  <Eye onClick={() => setPasswordVisible(false)} />
                ) : (
                  <EyeOff onClick={() => setPasswordVisible(true)} />
                )}
              </span>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password_confirm"
                placeholder="Confirm Password"
                value={signupForm.password_confirm}
                onChange={handleSignupChange}
                className="p-2 border-2 border-gray-600/40 rounded-lg w-full focus-visible:outline-none"
              />
            </div>
            <button
              onClick={handleRegisterSubmit}
              disabled={isLoading}
              className={`rounded-full w-full p-4 text-white transition-colors mt-6 mb-4 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-logos-green hover:bg-[#014a3b] cursor-pointer"
              }`}
            >
              {isLoading ? "Loading..." : "Sign up with Email"}
            </button>
          </>
        )}
        {activeTab !== "forgot_pass" && (
          <>
            <div className="flex items-center my-4 w-full max-w-md">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 uppercase text-sm">
                Or continue with
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
