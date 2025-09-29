"use client";

import { ColumnDef } from "@tanstack/react-table";

import Image from "next/image";
import { Course, Lesson } from "@/types/mentorCourse";
import { actionsColumn } from "./actionColumn";
import { useMentorStore } from "@/store/mentor";
import { toast } from "sonner";
import { deleteDataToken } from "@/lib/fetchUmumHelper";
import { Button } from "@/components/ui/button";

const formatDate = (s: string) =>
  new Date(s.replace(" ", "T")).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const handleDelete = async (c: any) => {
  try {
    await useMentorStore.getState().deleteCourse(c.id);
    toast.success(`Berhasil dihapus "${c.title}" telah dihapus.`);
  } catch (e: any) {
    toast.error(`Gagal menghapus "${c.title}": ${e.message || e}`);
  }
};

export const columns: ColumnDef<Course>[] = [
  {
    header: "Thumbnail",
    accessorKey: "thumbnail",
    cell: ({ row }) => {
      const t = row.original.thumbnail?.small;
      return t ? (
        <Image
          src={t}
          alt={row.original.title}
          width={60}
          height={40}
          className="rounded object-cover"
        />
      ) : (
        <div className="w-[60px] h-[40px] rounded bg-gray-300 text-[10px] text-gray-700 flex items-center justify-center">
          N/A
        </div>
      );
    },
    enableSorting: false,
    size: 80,
  },
  {
    header: "Title",
    accessorKey: "title",
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const s = String(row.getValue("status"));
      const cls =
        s === "publish"
          ? "bg-green-200 text-green-800"
          : s === "draft"
          ? "bg-yellow-200 text-yellow-800"
          : "bg-gray-200 text-gray-800";
      return <span className={`px-2 py-1 text-xs rounded ${cls}`}>{s}</span>;
    },
  },
  {
    header: "Category",
    accessorKey: "category",
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: ({ row }) => <span>{formatDate(row.original.created_at)}</span>,
  },
  actionsColumn<Course>({
    align: "right",
    editHref: (c) => `/mentor/kursus/edit/${c.id}`,
    onDelete: async (c) => {
      handleDelete(c);
    },
  }),
];

export function getLessonColumns(opts: {
  onDelete: (l: Lesson) => Promise<void>;
  onOpenVideo: (l: Lesson) => void; 
}) {
  const { onDelete, onOpenVideo } = opts;

  const lessonColumns: ColumnDef<Lesson>[] = [
    {
      header: "Thumb",
      accessorKey: "thumbnail",
      enableSorting: false,
      size: 80,
      cell: ({ row }) => {
        const url = row.original.thumbnail;
        return url ? (
          // pakai <img> agar tidak perlu config next/image
          <img
            src={url}
            alt={row.original.title}
            width={72}
            height={48}
            className="rounded object-cover"
          />
        ) : (
          <div className="w-[72px] h-[48px] rounded bg-gray-200 text-gray-700 text-[10px] flex items-center justify-center">
            N/A
          </div>
        );
      },
    },
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
        </div>
      ),
    },
    {
      header: "Order",
      accessorKey: "order",
      size: 60,
    },
    {
      header: "Duration",
      accessorKey: "duration",
      size: 80,
      cell: ({ row }) => <span>{row.original.duration} m</span>,
    },
    {
      header: "Video",
      accessorKey: "video_url",
      enableSorting: false,
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => onOpenVideo(row.original)}>
          Preview
        </Button>
      ),
    },
    actionsColumn<Lesson>({
      align: "right",
      editHref: (c) => `/mentor/materi/edit/${c.course_id}?materi=${c.id}`,
      onDelete: onDelete,
    }),
  ];

  return lessonColumns;
}
