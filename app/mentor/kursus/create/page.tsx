"use client";
import Dropzone from "@/components/MentorPage/dropzone/Dropzone";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostUmumToken } from "@/utils/useFetchUmum";
import { useState } from "react";

export default function CreateKursusPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedOption, setSelectedOption] = useState("1");
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
    // Handle form submission logic here
    let formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("access_type", selectedOption);
    formData.append(`thumbnail`, files[0]);
    try {
      const result = await postCourse(formData);
      console.log("result", result);
    } catch (error) {
      console.error(error);
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
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description">Deskripsi</label>
          <Textarea
            id="description"
            name="description"
            required
            onChange={handleForm}
          />
        </div>
        <div className="mb-4 flex gap-16">
          <div>
            <label>Thumbnail</label>
            <Dropzone multiple={false} onChange={setFiles} />
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
          className="bg-blue-500 text-white px-4 py-2 rounded w-32"
          onClick={handleSubmit}
        >
          Buat Kursus
        </button>
      </div>
    </>
  );
}
