"use client";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ActivateAccount() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activationStatus, setActivationStatus] = useState<
    "pending" | "success" | "error" | "resent"
  >("pending");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      inputRef.current?.blur();
    }
  }, []);

  const handleResendActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setActivationStatus("resent");
    }, 2000);
  };

  const handleActivateAccount = () => {
    setIsLoading(true);

    // Simulate activation process
    setTimeout(() => {
      setIsLoading(false);
      // Randomly simulate success or error for demo
      const success = Math.random() > 0.3;
      if (success) {
        setActivationStatus("success");
      } else {
        setActivationStatus("error");
        setErrorMessage(
          "Invalid or expired activation link. Please request a new one."
        );
      }
    }, 2000);
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        {activationStatus === "pending" && (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">Activate Your Account</h1>
            <p className="mt-4 text-center text-gray-500">
              Click the button below to activate your account, or request a new
              activation email.
            </p>
            <button
              className="mt-4 bg-black text-white w-full rounded-lg p-2 disabled:bg-transparent disabled:border disabled:border-gray-600/40 disabled:text-black not-disabled:cursor-pointer transition-all duration-500"
              onClick={handleActivateAccount}
              disabled={isLoading}
            >
              {isLoading ? "Activating..." : "Activate Account"}
            </button>
            <div className="flex items-center my-4 w-full max-w-md">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 uppercase">Or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div>
              <input
                className="w-full border border-gray-500 p-2 rounded-lg outline-none"
                type="email"
                name=""
                id=""
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={inputRef}
              />
              <button
                disabled={isLoading || !email}
                className="mt-4 bg-black text-white w-full rounded-lg p-2 transition-all duration-500 disabled:bg-transparent disabled:border disabled:border-gray-600/40 disabled:text-black not-disabled:cursor-pointer"
                onClick={handleResendActivation}
              >
                Resend Activation Email
              </button>
            </div>
          </>
        )}
        {activationStatus === "success" && (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-green-600">Success!</h1>
            <p className="mt-4 text-gray-500">
              Your account has been successfully activated. You can now log in.
            </p>
            <Link
              href={"/login"}
              className="w-full bg-black rounded-lg p-2 text-white mt-4"
            >
              Back to login
            </Link>
          </div>
        )}
        {activationStatus === "error" && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error</h1>
            <p className="mt-4 text-gray-500">{errorMessage}</p>
            <button
              className="mt-4 bg-black text-white w-full rounded-lg p-2 transition-all duration-500"
              onClick={handleResendActivation}
            >
              Resend Activation Email
            </button>
          </div>
        )}
        {activationStatus === "resent" && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600">Email Resent</h1>
            <p className="mt-4 text-gray-500">
              A new activation email has been sent to {email}. Please check your
              inbox.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
