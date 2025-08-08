import axios from "axios";
import Cookies from "js-cookie";

const API_AUTH = process.env.NEXT_PUBLIC_API_AUTH;

const axiosInstance = axios.create({
  baseURL: API_AUTH,
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh_token = Cookies.get("refresh_token");
        if (!refresh_token) throw new Error("No refresh token found");

        const res = await axios.post(
          `${API_AUTH}/api/refresh-token`,
          null,
          {headers: {Authorization: `Bearer ${refresh_token}`}}
        );

        const { access_token } = res.data.access_token;
        Cookies.set("access_token", access_token, { expires: 1 });

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

export async function useFetch(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  options?: { auth?: boolean; headers?: Record<string, string> }
) {
  const config: any = {
    method,
    url,
    data,
    headers: { ...options?.headers },
  };

  if (options?.auth === false) {
    delete config.headers.Authorization;
  } else {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await axiosInstance(config);
  return res;
}