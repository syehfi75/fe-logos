import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns true if current window width is at or below the given breakpoint.
 * Defaults to 640px (Tailwind's `sm`), which is a typical mobile threshold.
 * Safe for SSR: returns the provided default on the server and updates on mount.
 */
export function isMobileWidth(breakpoint = 640, defaultOnSSR = false): boolean {
  if (typeof window === "undefined") return defaultOnSSR;
  return window.innerWidth <= breakpoint;
}

/**
 * React hook that returns a boolean indicating if current width is mobile.
 * Listens to resize and updates responsively. Defaults to 640px.
 */
export function useIsMobileWidth(breakpoint = 640, defaultOnSSR = false) {
  const [isMobile, setIsMobile] = ((): [boolean, (v: boolean) => void] => {
    // Avoid importing React types into this shared util file; use lazy pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ReactAny: any = require("react");
    const useState = ReactAny.useState;
    return useState(defaultOnSSR);
  })();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ReactAny: any = typeof window !== "undefined" ? require("react") : null;
  const useEffect = ReactAny?.useEffect;

  useEffect?.(() => {
    const evaluate = () => setIsMobile(window.innerWidth <= breakpoint);
    evaluate();
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, [breakpoint]);

  return isMobile;
}
