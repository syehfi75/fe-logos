import WatchLesson from "@/components/Lesson/WatchLesson";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lesson",
};

export default async function WatchLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const {slug} = await params
  return <WatchLesson slug={slug} />;
}
