"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetPass, setResetPass] = useState({
    selector: "472a1a77b4c27a99",
    validator:
      "cf94fbcb27ab12ff3b875884efd784d88054c02df707575b1c86a9c4e83b2739",
    password: "",
    confirm_password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetPass({ ...resetPass, [e.target.name]: e.target.value });
  };
  const handleForgotPass = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_AUTH + "/api/reset-password",
        resetPass
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
    <>
      <div className="flex flex-col justify-center items-center mt-48 w-full">
        <div className="flex flex-col gap-3 w-full max-w-md">
          <input
            type="text"
            name="password"
            id=""
            placeholder="New password"
            className="outline-0 border border-gray-500/20 p-2 rounded-lg focus:border-logos-green transition-colors duration-500"
            value={resetPass.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="confirm_password"
            id=""
            placeholder="Confirm new password"
            className="outline-0 border border-gray-500/20 p-2 rounded-lg focus:border-logos-green transition-colors duration-500"
            value={resetPass.confirm_password}
            onChange={handleChange}
          />
          <button
            className="bg-logos-green text-white p-2 rounded-full mt-4 cursor-pointer"
            onClick={handleForgotPass}
          >
            Reset password
          </button>
        </div>
      </div>
    </>
  );
}
