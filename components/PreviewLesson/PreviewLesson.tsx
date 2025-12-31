"use client";

import "./style.css";
import { useCourseStore } from "@/store/course";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ListResources from "./ListResource";

export default function PreviewLesson({ slug }: Props) {
  const router = useRouter();
  const {
    courseDetail,
    resourcesCourseDetail,
    loading,
    fetchCourseDetail,
    fetchResourcesCourseDetail,
  } = useCourseStore();
  const [activeTab, setActiveTab] = useState("Lessons");
  const tabs = ["Overview", "Lessons", "Resource", "Stories"];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "black";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    fetchCourseDetail(slug);
  }, [slug, fetchCourseDetail]);

  useEffect(() => {
    if (activeTab === "Resource") {
      fetchResourcesCourseDetail(slug);
    }
  }, [activeTab]);

  return (
    <>
      <div className="container mx-auto px-40">
        <nav className={`sticky top-0 z-10`}>
          <div
            className={`absolute left-0 top-0 flex items-center gap-2 mb-4 py-5 text-white w-full px-4 ${
              scrolled ? "bg-black" : "bg-transparent"
            } transition-all duration-500 ease-in-out}`}
          >
            <ArrowLeft
              className="cursor-pointer"
              onClick={() => router.back()}
            />
            <h1 className="font-bold text-xl w-full text-center">
              {courseDetail?.title}
            </h1>
          </div>
        </nav>
        {/* TODO: Sementara disable untuk video preview, untuk h-20 dihilangkan ketika sudah ada video preview */}
        <div className="h-20"></div>
        {/* <div className="w-full">
          <VideoPlayer
            url="https://www.w3schools.com/html/mov_bbb.mp4"
            playing
            muted
            className="rounded-b-2xl"
          />
        </div> */}
        <div className="flex mt-4 gap-6">
          {courseDetail?.thumbnail && (
            <Image
              src={courseDetail?.thumbnail}
              alt={courseDetail?.description || ""}
              width={200}
              height={200}
              className="rounded-lg"
            />
          )}
          <div className="flex flex-col w-full">
            <h1 className="font-bold text-2xl text-white">
              {courseDetail?.title}
            </h1>
            <p className="text-gray-400/70 font-bold">
              {courseDetail?.instructor.name}
            </p>
            <div className="flex gap-6 items-center mt-4">
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1.5">
                <div
                  className="bg-blue-600 h-1 rounded-full"
                  style={{
                    width: `${courseDetail?.progress_percent}%`,
                  }}
                ></div>
              </div>
              <p className="text-white text-md w-1/4">
                {courseDetail?.completed_lessons} of{" "}
                {courseDetail?.total_lessons} lessons completed
              </p>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-6 text-white text-2xl mt-8 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-2 transition-colors duration-300 ${
                activeTab === tab
                  ? "text-white font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute left-0 -bottom-[1px] w-full h-[3px] bg-purple-400 rounded transition-all duration-300"></span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 text-white">
          {activeTab === "Overview" && <p>Ini halaman Overview</p>}
          {activeTab === "Lessons" && (
            <>
              {courseDetail?.lessons.map((lesson) => (
                <div
                  key={lesson.slug}
                  className="p-4 border-b border-gray-700 hover:bg-gray-800 cursor-pointer transition-all ease-in-out duration-500"
                  onClick={() => router.push(`/lesson/${slug}`)}
                >
                  <div className="flex items-center">
                    <Image
                      src={lesson.thumbnail}
                      alt={lesson.title}
                      width={200}
                      height={200}
                      className="rounded-lg mr-4"
                    />
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold">{lesson.title}</h2>
                      <p className="text-sm text-gray-400">
                        {lesson.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {Math.floor(lesson.duration / 60)} minutes
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <ChevronRight />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          {activeTab === "Resource" && (
            <div>
              {resourcesCourseDetail?.resources &&
                resourcesCourseDetail.resources.length > 0 && (
                  <ListResources resources={resourcesCourseDetail.resources} typeOrder={['pdf']} />
                  // <div className="mt-6">
                  //   <ul className="space-y-2">
                  //     {resourcesCourseDetail.resources.map((resource: any) => (
                  //       <li
                  //         key={resource.id}
                  //         className="flex items-center gap-2 p-4 border-b border-gray-700 hover:bg-gray-800 transition-all ease-in-out duration-500"
                  //       >
                  //         <div className="flex">
                  //           <Image
                  //             src={
                  //               resource.thumbnail || "/default-thumbnail.png"
                  //             }
                  //             alt={resource.title}
                  //             width={150}
                  //             height={300}
                  //             className="rounded-lg mr-2"
                  //           />
                  //         </div>
                  //         <div className="flex flex-col">
                  //           <h1>{resource.title}</h1>
                  //           <p className="text-gray-300 font-bold">
                  //             {courseDetail?.instructor.name}
                  //           </p>
                  //           <Link
                  //             href={resource.url}
                  //             target="_blank"
                  //             rel="noopener noreferrer"
                  //             className="text-blue-600 mt-3"
                  //           >
                  //             Download
                  //           </Link>
                  //         </div>
                  //         {/* <span className="text-sm text-gray-500">
                  //           ({resource.type})
                  //         </span> */}
                  //       </li>
                  //     ))}
                  //   </ul>
                  // </div>
                )}
            </div>
          )}
          {activeTab === "Stories" && <p>Story list</p>}
        </div>
      </div>
    </>
  );
}

interface Props {
  slug: string;
}
