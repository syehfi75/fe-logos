import { fetchUmum, postUmum, putUmum } from "@/lib/axios";
import { fetchUmumData } from "@/lib/fetchUmumHelper";
import { useAuthStore } from "@/store/auth";
import axios, { CancelTokenSource } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

export interface IResponsePost<T> {
  status: boolean;
  message: null | string;
  /** data atau error */
  data: T;
  postedData: any;
  responseCode: number;
}

type THasilFetch<T> = [T | null, boolean];
type THasilPost<T> = [
  (data: any) => Promise<IResponsePost<T> | null>,
  boolean,
  CancelTokenSource
];
type TJenisAPI = "apiBase";

const API_AUTH = process.env.NEXT_PUBLIC_API_AUTH;

const apiMap: Record<TJenisAPI, string> = {
  apiBase: process.env.NEXT_PUBLIC_API_AUTH!,
};

const cekAPI = (jenisApi: TJenisAPI) => {
  return apiMap[jenisApi] || API_AUTH;
};

export function useFetchUmum<T = any>(
  jenisApi: "apiBase",
  url: string,
  denganToken = true
): THasilFetch<T> {
  const [dataJSON, setDataJSON] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let aktif = true;
    const ambilData = async () => {
      setLoading(true);
      const hasil = await fetchUmumData<T>(jenisApi, url, denganToken);
      if (!aktif) return;
      if (hasil.success) {
        setDataJSON(hasil.data);
      } else {
        console.error("Error fetching data:", hasil.message);
      }
      setLoading(false);
    };
    ambilData();
    return () => {
      aktif = false;
    };
  }, [jenisApi, url, denganToken]);

  return [dataJSON, loading];
}

export function usePostUmum<T = any>(
  jenisApi: TJenisAPI,
  link: string | null,
  denganToken = true
): THasilPost<T> {
  const token = useAuthStore.getState().accessToken;
  const [loading, setLoading] = useState(true);

  const cancelTokenSebelumnya = useRef<CancelTokenSource | null>(null);
  const cancelToken = useRef(axios.CancelToken.source());

  const linkSebelumnya = useRef<string | null>(null);

  const post = useCallback(
    async (dataPost: any) => {
      const batalkan = {
        status: false,
        message: "link kosong",
        data: null,
        postedData: dataPost,
        responseCode: 499,
      } as IResponsePost<any>;
      const apiTerpilih = cekAPI(jenisApi) ?? "";
      const linkKosong = link === null || link === undefined;
      if (linkKosong) return batalkan;
      setLoading(true);
      cancelTokenSebelumnya.current?.cancel();
      cancelTokenSebelumnya.current = cancelToken.current;
      cancelToken.current = axios.CancelToken.source();
      const hasilFetch = await postUmum(
        apiTerpilih,
        dataPost,
        link,
        denganToken,
        token,
        cancelToken.current
      );
      linkSebelumnya.current = link;
      setLoading(false);
      return hasilFetch.data;
    },
    [jenisApi, link, token]
  );

  return [post, loading, cancelToken.current];
}

export function usePutUmum<T = any>(
  jenisApi: TJenisAPI,
  link: string | null,
  denganToken = true
): THasilPost<T> {
  const token = useAuthStore.getState().accessToken;
  const [loading, setLoading] = useState(true);

  const cancelTokenSebelumnya = useRef<CancelTokenSource | null>(null);
  const cancelToken = useRef(axios.CancelToken.source());

  const linkSebelumnya = useRef<string | null>(null);

  const post = useCallback(
    async (dataPost: any) => {
      const batalkan = {
        status: false,
        message: "link kosong",
        data: null,
        postedData: dataPost,
        responseCode: 499,
      } as IResponsePost<any>;
      const apiTerpilih = cekAPI(jenisApi) ?? "";
      const linkKosong = link === null || link === undefined;
      if (linkKosong) return batalkan;
      setLoading(true);
      cancelTokenSebelumnya.current?.cancel();
      cancelTokenSebelumnya.current = cancelToken.current;
      cancelToken.current = axios.CancelToken.source();
      const hasilFetch = await putUmum(
        apiTerpilih,
        dataPost,
        link,
        denganToken,
        token,
        cancelToken.current
      );
      linkSebelumnya.current = link;
      setLoading(false);
      return hasilFetch.data;
    },
    [jenisApi, link, token]
  );

  return [post, loading, cancelToken.current];
}
