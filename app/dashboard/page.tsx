"use client";

import Navbar from "@/components/Navbar/navbar";
import { useAuthStore } from "@/store/auth";
import { useCourseStore } from "@/store/course";
import { checkAndRefreshToken } from "@/utils/checkToken";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { courses, loading, fetchCourses } = useCourseStore();
  const router = useRouter();
  console.log(courses);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  const courseList = courses || [];
  const getImageUrl = (path: string | null) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;

    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `https://api.afzan.co/${cleanPath}`;
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-20">
        <h1 className="font-bold text-5xl py-6">Hi, {user?.username}</h1>
      </div>
      <div className="bg-gray-300/20 py-12">
        <div className="container mx-auto px-4 md:px-20">
          <p className="font-bold text-3xl">Continue Learning</p>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {Array(3).fill(null).map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md">
                  <div className="flex gap-2 p-4 cursor-pointer">
                    <Skeleton width={96} height={96} className="rounded-lg" />
                    <div className="flex flex-col p-4">
                      <Skeleton width={180} height={24} className="mb-2" />
                      <Skeleton width={130} height={16} className="mb-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {courseList?.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md">
                  <div
                    className="flex gap-2 p-4 cursor-pointer"
                    onClick={() => router.push(`/preview/${course.slug}`)}
                  >
                    <Image
                      className="w-24 h-24 object-cover rounded-lg"
                      src={getImageUrl(course.thumbnail)}
                      alt={course.description}
                      width={100}
                      height={200}
                    />
                    <div className="flex flex-col truncate">
                      <h2 className="text-xl font-semibold truncate">
                        {course.title}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {course.completed_lessons} of {course.total_lessons}{" "}
                        lessons completed
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1.5">
                        <div
                          className="bg-blue-600 h-1 rounded-full"
                          style={{
                            width: `${course.progress_percent}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/lesson/${course.slug}`}
                    className="flex flex-col hover:shadow-lg hover:scale-105 hover:cursor-pointer transition ease-in-out duration-300"
                  >
                    {course.completed_lessons > 0 &&
                      course.lessons.map((data) => (
                        <div key={data.id}>
                          {!data.is_completed && data.last_position > 0 && (
                            <>
                              <div className="aspect-w-16 aspect-h-9">
                                <Image
                                  className="w-full h-[160px] object-cover rounded-t-lg"
                                  src={getImageUrl(data.thumbnail)}
                                  alt={data.description}
                                  width={400}
                                  height={600}
                                />
                              </div>
                              <div className="p-4 bg-white">
                                <h1 className="text-gray-500 text-lg">
                                  {data.title}
                                </h1>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
