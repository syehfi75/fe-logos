import axios from "@/lib/axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth";

export const checkAndRefreshToken = async () => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");
  const logout = useAuthStore.getState().logout;

  if (accessToken) {
    return true;
  }

  if (!refreshToken) {
    logout();
    return false;
  }

  try {
    const res = await axios.post("/api/refresh-token", null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const newToken = res.data.access_token;

    Cookies.set("access_token", newToken, { expires: 1 });
    useAuthStore.setState({ accessToken: newToken });

    return true;
  } catch (err) {
    logout();
    return false;
  }
};
