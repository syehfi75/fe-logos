import { create } from "zustand";
// import axios from "axios";
// import { useFetch } from "@/lib/axios";
import {
  getCourseDetail,
  getCourses,
  getResourcesCourseDetail,
  toCourse,
} from "@/services/courseApi";

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

export interface CourseDetail {
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

export interface Course {
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

export interface ResourceCourse {
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
      const basicCourses = await getCourses();

      const detailedCourses: Course[] = await Promise.all(
        basicCourses.map(async (course) => {
          try {
            const detail = await getCourseDetail(course.slug);
            return toCourse(course, detail); // <- hasil pasti Course
          } catch {
            return toCourse(course); // fallback
          }
        })
      );

      set({ courses: detailedCourses, loading: false });

      // set({ courses: detailedCourses, loading: false });
    } catch (error) {
      console.error("Error fetching courses:", error);
      set({ loading: false });
    }
  },
  fetchCourseDetail: async (slug: string) => {
    set({ loading: true });
    try {
      const courseDetail = await getCourseDetail(slug);
      set({ courseDetail: courseDetail, loading: false });
    } catch (error) {
      console.error("Error fetching course detail: ", error);
      set({ loading: false });
    }
  },
  fetchResourcesCourseDetail: async (slug: string) => {
    set({ loading: true });
    try {
      const res = await getResourcesCourseDetail(slug);

      set({ resourcesCourseDetail: res, loading: false });
    } catch (error) {
      console.error("Error fetching course detail: ", error);
      set({ loading: false });
      throw error;
    }
  },
}));
