import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function LessonTab({ data, slug }: { data?: any; slug?: string }) {
  const router = useRouter();
  const getImageUrl = (path: string | null) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;

    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `https://api.afzan.co/${cleanPath}`;
  };
  return (
    <>
      {data?.map((lesson: any) => (
        <div
          key={lesson.slug}
          className="p-4 border-b border-gray-700 hover:bg-gray-800 cursor-pointer transition-all ease-in-out duration-500"
          onClick={() => router.push(`/lesson/${slug}`)}
        >
          <div className="flex items-center">
            <Image
              src={getImageUrl(lesson.thumbnail)}
              alt={lesson.title}
              width={200}
              height={200}
              className="rounded-lg mr-4"
            />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">{lesson.title}</h2>
              <p className="text-sm text-gray-400">{lesson.description}</p>
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
  );
}
