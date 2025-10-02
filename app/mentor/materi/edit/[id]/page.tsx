"use client";
import Dropzone from "@/components/MentorPage/dropzone/Dropzone";
import Modal from "@/components/Modal/Modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMentorStore } from "@/store/mentor";
import { Lesson } from "@/types/mentorCourse";
import { useFetchUmumToken, usePostUmumToken } from "@/utils/useFetchUmum";
import { Play } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditMateriPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const materi = searchParams.get("materi");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File[]>([]);
  const [video, setVideo] = useState<File[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const handleForm = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [listCourse, loadingCourse] = useFetchUmumToken(
    "apiBase",
    `/api/mentor/courses/${id}/lessons/${materi}`
  );
  useEffect(() => {
    if (listCourse) {
      const lesson = listCourse;
      setForm({ title: lesson?.title, description: lesson?.description });
    }
  }, [listCourse]);

  const [postMateri] = usePostUmumToken(
    "apiBase",
    `/api/mentor/courses/${id}/lessons/${materi}`
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
      if (result?.status) {
        setLoading(false);
        setForm({ title: "", description: "" });
        setThumbnail([]);
        setVideo([]);
        toast.success("Materi " + listCourse?.title + " berhasil di edit!");
        router.push("/mentor/materi");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const [videoExist, setVideoExist] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const onOpenVideo = useCallback((l: Lesson) => {
    setVideoExist({ url: l?.video_url, title: l?.title });
  }, []);

  return (
    <>
      <Modal
        open={!!videoExist}
        onClose={() => setVideoExist(null)}
        title={videoExist?.title}
        size="xl"
      >
        {videoExist && (
          <iframe
            src={videoExist?.url}
            className="w-full h-96 rounded"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}
      </Modal>
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Edit materi : {listCourse?.title}
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
        <label className="block mb-2">Thumbnail dan video</label>
        {listCourse?.thumbnail && !thumbnail.length && (
          <div className="my-2">
            <div className="relative inline-block group">
              <Image
                src={listCourse.thumbnail}
                alt="Thumbnail"
                width={300}
                height={300}
                className="object-cover rounded block"
              />
              <div className="absolute inset-0 rounded bg-black/20 opacity-0 group-hover:opacity-100 transition" />
              <button
                type="button"
                onClick={() => onOpenVideo(listCourse)}
                aria-label="Play video"
                className="absolute inset-0 grid place-items-center cursor-pointer"
              >
                <span className="rounded-full bg-white/85 group-hover:bg-white p-4 shadow-lg transition">
                  <Play className="w-10 h-10 text-gray-900" />
                </span>
              </button>
            </div>
          </div>
        )}
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
            />
          </div>
        </div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded w-max ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600 cursor-pointer"
          }`}
          disabled={loading}
          type="button"
          onClick={handleSubmit}
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </>
  );
}
