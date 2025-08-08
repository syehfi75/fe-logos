
import PreviewLesson from "@/components/PreviewLesson/PreviewLesson";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview Lesson",
};

export default async function PreviewLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const {slug} = await params
  return <PreviewLesson slug={slug} />;
}
