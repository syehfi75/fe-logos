import { create } from "zustand";
// import axios from "axios";
import { useFetch } from "@/lib/axios";

export interface Lesson {
  id: number;
  thumbnail: string;
  title: string;
  description: string;
  is_completed: boolean;
  duration: number;
  last_position: number;
  video_url: string;
  slug: string;
  order: number;
  is_locked: boolean;
  downloadable_resources?: {
    id: number;
    title: string;
    type: string;
    url: string;
  };
}

interface Instructor {
  name: string;
  bio: string;
  avatar: string;
}

interface CourseDetail {
  id: number;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: Instructor;
  progress_percent: number;
  total_lessons: number;
  completed_lessons: number;
  is_subscribed: boolean;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  completed_lessons: number;
  total_lessons: number;
  progress_percent: number;
  slug: string;
  lessons: Lesson[];
}

interface ResourceCourse {
  resources: [];
}

interface CourseStore {
  courses: Course[];
  courseDetail: CourseDetail | null;
  resourcesCourseDetail: ResourceCourse | null;
  loading: boolean;
  fetchCourses: () => Promise<void>;
  fetchCourseDetail: (slug: string) => Promise<void>;
  fetchResourcesCourseDetail: (slug: string) => Promise<void>;
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  courseDetail: null,
  resourcesCourseDetail: null,
  loading: false,
  fetchCourses: async () => {
    set({ loading: true });
    try {
      const res = await useFetch(
        "get",
        `${process.env.NEXT_PUBLIC_API_AUTH}/dummy-api/courses`,
        undefined,
        { auth: true }
      );

      const basicCourses = res.data;
      const detailedCourses = await Promise.all(
        basicCourses.map(async (course: Course) => {
          try {
            // const detailRes = await axios.get(
            //   `${process.env.NEXT_PUBLIC_API_AUTH}/dummy-api/course/${course.slug}`
            // );
            const detailRes = await useFetch(
              "get",
              `${process.env.NEXT_PUBLIC_API_AUTH}/dummy-api/course/${course.slug}`,
              undefined,
              { auth: true }
            );
            return {
              ...course,
              ...detailRes.data,
            };
          } catch (err) {
            console.error(`Error fetching detail for ${course.slug}:`, err);
            return course;
          }
        })
      );

      set({ courses: detailedCourses, loading: false });
    } catch (error) {
      console.error("Error fetching courses: ", error);
      set({ loading: false });
    }
  },
  fetchCourseDetail: async (slug: string) => {
    set({ loading: true });
    try {
      const courseDetail = await useFetch(
        "get",
        `${process.env.NEXT_PUBLIC_API_AUTH}/dummy-api/course/${slug}`,
        undefined,
        { auth: true }
      );
      set({ courseDetail: courseDetail.data, loading: false });
    } catch (error) {
      console.error("Error fetching course detail: ", error);
      set({ loading: false });
    }
  },
  fetchResourcesCourseDetail: async (slug: string) => {
    set({ loading: true });
    try {
      const res = await useFetch(
        "get",
        `${process.env.NEXT_PUBLIC_API_AUTH}/dummy-api/course/${slug}/resources`,
        undefined,
        { auth: true }
      );

      set({ resourcesCourseDetail: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching course detail: ", error);
      set({ loading: false });
      throw error;
    }
  },
}));
