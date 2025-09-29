import { deleteUmumToken, fetchUmum, fetchUmumToken } from "@/lib/axios";
import { useAuthStore } from "@/store/auth";

type TJenisAPI = "apiBase";
const API_AUTH = process.env.NEXT_PUBLIC_API_AUTH!;
const apiMap: Record<TJenisAPI, string> = {
  apiBase: API_AUTH,
};

const cekAPI = (jenisApi: TJenisAPI) => apiMap[jenisApi] || API_AUTH;

export async function fetchUmumData<T = any>(
  jenisApi: TJenisAPI,
  url: string,
  denganToken = true
): Promise<{ success: boolean; data: T | null; message?: string }> {
  const token = useAuthStore.getState().accessToken;
  const baseURL = cekAPI(jenisApi);
  try {
    const hasil = await fetchUmum(baseURL, url, denganToken, token);
    if (hasil.success) {
      return { success: true, data: hasil.data.data as T };
    } else {
      return { success: false, data: null, message: hasil.message };
    }
  } catch (err: any) {
    return { success: false, data: null, message: err?.message ?? "Error" };
  }
}

export async function fetchUmumDataToken<T = any>(
  jenisApi: TJenisAPI,
  url: string,
  denganToken = true
): Promise<{ success: boolean; data: T | null; message?: string }> {
  const token = useAuthStore.getState().accessToken;
  const baseURL = cekAPI(jenisApi);
  try {
    const hasil = await fetchUmumToken(baseURL, url, denganToken, token);
    if (hasil.success) {
      return { success: true, data: hasil.data.data as T };
    } else {
      return { success: false, data: null, message: hasil.message };
    }
  } catch (err: any) {
    return { success: false, data: null, message: err?.message ?? "Error" };
  }
}

export async function deleteDataToken<T = any>(
  jenisApi: TJenisAPI,
  url: string,
  denganToken = true
): Promise<{ success: boolean; data: T | null; message?: string }> {
  const token = useAuthStore.getState().accessToken;
  const baseURL = cekAPI(jenisApi);
  try {
    const hasil = await deleteUmumToken(baseURL, url, denganToken, token);
    if (hasil.success) {
      return { success: true, data: hasil.data.data as T };
    } else {
      return { success: false, data: null, message: hasil.message ?? "Gagal menghapus" };
    }
  } catch (err: any) {
    return { success: false, data: null, message: err?.message ?? "Error" };
  }
}
