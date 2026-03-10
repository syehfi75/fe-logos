"use client";
import "./style.css";
import { useCourseStore } from "@/store/course";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ListResources from "./ListResource";
import { LessonTab } from "./Tabs/LessonsTab";

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

  const getImageUrl = (path: string | null) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;

    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `https://api.afzan.co/${cleanPath}`;
  };

  return (
    <>
      <div className="container mx-auto px-4 md:px-20 lg:px-40">
        <nav className={`sticky top-0 z-50`}>
          <div
            className={`absolute left-0 top-0 flex items-center gap-2 mb-4 py-5 text-white w-full px-4 ${
              scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
            } transition-all duration-500 ease-in-out}`}
          >
            <ArrowLeft
              className="cursor-pointer shrink-0"
              onClick={() => router.back()}
            />

            <h1 className="font-bold text-lg md:text-xl w-full text-center pr-8">
              {courseDetail?.title}
            </h1>
          </div>
        </nav>

        <div className="h-20"></div>

        <div className="flex flex-col md:flex-row mt-4 gap-6">
          {courseDetail?.thumbnail && (
            <div className="flex justify-center md:justify-start">
              <Image
                src={getImageUrl(courseDetail?.thumbnail)}
                alt={courseDetail?.description || ""}
                width={200}
                height={200}
                className="rounded-lg w-full max-w-[200px] md:w-[200px] object-cover"
              />
            </div>
          )}
          <div className="flex flex-col w-full text-center md:text-left">
            <h1 className="font-bold text-xl md:text-2xl text-white">
              {courseDetail?.title}
            </h1>
            <p className="text-gray-400/70 font-bold">
              {courseDetail?.instructor.name}
            </p>

            <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center mt-4">
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1.5">
                <div
                  className="bg-blue-600 h-1 rounded-full"
                  style={{
                    width: `${courseDetail?.progress_percent}%`,
                  }}
                ></div>
              </div>
              <p className="text-white text-sm md:text-md w-full md:w-1/3 whitespace-nowrap">
                {courseDetail?.completed_lessons} of{" "}
                {courseDetail?.total_lessons} lessons completed
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 md:gap-6 text-white text-lg md:text-2xl mt-8 border-b border-gray-700 overflow-x-auto no-scrollbar whitespace-nowrap">
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

        <div className="mt-6 text-white pb-10">
          {activeTab === "Overview" && (
            <p className="text-gray-300">Ini halaman Overview</p>
          )}
          {activeTab === "Lessons" && (
            <LessonTab data={courseDetail?.lessons} slug={slug} />
          )}
          {activeTab === "Resource" && (
            <div className="w-full overflow-hidden">
              {resourcesCourseDetail?.resources &&
                resourcesCourseDetail.resources.length > 0 && (
                  <ListResources
                    resources={resourcesCourseDetail.resources}
                    typeOrder={["pdf"]}
                  />
                )}
            </div>
          )}
          {activeTab === "Stories" && (
            <p className="text-gray-300">Story list</p>
          )}
        </div>
      </div>
    </>
  );
}

interface Props {
  slug: string;
}
