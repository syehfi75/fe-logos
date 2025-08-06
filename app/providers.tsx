"use client";
import { checkAndRefreshToken } from "@/utils/checkToken";
import { ProgressProvider } from "@bprogress/next/app";
import { useEffect } from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    checkAndRefreshToken();
  }, []);
  return (
    <ProgressProvider
      height="4px"
      color="#FFF"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default Providers;