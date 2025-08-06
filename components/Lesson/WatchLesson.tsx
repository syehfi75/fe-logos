"use client";
import { Lesson, useCourseStore } from "@/store/course";
import { useState, useEffect } from "react";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import Image from "next/image";
import { CircleCheck } from "lucide-react";

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

  useEffect(() => {
    fetchCourseDetail(slug);
    fetchResourcesCourseDetail(slug);
  }, [slug, fetchCourseDetail, fetchResourcesCourseDetail]);

  useEffect(() => {
    if (courseDetail?.lessons && courseDetail.lessons.length > 0) {
      const firstUncompletedLesson = courseDetail.lessons.find(
        (lesson) => !lesson.is_completed
      );
      setSelectedLesson(
        firstUncompletedLesson ||
          courseDetail.lessons[courseDetail.lessons.length - 1]
      );
    }
  }, [courseDetail]);

  if (loading) return <p>Loading...</p>;
  if (!courseDetail) return <p>Course not found</p>;

  return (
    <div className="flex h-screen">
      {/* Video and details */}
      <div className="flex-1 py-4 px-8 overflow-y-auto">
        <h1 className="font-bold text-3xl mb-4">{courseDetail.title}</h1>
        {selectedLesson?.video_url && (
          <VideoPlayer
            url={selectedLesson.video_url}
            trackProgress
            videoId={selectedLesson.id.toString()}
            className="rounded-xl"
            last_duration={selectedLesson.last_position}
          />
        )}

        <h1 className="text-xl font-bold mb-2 mt-4">{selectedLesson?.title}</h1>
        <p className="text-gray-600">{selectedLesson?.description}</p>

        <div className="flex items-center gap-3 mt-4">
          <div className="rounded-full h-14 w-14 bg-black overflow-hidden">
            <Image
              src={courseDetail.instructor.avatar}
              alt={courseDetail.instructor.name}
              width={56}
              height={56}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-medium">{courseDetail.instructor.name}</p>
            <p className="text-sm text-gray-600">
              {courseDetail.instructor.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Lessons list */}
      <div className="w-3/12 p-4 border-l border-gray-300 overflow-y-auto">
        <div className="flex gap-4 items-center mb-4">
          <h1
            className={`text-xl font-bold cursor-pointer px-6 py-1 rounded-full ${
              tabs.video ? "text-blue-600" : "hover:bg-gray-400/50"
            }`}
            onClick={() => setTabs({ video: true, resources: false })}
          >
            Lessons
          </h1>
          <h1
            className={`text-xl font-bold cursor-pointer px-6 py-1 rounded-full ${
              tabs.resources ? "text-blue-600 " : "hover:bg-gray-400/50"
            }`}
            onClick={() => setTabs({ video: false, resources: true })}
          >
            Resources
          </h1>
        </div>
        {tabs.video && (
          <>
            <div className="text-sm text-gray-500 mb-3">
              {courseDetail.completed_lessons} of {courseDetail.total_lessons}{" "}
              completed
            </div>
            <ul className="space-y-3">
              {courseDetail.lessons.map((lesson) => (
                <li
                  key={lesson.slug}
                  onClick={() => !lesson.is_locked && setSelectedLesson(lesson)}
                  className={`cursor-pointer p-3 rounded-lg transition-colors ${
                    selectedLesson?.slug === lesson.slug
                      ? "bg-blue-100 border border-blue-200"
                      : "hover:bg-gray-50 border border-transparent"
                  } ${lesson.is_completed ? "opacity-80" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={lesson.thumbnail}
                        alt={lesson.title}
                        width={80}
                        height={45}
                        className="w-20 h-[45px] object-cover rounded-md"
                      />
                      {lesson.is_completed && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
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
                        className={`font-medium truncate ${
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
                            <CircleCheck className="w-3 h-3 mr-1 text-green-500" />
                            Completed
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
          <div>
            {resourcesCourseDetail?.resources &&
              resourcesCourseDetail.resources.length > 0 && (
                <div className="mt-6">
                  <ul className="space-y-2">
                    {resourcesCourseDetail.resources.map((resource: any) => (
                      <li key={resource.id} className="flex items-center gap-2">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {resource.title}
                        </a>
                        <span className="text-sm text-gray-500">
                          ({resource.type})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}
        {/* <h2 className="text-lg font-semibold mb-3">Lessons</h2> */}
      </div>
    </div>
  );
}

interface Props {
  slug: string;
}
