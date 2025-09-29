"use client";
import Dropzone from "@/components/MentorPage/dropzone/Dropzone";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMentorStore } from "@/store/mentor";
import { useFetchUmumToken, usePostUmumToken } from "@/utils/useFetchUmum";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditMateriPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const materi = searchParams.get("materi");
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
    let formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append(`thumbnail`, thumbnail[0]);
    formData.append(`video`, video[0]);
    try {
      const result = await postMateri(formData);
      if (result?.status) {
        setForm({ title: "", description: "" });
        setThumbnail([]);
        setVideo([]);
        toast.success("Materi " + listCourse?.title + " berhasil di edit!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
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
          className="bg-blue-500 text-white px-4 py-2 rounded w-max cursor-pointer"
          onClick={handleSubmit}
        >
          Edit materi {listCourse?.title}
        </button>
      </div>
    </>
  );
}
