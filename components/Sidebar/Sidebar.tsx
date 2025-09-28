"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

export type SidebarLink = {
  label: string;
  href: string;
  matchPrefix?: boolean;
  icon?: React.ReactNode;
  pin?: boolean;
};

export type SidebarTopSection = {
  key: string;
  label?: string;
  links: SidebarLink[];
  show?: number;
};

export type SidebarGroup = {
  key: string;
  label: string;
  links: SidebarLink[];
  defaultOpen?: boolean;
};

export function Sidebar({
  title = "Mentor Admin",
  headerHref,
  topSections = [],
  groups = [],
}: {
  title?: string;
  headerHref?: string;
  topSections?: SidebarTopSection[];
  groups?: SidebarGroup[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(groups.map(g => [g.key, Boolean(g.defaultOpen)])) as
        Record<string, boolean>
  );
  const [expandedTop, setExpandedTop] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState("");

  const toggle = (key: string) => setOpen(s => ({ ...s, [key]: !s[key] }));
  const toggleTop = (key: string) =>
    setExpandedTop(s => ({ ...s, [key]: !s[key] }));

  const isActive = (link: SidebarLink) => {
    if (link.matchPrefix) return pathname.startsWith(link.href);
    return pathname === link.href;
  };

  const keyword = q.trim().toLowerCase();
  const match = (l: SidebarLink) =>
    !keyword ||
    l.label.toLowerCase().includes(keyword) ||
    (l.href || "").toLowerCase().includes(keyword);

  // Filter TOP (non-collapsible)
  const filteredTop = useMemo(() => {
    return topSections.map(sec => {
      const pinned = (sec.links || []).filter(l => l.pin && match(l));
      const items  = (sec.links || []).filter(l => !l.pin && match(l));
      return { ...sec, pinned, items };
    });
  }, [topSections, keyword]);

  // Filter GROUPS (collapsible) — inilah bagian pentingnya
  const filteredGroups = useMemo(() => {
    return groups.map(g => {
      const hits = (g.links || []).filter(match);
      return { ...g, _hits: hits, _hasHits: hits.length > 0 };
    });
  }, [groups, keyword]);

  const hasTopResults =
    filteredTop.some(s => (s.pinned?.length || 0) + (s.items?.length || 0) > 0);
  const hasGroupResults = filteredGroups.some(g => g._hasHits);
  const noResults = keyword && !hasTopResults && !hasGroupResults;

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        {headerHref ? (
          <Link href={headerHref} className="hover:underline">
            {title}
          </Link>
        ) : (
          title
        )}
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-700/60">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari menu…"
          className="w-full px-3 py-2 rounded bg-gray-900/40 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      {/* TOP sections */}
      {filteredTop.map(sec => {
        const show = typeof sec.show === "number" ? sec.show : 8;
        const expanded = !!expandedTop[sec.key];
        const visible = expanded ? sec.items : sec.items.slice(0, show);
        const hasMore = (sec.items?.length || 0) > show;
        const hasAny = (sec.pinned?.length || 0) + (sec.items?.length || 0) > 0;

        if (keyword && !hasAny) return null;

        return (
          <div key={sec.key} className="p-3 border-b border-gray-700/40">
            {sec.label ? (
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                {sec.label}
              </div>
            ) : null}

            {sec.pinned?.length ? (
              <ul className="space-y-1 mb-2">
                {sec.pinned.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700 ${
                        isActive(link) ? "bg-gray-700" : ""
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            <ul className="space-y-1">
              {visible.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700 ${
                      isActive(link) ? "bg-gray-700" : ""
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {hasMore && !keyword && (
              <button
                onClick={() => toggleTop(sec.key)}
                className="mt-2 text-xs underline text-gray-300 hover:text-white"
              >
                {expanded ? "Show less" : `Show ${sec.items.length - show} more`}
              </button>
            )}
          </div>
        );
      })}

      {/* GROUPS (collapsible) — auto-buka saat sedang mencari */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {filteredGroups.map(g => {
          // Saat ada query: sembunyikan grup tanpa hasil, dan paksa open.
          if (keyword && !g._hasHits) return null;
          const isOpen = keyword ? true : open[g.key];
          const list = keyword ? g._hits : g.links;

          return (
            <div key={g.key}>
              <button
                onClick={() => toggle(g.key)}
                className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-gray-700"
              >
                <span className="font-medium">{g.label}</span>
                <ChevronRight
                  size={18}
                  className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
              </button>

              {isOpen && (
                <ul className="mt-1 space-y-1 pl-2 text-sm">
                  {list.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700 ${
                          isActive(link) ? "bg-gray-700" : ""
                        }`}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                  {keyword && list.length === 0 ? (
                    <li className="px-2 py-2 text-xs text-gray-400">Tidak ada hasil</li>
                  ) : null}
                </ul>
              )}
            </div>
          );
        })}

        {noResults && (
          <div className="px-2 py-3 text-sm text-gray-300">Tidak ada menu ditemukan.</div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 mt-auto border-t border-gray-700">
        <ul className="space-y-1 text-sm">
          <li><Link href="/account" className="block px-2 py-2 rounded hover:bg-gray-700">Akunku</Link></li>
          <li><Link href="/settings" className="block px-2 py-2 rounded hover:bg-gray-700">Pengaturan</Link></li>
          <li><Link href="/logout" className="block px-2 py-2 rounded hover:bg-gray-700">Logout</Link></li>
        </ul>
      </div>
    </aside>
  );
}
