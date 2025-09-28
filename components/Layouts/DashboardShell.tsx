// components/layouts/DashboardShell.tsx
import { Sidebar, SidebarGroup } from "@/components/Sidebar/Sidebar";

export default function DashboardShell({
  title,
  menu,
  children,
}: {
  title?: string;
  menu: SidebarGroup[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar title={title} groups={menu} />
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
