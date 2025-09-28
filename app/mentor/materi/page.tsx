"use client";
import { lessonColumns } from "@/components/MentorPage/courses/column";
import { DataTable } from "@/components/MentorPage/table/data-table";
import { Button } from "@/components/ui/button";
import { useMentorStore } from "@/store/mentor";
import { useFetchTriggerToken, useFetchUmumToken } from "@/utils/useFetchUmum";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MateriPage() {
  const [selectedId, setSelectedId] = useState<string>("");
  const [listCourse, loadingCourse, fetchData] = useFetchTriggerToken<any[]>(
    "apiBase",
    `/api/mentor/courses/${selectedId}/lessons`
  );

  const { mentorKursus, ensureMentorKursus } = useMentorStore();
  useEffect(() => {
    ensureMentorKursus();
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchData();
    }
  }, [selectedId]);

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
      {loadingCourse && <div>Loading...</div>}
      {!loadingCourse &&listCourse && listCourse.length > 0 && (
        <DataTable columns={lessonColumns} data={listCourse} />
      )}
    </>
  );
}
