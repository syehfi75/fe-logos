"use client";
import Dropzone from "@/components/MentorPage/dropzone/Dropzone";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMentorStore } from "@/store/mentor";
import { usePostUmumToken } from "@/utils/useFetchUmum";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateKursusPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [selectedOption, setSelectedOption] = useState("1");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [postCourse] = usePostUmumToken("apiBase", "/api/mentor/courses");
  const handleForm = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const options = [
    { label: "Free", value: "1" },
    { label: "Membership", value: "2" },
    { label: "Premium", value: "3" },
  ];

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    let formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("access_type", selectedOption);
    formData.append(`thumbnail`, files[0]);
    try {
      const result = await postCourse(formData);
      if (result?.status) {
        await useMentorStore.getState().fetchMentorKursus();
        setLoading(false);
        toast.success("Kursus " + form.title + " berhasil dibuat!.");
        router.push("/mentor/kursus");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">Buat kursus baru</h1>
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
              multiple={false}
              onChange={setFiles}
              // key={"thumb"}
            />
          </div>
          <div>
            <label>Tipe kursus</label>
            {options.map((option) => (
              <div key={option.value}>
                <label className="flex items-center space-x-2 gap-1">
                  <input
                    type="radio"
                    name="myRadioGroup"
                    value={option.value}
                    checked={selectedOption === option.value}
                    onChange={handleOptionChange}
                  />
                  {option.label}
                </label>
              </div>
            ))}
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
          {loading ? "Membuat..." : "Buat Kursus"}
        </button>
      </div>
    </>
  );
}
