import Image from "next/image";
import Bg from "@/assets/mvcom_header-bg_d.webp";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";

export default function HeroHomePage() {
  return (
    <>
      <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-screen overflow-hidden">
        <Image
          src={Bg}
          alt=""
          fill
          placeholder="blur"
          quality={70}
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
        <div className="relative z-10 mx-auto w-11/12 md:w-5/6 px-4 sm:px-8 md:px-12 lg:px-20 py-10 md:py-20">
          <div className="flex flex-col items-center justify-center w-full h-full text-center">
            <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-6 md:mb-8">
              A better you <br /> every day
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-[#CED1D7] font-medium max-w-3xl">
              Be part of the world’s most powerful life transformation platform
            </p>
            <div className="mt-6 sm:mt-8 md:mt-10 rounded-xl bg-black/40 w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl aspect-video overflow-hidden shadow-lg">
              <VideoPlayer
                url="https://www.youtube.com/watch?v=vyzcyJJmBzc"
                playing
                playsInline
                muted
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
