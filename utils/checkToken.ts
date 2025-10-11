import axios from "@/lib/axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth";

function isJwtExpired(token?: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false; // Not a JWT; treat as opaque, not expired
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    const payload = JSON.parse(jsonPayload);
    const exp = typeof payload.exp === "number" ? payload.exp : null;
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch {
    return false;
  }
}

export const checkAndRefreshToken = async () => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");
  const logout = useAuthStore.getState().logout;

  // If access token exists and not expired, OK
  if (accessToken && !isJwtExpired(accessToken)) {
    return true;
  }

  // If we have refresh token, try to refresh
  if (refreshToken) {
    try {
      const res = await axios.post("/api/refresh-token", null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const {access_token, expires_in} = res.data;

      Cookies.set("access_token", access_token, { expires: expires_in });
      useAuthStore.setState({ accessToken: access_token });
      return true;
    } catch (err) {
      // fallthrough to logout
    }
  }

  // No valid tokens -> logout
  logout();
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  return false;
};
