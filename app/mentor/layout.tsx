"use client";

import {
  Sidebar,
  SidebarGroup,
  SidebarTopSection,
} from "@/components/Sidebar/Sidebar";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const topSections: SidebarTopSection[] = [
  {
    key: "main",
    label: "Main",
    show: 1,
    links: [
      {
        label: "Dashboard",
        href: "/mentor/dashboard",
        icon: <Home size={16} />,
        pin: true,
      },
    ],
  },
];

const mentorMenu: SidebarGroup[] = [
  {
    key: "kursus",
    label: "Kursus",
    defaultOpen: true,
    links: [
      { label: "Daftar kursus", href: "/mentor/kursus" },
      { label: "Buat kursus baru", href: "/mentor/kursus/create" },
      { label: "Materi", href: "/mentor/materi" },
      { label: "Buat materi baru", href: "/mentor/materi/create" },
    ],
  },
];

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const paths = ["/mentor/login"];
  const pathname = usePathname();
  const hidden = paths.some((p) => pathname.startsWith(p));
  
  useEffect(() => {
    const storedUserData = localStorage.getItem("auth-mentor-storage");  
    if (!storedUserData && !hidden) {
      toast.error("Silahkan login terlebih dahulu");
      window.location.href = "/mentor/login";
    }
  }, []);

  return (
    <div className="flex h-screen">
      {!hidden && (
        <Sidebar
          title="Mentor Admin"
          topSections={topSections}
          groups={mentorMenu}
        />
      )}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
