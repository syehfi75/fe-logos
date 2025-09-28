export type Thumbnail = {
  large: string | null;
  mid: string | null;
  small: string | null;
};

export type Course = {
  id: string;
  mentor_id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  status: "draft" | "publish" | "archived" | string;
  price: string;
  language: string;
  access_type: string;
  category: string;
  created_at: string; // "YYYY-MM-DD HH:mm:ss"
  updated_at: string;
  thumbnail: Thumbnail;
};

export type Lesson = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  duration: number;           // menit
  video_url: string;
  thumbnail: string | null;
  order: number;
  course_id?: number;         // opsional, diisi jika sumber nested
  course_slug?: string;       // opsional, diisi jika sumber nested
};
