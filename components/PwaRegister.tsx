"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const handleLoad = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (
                    installingWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                  }
                };
              }
            };
          })
          .catch((err) => console.error("✗ PWA Gagal Daftar:", err));
      };

      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return null;
}
