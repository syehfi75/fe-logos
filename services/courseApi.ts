import axiosInstance from "@/lib/axios";
import type { Course, CourseDetail, ResourceCourse } from "@/store/course"; // sesuaikan path mu

export async function getCourses(): Promise<Course[]> {
  const res = await axiosInstance.get("/dummy-api/courses");
  return res.data;
}

export async function getCourseDetail(slug: string): Promise<CourseDetail> {
  const res = await axiosInstance.get(`/dummy-api/course/${slug}`);
  return res.data;
}

export async function getResourcesCourseDetail(slug: string): Promise<ResourceCourse> {
  const res = await axiosInstance.get(`/dummy-api/course/${slug}/resources`);
  return res.data;
}

export function toCourse(base: Course, detail?: CourseDetail): Course {
  if (!detail) return base;
  return {
    // pertahankan tipe id sebagai string (ikut Course)
    id: base.id, // atau String(detail.id) bila mau sinkronkan dari detail
    slug: detail.slug ?? base.slug,
    title: detail.title ?? base.title,
    thumbnail: detail.thumbnail ?? base.thumbnail,
    description: detail.description ?? base.description,
    progress_percent: detail.progress_percent ?? base.progress_percent,
    total_lessons: detail.total_lessons ?? base.total_lessons,
    completed_lessons: detail.completed_lessons ?? base.completed_lessons,
    // pastikan Course punya lessons di tipe kamu
    lessons: detail.lessons ?? base.lessons,
  };
}

