"use client";
import { getLessonColumns } from "@/components/MentorPage/courses/column";
import { DataTable } from "@/components/MentorPage/table/data-table";
import Modal from "@/components/Modal/Modal";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { deleteDataToken } from "@/lib/fetchUmumHelper";
import { useMentorStore } from "@/store/mentor";
import { Lesson } from "@/types/mentorCourse";
import { useFetchTriggerToken } from "@/utils/useFetchUmum";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function MateriPage() {
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string>("");
  const [listCourse, loadingCourse, fetchData] = useFetchTriggerToken<any[]>(
    "apiBase",
    `/api/mentor/courses/${selectedId}/lessons`
  );
  const lessons = listCourse?.[0]?.lessons ?? [];
  const lessonsWithCourseId = useMemo(
    () => lessons.map((ls: any) => ({ ...ls, course_id: selectedId })),
    [lessons, selectedId]
  );
  const visibleRows = useMemo(() => {
    if (deletedIds.size === 0) return lessonsWithCourseId;
    return lessonsWithCourseId.filter(
      (l: { id: any }) => !deletedIds.has(String(l.id))
    );
  }, [lessonsWithCourseId, deletedIds]);

  const handleDeleteLesson = async (c: any) => {
    try {
      const res = await deleteDataToken(
        "apiBase",
        `/api/mentor/courses/${c.course_id}/lessons/${c.id}`
      );
      if (!res.success) throw new Error(res.message || "Gagal menghapus");
      setDeletedIds((prev) => {
        const n = new Set(prev);
        n.add(String(c.id));
        return n;
      });
      toast.success(`Berhasil dihapus "${c.title}" telah dihapus.`);
    } catch (e: any) {
      toast.error(`Gagal menghapus "${c.title}": ${e.message || e}`);
    }
  };

  const { mentorKursus, ensureMentorKursus } = useMentorStore();
  useEffect(() => {
    ensureMentorKursus();
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchData();
    }
  }, [selectedId]);
  const onOpenVideo = useCallback((l: Lesson) => {
    setVideo({ url: l?.video_url, title: l?.title });
  }, []);
  const columns = useMemo(
    () => getLessonColumns({ onDelete: handleDeleteLesson, onOpenVideo }),
    [handleDeleteLesson]
  );
  const [video, setVideo] = useState<{ url: string; title: string } | null>(
    null
  );

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
      {!loadingCourse && listCourse && listCourse.length > 0 && (
        <DataTable columns={columns} data={visibleRows} />
      )}
      <Modal
        open={!!video}
        onClose={() => setVideo(null)}
        title={video?.title}
        size="xl"
      >
        {video && (
          <iframe
            src={video?.url}
            className="w-full h-96 rounded"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}
      </Modal>
    </>
  );
}
