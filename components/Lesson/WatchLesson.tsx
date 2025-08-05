"use client";
import { Lesson, useCourseStore } from "@/store/course";
import { useState, useEffect } from "react";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

export default function WatchLesson({ slug }: Props) {
  const { lessons, loading, fetchCourseDetail } = useCourseStore();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const fetch = async () => {
      await fetchCourseDetail(slug);
    };
    fetch();
  }, [slug]);

  useEffect(() => {
    if (lessons?.lessons?.length > 0) {
      const firstUncompletedLesson = lessons.lessons.find(
        (lesson: Lesson) => !lesson.is_completed
      );
      setSelectedLesson(
        firstUncompletedLesson || lessons.lessons[lessons.lessons.length - 1]
      );
    }
  }, [lessons]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex">
      {/* Video dan detail */}
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold mb-2">{selectedLesson?.title}</h1>
        <VideoPlayer
          url={selectedLesson?.video_url || ""}
          trackProgress
          videoId={selectedLesson?.id.toString()}
        />
        <p className="mt-2 text-gray-600">{selectedLesson?.description}</p>
      </div>

      {/* Daftar lesson */}
      <div className="w-80 p-4 border-l border-gray-300">
        <h2 className="text-lg font-semibold mb-3">Lessons</h2>
        <ul className="space-y-2">
          {lessons?.lessons?.map((lesson: any) => (
            <li
              key={lesson.slug}
              onClick={() => setSelectedLesson(lesson)}
              className={`cursor-pointer p-2 rounded ${
                selectedLesson?.slug === lesson.slug
                  ? "bg-blue-100 font-bold"
                  : "hover:bg-gray-100"
              }`}
            >
              {lesson.title}
              <div className="text-sm text-gray-500">
                {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface Props {
  slug: string;
}
