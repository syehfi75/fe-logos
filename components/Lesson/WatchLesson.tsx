"use client";
import { Lesson, useCourseStore } from "@/store/course";
import { useState, useEffect, useMemo, useCallback } from "react";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import Image from "next/image";
import { ArrowLeft, CircleCheck } from "lucide-react";
import Link from "next/link";
import OfflineAudioPlayer from "../OfflineAudioPlayer";

export default function WatchLesson({ slug }: Props) {
  const {
    courseDetail,
    resourcesCourseDetail,
    loading,
    fetchCourseDetail,
    fetchResourcesCourseDetail,
  } = useCourseStore();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [tabs, setTabs] = useState<{ [key: string]: boolean }>({
    video: true,
    resources: false,
  });
  const lessons = courseDetail?.lessons ?? [];

  const currentIndex = useMemo(() => {
    if (!selectedLesson) return -1;
    return lessons.findIndex((l) => l.slug === selectedLesson.slug);
  }, [lessons, selectedLesson]);

  const goPrev = useCallback(() => {
    if (currentIndex <= 0) return;
    let i = currentIndex - 1;
    while (i >= 0 && lessons[i].is_locked) i--;
    if (i >= 0) setSelectedLesson(lessons[i]);
  }, [currentIndex, lessons]);

  const goNext = useCallback(() => {
    if (currentIndex === -1 || currentIndex >= lessons.length - 1) return;
    let i = currentIndex + 1;
    while (i < lessons.length && lessons[i].is_locked) i++;
    if (i < lessons.length) setSelectedLesson(lessons[i]);
  }, [currentIndex, lessons]);

  useEffect(() => {
    fetchCourseDetail(slug);
    fetchResourcesCourseDetail(slug);
  }, [slug, fetchCourseDetail, fetchResourcesCourseDetail]);

  useEffect(() => {
    if (courseDetail?.lessons && courseDetail.lessons.length > 0) {
      const firstUncompletedLesson = courseDetail.lessons.find(
        (lesson) => !lesson.is_completed,
      );
      setSelectedLesson(
        firstUncompletedLesson ||
          courseDetail.lessons[courseDetail.lessons.length - 1],
      );
    }
  }, [courseDetail]);

  const getImageUrl = (path: string | null) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;

    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `https://api.afzan.co/${cleanPath}`;
  };

  if (loading) return <p>Loading...</p>;
  if (!courseDetail) return <p>Course not found</p>;

  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen">
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <Link href="/dashboard" className="flex items-center">
              <ArrowLeft className="inline mr-2" />
              <span className="whitespace-nowrap">Back to Dashboard</span>
            </Link>
            <h1 className="font-bold text-xl md:text-2xl truncate">
              {courseDetail.title}
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedLesson?.content_type == "video" ? (
            <>
              <VideoPlayer
                url={selectedLesson.video_url}
                trackProgress
                videoId={selectedLesson.id.toString()}
                last_duration={
                  selectedLesson.last_position === selectedLesson.duration
                    ? 0
                    : selectedLesson.last_position
                }
                duration={selectedLesson.duration}
                enableProgressTracking
              />
              <div className="mt-3 flex gap-2 justify-end">
                <button
                  onClick={goPrev}
                  disabled={currentIndex <= 0}
                  className="px-4 py-2 rounded-lg border cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  ← Prev
                </button>
                <button
                  onClick={goNext}
                  disabled={
                    currentIndex === lessons.length - 1 || currentIndex === -1
                  }
                  className="px-4 py-2 rounded-lg border cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <OfflineAudioPlayer
              audioUrl={selectedLesson?.audio_url || ""}
              trackId={`track_${selectedLesson?.id}`}
            />
          )}

          <h1 className="text-lg md:text-xl font-bold mb-2 mt-4">
            {selectedLesson?.title}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {selectedLesson?.description}
          </p>

          <div className="flex items-center gap-3 mt-4">
            <div className="rounded-full h-10 w-10 md:h-14 md:w-14 bg-black overflow-hidden">
              <Image
                src={getImageUrl(courseDetail.instructor.avatar)}
                alt={courseDetail.instructor.name}
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-sm md:text-base">
                {courseDetail.instructor.name}
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                {courseDetail.instructor.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-t md:border-t-0 md:border-l border-gray-300">
        <div className="flex gap-2 md:gap-4 items-center mb-4">
          <h1
            className={`text-sm md:text-xl font-bold cursor-pointer px-3 md:px-6 py-1 rounded-full ${
              tabs.video ? "text-blue-600" : "hover:bg-gray-400/50"
            }`}
            onClick={() => setTabs({ video: true, resources: false })}
          >
            Lessons
          </h1>
          <h1
            className={`text-sm md:text-xl font-bold cursor-pointer px-3 md:px-6 py-1 rounded-full ${
              tabs.resources ? "text-blue-600 " : "hover:bg-gray-400/50"
            }`}
            onClick={() => setTabs({ video: false, resources: true })}
          >
            Resources
          </h1>
        </div>

        {tabs.video && (
          <>
            <div className="text-xs md:text-sm text-gray-500 mb-3">
              {courseDetail.completed_lessons} of {courseDetail.total_lessons}{" "}
              completed
            </div>
            <ul className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              {courseDetail.lessons.map((lesson) => (
                <li
                  key={lesson.slug}
                  onClick={() => !lesson.is_locked && setSelectedLesson(lesson)}
                  className={`cursor-pointer p-2 md:p-3 rounded-lg transition-colors ${
                    selectedLesson?.slug === lesson.slug
                      ? "bg-blue-100 border border-blue-200"
                      : "hover:bg-gray-50 border border-transparent"
                  } ${lesson.is_completed ? "opacity-80" : ""}`}
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={getImageUrl(lesson.thumbnail)}
                        alt={lesson.title}
                        width={80}
                        height={45}
                        className="w-20 h-[45px] object-cover rounded-md"
                      />
                      {lesson.is_completed && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 md:w-5 md:h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-xs md:text-base truncate ${
                          selectedLesson?.slug === lesson.slug
                            ? "text-blue-600"
                            : "text-gray-800"
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>
                          {Math.floor(lesson.duration / 60)}m{" "}
                          {lesson.duration % 60}s
                        </span>
                        {lesson.is_completed && (
                          <span className="ml-2 flex items-center">
                            <CircleCheck className="w-2 h-2 md:w-3 md:h-3 mr-1 text-green-500" />
                            <span className="hidden md:inline">Completed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {tabs.resources && (
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {resourcesCourseDetail?.resources &&
              resourcesCourseDetail.resources.length > 0 && (
                <ul className="space-y-2">
                  {resourcesCourseDetail.resources.map((resource: any) => (
                    <li key={resource.id} className="flex items-center gap-2">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all"
                      >
                        {resource.title}
                      </a>
                      <span className="text-xs text-gray-500">
                        ({resource.type})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  slug: string;
}
