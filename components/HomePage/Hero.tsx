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
          <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
            <p className="text-gray-400 text-2xl">
              Solve Life Challenges with SEFT Learning
            </p>
            <h1 className="text-white font-bold text-8xl text-center mb-8">
              One Platform. <br /> Many Life Solutions.
            </h1>
            <div className="flex gap-2">
              <button className="bg-white text-black rounded-md p-2">Become a member</button>
              <button className="border border-white text-white rounded-md p-2">Explore Program</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
