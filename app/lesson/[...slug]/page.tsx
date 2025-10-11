import WatchLesson from "@/components/Lesson/WatchLesson";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lesson",
};

export default function WatchLessonPage({
  params,
}: {
  params: { slug: string | string[] };
}) {
  const slugParam = Array.isArray(params.slug)
    ? params.slug.join("/")
    : params.slug;
  return <WatchLesson slug={slugParam} />;
}
