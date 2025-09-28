"use client";
import { columns } from "@/components/MentorPage/courses/column";
import { DataTable } from "@/components/MentorPage/table/data-table";
import { Button } from "@/components/ui/button";
import { useMentorStore } from "@/store/mentor";
import { useFetchUmumToken } from "@/utils/useFetchUmum";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ListKursusPage() {
  // const [listCourse, loadingCourse] = useFetchUmumToken(
  //   "apiBase",
  //   "/api/mentor/courses"
  // );
  const { mentorKursus, loading, ensureMentorKursus } = useMentorStore();

  useEffect(() => {
    ensureMentorKursus();
  }, []);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">Daftar Kursus</h1>
        <div className="mb-4 text-gray-600">
          Kelola kursus yang Anda buat di sini.
        </div>
        <Button className="mb-4">
          <Plus className="mr-2 h-4 w-4" />
          <Link href="/mentor/kursus/create">Buat Kursus</Link>
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={mentorKursus ?? []} />
      )}
    </>
  );
}
