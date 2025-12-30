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

        const res = await axios.post(`${API_AUTH}/api/refresh-token`, null, {
          headers: { Authorization: `Bearer ${refresh_token}` },
        });

        const { access_token } = res.data;        
        Cookies.set("access_token", access_token, { expires: 1 });

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        // if (typeof window !== "undefined") {
        //   window.location.href = "/login";
        // }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

export const fetchUmum = async (
  apiTerpilih: string,
  url: string,
  denganToken = true,
  token: any
) => {
  try {
    const response = await axios.get(`${apiTerpilih}${url}`, {
      headers:
        denganToken && token
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          : {},
    });
    return {
      success: true,
      // message: response?.data?.data?.message || "Error tidak diketahui",
      data: response.data,
      responseCode: response.status,
    };
  } catch (e: any) {
    return {
      success: false,
      message: JSON.stringify(
        e?.response?.data?.message || "Error tidak diketahui"
      ),
      data: e?.response?.data || null,
      responseCode: e?.response?.status || 400,
    };
  }
};

export const fetchUmumToken = async (
  apiTerpilih: string,
  url: string,
  denganToken = true,
  token: any
) => {
  try {
    const response = await axiosInstance.get(`${apiTerpilih}${url}`, {
      headers:
        denganToken && token
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          : {},
    });
    return {
      success: true,
      // message: response?.data?.data?.message || "Error tidak diketahui",
      data: response.data,
      responseCode: response.status,
    };
  } catch (e: any) {
    return {
      success: false,
      message: JSON.stringify(
        e?.response?.data?.message || "Error tidak diketahui"
      ),
      data: e?.response?.data || null,
      responseCode: e?.response?.status || 400,
    };
  }
};

export const postUmum = async (
  apiTerpilih: string,
  postedData: any,
  link: string | null,
  denganToken = true,
  token: any,
  reqCancelToken: any
) => {
  try {
    const response = await axios.post(`${apiTerpilih}${link}`, postedData, {
      headers:
        denganToken && token
          ? {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
          : {},
      cancelToken: reqCancelToken.token,
    });
    return {
      success: true,
      message: null,
      data: response.data,
      postedData: postedData,
      responseCode: response.status,
    };
  } catch (e: any) {
    return {
      success: false,
      message: JSON.stringify(e),
      data: e?.response?.data || null,
      postedData: postedData,
      responseCode: e?.response?.status || 400,
    };
  }
};

export const postUmumToken = async (
  apiTerpilih: string,
  postedData: any,
  link: string | null,
  denganToken = true,
  token: any,
  reqCancelToken: any,
  onProgress?: (percent: number) => void 
) => {
  try {
    const response = await axiosInstance.post(`${apiTerpilih}${link}`, postedData, {
      headers:
        denganToken && token
          ? {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "application/json",
          }
          : {},
      cancelToken: reqCancelToken.token,
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      },
    });
    return {
      success: true,
      message: null,
      data: response.data,
      postedData: postedData,
      responseCode: response.status,
    };
  } catch (e: any) {
    return {
      success: false,
      message: JSON.stringify(e),
      data: e?.response?.data || null,
      postedData: postedData,
      responseCode: e?.response?.status || 400,
    };
  }
};

export const putUmum = async (
  apiTerpilih: string,
  postedData: any,
  link: string | null,
  denganToken = true,
  token: any,
  reqCancelToken: any
) => {
  try {
    const response = await axios.put(`${apiTerpilih}${link}`, postedData, {
      headers:
        denganToken && token
          ? {
            Authorization: token,
            "Content-Type": "application/json",
          }
          : {},
      cancelToken: reqCancelToken.token,
    });
    return {
      success: true,
      message: null,
      data: response.data,
      postedData: postedData,
      responseCode: response.status,
    };
  } catch (e: any) {
    return {
      success: false,
      message: JSON.stringify(e),
      data: e?.response?.data || null,
      postedData: postedData,
      responseCode: e?.response?.status || 400,
    };
  }
};

export const deleteUmumToken = async (
  apiTerpilih: string,
  link: string | null,
  denganToken = true,
  token: any
) => {
  try {
    const response = await axiosInstance.delete(`${apiTerpilih}${link}`, {
      headers:
        denganToken && token
          ? {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "application/json",
          }
          : {},
    });
    return {
      success: true,
      message: null,
      data: response.data,
      responseCode: response.status,
    };
  } catch (e: any) {
    return {
      success: false,
      message: JSON.stringify(e),
      data: e?.response?.data || null,
      responseCode: e?.response?.status || 400,
    };
  }
};


// type TJenisAPI = "apiBase";

// const apiMap: Record<TJenisAPI, string> = {
//   apiBase: process.env.NEXT_PUBLIC_API_AUTH!,
// };

// const cekAPI = (jenisApi: TJenisAPI) => {
//   return apiMap[jenisApi] || API_AUTH;
// };

// export async function useFetch(
//   method: "get" | "post" | "put" | "delete",
//   jenisApi: TJenisAPI,
//   url: string,
//   data?: any,
//   options?: { auth?: boolean; headers?: Record<string, string> }
// ) {
//   const axiosFetch = axios.create();
//   const config: any = {
//     baseURL: cekAPI(jenisApi),
//     method,
//     url,
//     data,
//     headers: { ...options?.headers },
//   };

//   if (options?.auth === false) {
//     delete config.headers.Authorization;
//   } else {
//     const token = Cookies.get("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }

//   const res = await axiosFetch(config);
//   return res;
// }
