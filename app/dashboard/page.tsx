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

  useEffect(() => {
    const init = async () => {
      const valid = await checkAndRefreshToken();
      if (!valid) {
        router.push("/login");
        return;
      }

      fetchCourses();
    };

    init();
  }, [fetchCourses, router]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-8 md:px-20">
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl py-6">Hi, {user?.username}</h1>
      </div>
      <div className="bg-gray-300/20 py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-8 md:px-20">
          <p className="font-bold text-2xl sm:text-3xl">Continue Learning</p>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              <div className="w-full"><Skeleton height={200} width={'100%'} /></div>
              <div className="w-full"><Skeleton height={200} width={'100%'} /></div>
              <div className="hidden sm:block w-full"><Skeleton height={200} width={'100%'} /></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md">
                  <div
                    className="flex gap-2 p-4 cursor-pointer"
                    onClick={() => router.push(`/preview/${course.slug}`)}
                  >
                    <Image
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                      src={course.thumbnail}
                      alt={course.description}
                      width={100}
                      height={200}
                    />
                    <div className="flex flex-col truncate">
                      <h2 className="text-lg sm:text-xl font-semibold truncate">
                        {course.title}
                      </h2>
                      <p className="text-gray-500 text-xs sm:text-sm">
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
                    {course.lessons.map((data) => (
                      <div key={data.id}>
                        {!data.is_completed && data.last_position > 0 && (
                          <>
                            <div>
                              <Image
                                className="w-full h-[140px] sm:h-[160px] object-cover rounded-t-lg"
                                src={data.thumbnail}
                                alt={data.description}
                                width={400}
                                height={600}
                              />
                            </div>
                            <div className="p-4 bg-white">
                              <h1 className="text-gray-500 text-base sm:text-lg">
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
