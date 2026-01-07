import Image from "next/image";
import Bg from "@/assets/mvcom_header-bg_d.webp";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";

export default function HeroHomePage() {
  return (
    <>
      <div className=" w-full h-screen overflow-hidden">
        <Image
          src={Bg}
          alt=""
          fill
          placeholder="blur"
          quality={100}
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
        <div className="relative mx-auto w-5/6 p-20">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-white font-bold text-8xl text-center mb-8">
              A better you <br /> every day
            </h1>
            <p className="text-2xl text-[#CED1D7] font-medium">
              Be part of the world’s most powerful life transformation platform
            </p>
            <div className="w-full h-[600px] mt-9 rounded-xl"> 
              <VideoPlayer
                url="https://www.youtube.com/embed/vyzcyJJmBzc?si=1Gw7dy1J-VHO_5Zo"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
