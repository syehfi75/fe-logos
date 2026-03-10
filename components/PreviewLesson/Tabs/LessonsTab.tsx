import { ChevronRight, Lock } from "lucide-react"; // Tambahkan Lock icon
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
          className={`p-4 border-b border-gray-700 transition-all ease-in-out duration-500 ${
            lesson.is_locked 
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-800 cursor-pointer" 
          }`}
          onClick={() => {
            if (!lesson.is_locked) {
              router.push(`/lesson/${slug}`);
            }
          }}
        >
          <div className="flex items-center">
            <div className="relative mr-4 shrink-0">
              <Image
                src={getImageUrl(lesson.thumbnail)}
                alt={lesson.title}
                width={150}
                height={150}
                className="rounded-lg object-cover w-[120px] h-[80px] md:w-[150px] md:h-[100px]"
              />
              {lesson.is_locked && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                  <Lock className="text-white w-6 h-6" />
                </div>
              )}
            </div>

            <div className="flex flex-col overflow-hidden">
              <h2 className="text-md md:text-lg font-semibold truncate">
                {lesson.title}
              </h2>
              <p className="text-xs md:text-sm text-gray-400 line-clamp-1 md:line-clamp-2">
                {lesson.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {Math.floor(lesson.duration / 60)} minutes
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2 shrink-0">
              {lesson.is_locked ? (
                <Lock size={18} className="text-gray-500" />
              ) : (
                <ChevronRight className="text-gray-400" />
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}