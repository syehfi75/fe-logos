import { create } from "zustand";
import axios from "axios";

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
  lessons: []
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

interface CourseStore {
  courses: Course[];
  lessons: Lesson;
  loading: boolean;
  fetchCourses: () => Promise<void>;
  fetchCourseDetail: (slug: string) => Promise<void>;
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  lessons: {} as Lesson,
  loading: false,
  fetchCourses: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_AUTH}/dummy-api/courses`
      );

      const basicCourses = res.data;
      const detailedCourses = await Promise.all(
        basicCourses.map(async (course: Course) => {
          try {
            const detailRes = await axios.get(
              `${process.env.NEXT_PUBLIC_API_AUTH}/dummy-api/course/${course.slug}`
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
      console.log("Detailed Courses Fetched: ", detailedCourses);
    } catch (error) {
      console.error("Error fetching courses: ", error);
      set({ loading: false });
    }
  },
  fetchCourseDetail: async (slug: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_AUTH}/dummy-api/course/${slug}`
      );
      console.log("Detailed Courses Fetched: ", res.data);

      set({ lessons: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching course detail: ", error);
      set({ loading: false });
      throw error;
    }
  },
}));
