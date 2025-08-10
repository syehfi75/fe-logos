"use client";
import { ChevronDown } from "lucide-react";
import React from "react";

type Resource = {
  id: number;
  title: string;
  type: string;
  url: string;
  thumbnail?: string;
};

type Props = {
  resources: Resource[];
  typeOrder?: string[];
};

function groupByType(items: Resource[]) {
  return items.reduce<Record<string, Resource[]>>((acc, item) => {
    const key = item.type?.toLowerCase() || "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

const typeLabel: Record<string, string> = {
  pdf: "PDFs",
  link: "Links",
};

export default function ListResources({ resources, typeOrder }: Props) {
  const grouped = groupByType(resources);

  const types = Object.keys(grouped).sort((a, b) => {
    const ai = typeOrder ? typeOrder.indexOf(a) : -1;
    const bi = typeOrder ? typeOrder.indexOf(b) : -1;
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="w-full space-y-3">
      {types.map((t) => (
        <details key={t} className="group rounded-2xl" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <ChevronDown className="group-open:rotate-180" />
              <h3 className="font-bold text-2xl">
                {typeLabel[t] ?? t.toUpperCase()}{" "}
              </h3>
            </div>
          </summary>

          <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped[t].map((r) => (
              <article key={r.id} className="flex gap-3 rounded-xl">
                {/* Thumbnail */}
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {/* pakai img biasa agar tidak bergantung Next/Image */}
                  <img
                    src={
                      r.thumbnail ||
                      "https://dummyimage.com/400x300/e5e7eb/9ca3af&text=Resource"
                    }
                    alt={r.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <h4 className="truncate font-medium">{r.title}</h4>
                  {/* <p className="text-xs uppercase tracking-wide text-gray-500">
                    {typeLabel[r.type] ?? r.type}
                  </p> */}

                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg px-2.5 py-1 text-blue-600"
                    >
                      {r.type === "pdf" ? "Download" : "Open link"}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
