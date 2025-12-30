"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type ActionsOpts<T> = {
  header?: string;
  align?: "left" | "center" | "right";
  editHref?: (row: T) => string;          // URL edit
  editLabel?: string;
  onDelete?: (row: T) => void | Promise<void>;
  deleteLabel?: string;
  confirmTitle?: (row: T) => string;      // judul dialog
  confirmDesc?: (row: T) => string;       // deskripsi dialog
  extra?: (row: T) => React.ReactNode;    // aksi tambahan
};

export function actionsColumn<T>(opts: ActionsOpts<T> = {}): ColumnDef<T> {
  const {
    header = "Actions",
    align = "right",
    editHref,
    editLabel = "Edit",
    onDelete,
    deleteLabel = "Hapus",
    confirmTitle = () => "Hapus data ini?",
    confirmDesc = () => "Tindakan ini tidak bisa dibatalkan.",
    extra,
  } = opts;

  const alignCls =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "";

  function RowActions({ row }: { row: T }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const confirm = async () => {
      if (!onDelete) return;
      try {
        setLoading(true);
        await onDelete(row);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className={`${alignCls} space-x-2`}>
        {editHref && (
          <Button size="sm" variant="secondary" asChild>
            <Link href={editHref(row)}>{editLabel}</Link>
          </Button>
        )}

        {onDelete && (
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive" className="cursor-pointer">{deleteLabel}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{confirmTitle(row)}</AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmDesc(row)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirm}
                  disabled={loading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer text-white"
                >
                  {loading ? "Menghapus..." : "Hapus"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {extra ? extra(row) : null}
      </div>
    );
  }

  return {
    id: "actions",
    enableSorting: false,
    header: () => <div className={alignCls}>{header}</div>,
    cell: ({ row }) => <RowActions row={row.original as T} />,
  };
}
