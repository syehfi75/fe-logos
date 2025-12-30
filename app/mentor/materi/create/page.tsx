"use client";
import Dropzone from "@/components/MentorPage/dropzone/Dropzone";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMentorStore } from "@/store/mentor";
import { usePostUmumToken } from "@/utils/useFetchUmum";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateMateriPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File[]>([]);
  const [video, setVideo] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const handleForm = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [postMateri] = usePostUmumToken(
    "apiBase",
    `/api/mentor/courses/${selectedId}/lessons`
  );

  const { mentorKursus, ensureMentorKursus } = useMentorStore();
  useEffect(() => {
    ensureMentorKursus();
  }, []);

  useEffect(() => {
    if (selectedId) {
      setForm({ title: "", description: "" });
      setThumbnail([]);
      setVideo([]);
    }
  }, [selectedId]);

  const filteredItemsById = mentorKursus?.filter(
    (item) => item.id === selectedId
  );

  const handleSubmit = async () => {
    setLoading(true);
    let formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append(`thumbnail`, thumbnail[0]);
    formData.append(`video`, video[0]);
    try {
      const result = await postMateri(formData);
      console.log(result);
      
      if (result?.status) {
        await useMentorStore.getState().fetchMentorKursus();
        setLoading(false);
        toast.success(
          "Materi " +
            filteredItemsById?.[0]?.title +
            " berhasil dibuat!. Tunggu sekitar 2 menit"
        );
        router.push("/mentor/materi");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <label htmlFor="kursus" className="block mb-2 font-medium">
          Pilih Kursus
        </label>
        <select
          id="kursus"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Pilih Kursus --</option>
          {mentorKursus?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>
      {selectedId && (
        <>
          <div>
            <h1 className="text-2xl font-bold mb-4">
              Buat materi baru: {filteredItemsById?.[0]?.title}
            </h1>
          </div>
          <div className="flex flex-col">
            <div className="mb-4">
              <label htmlFor="title">Title *</label>
              <Input
                placeholder="Nama Kursus"
                id="title"
                name="title"
                required
                onChange={handleForm}
                value={form.title}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description">Deskripsi</label>
              <Textarea
                id="description"
                name="description"
                required
                onChange={handleForm}
                value={form.description}
              />
            </div>
            <div className="mb-4 flex gap-16">
              <div>
                <label>Thumbnail</label>
                <Dropzone
                  key={selectedId + "-thumb"}
                  multiple={false}
                  accept="image/*"
                  onChange={setThumbnail}
                />
              </div>
              <div>
                <label>Video</label>
                <Dropzone
                  key={selectedId + "-video"}
                  multiple={false}
                  accept="video/*"
                  onChange={setVideo}
                  disabled
                />
              </div>
            </div>
            <button
              className={`bg-blue-500 text-white px-4 py-2 rounded w-max ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 cursor-pointer"
              }`}
              disabled={loading}
              type="button"
              onClick={handleSubmit}
            >
              {loading ? "Menyimpan..." : "Simpan Materi Baru"}
            </button>
          </div>
        </>
      )}
    </>
  );
}
