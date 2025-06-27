import Navbar from "@/components/Navbar/navbar";
import Image from "next/image";
import Bg from "../assets/mvcom_header-bg_d.webp";

export default function Home() {
  return (
    <>
      <Navbar />
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
        {/* <div className="relative z-10">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-white font-bold text-8xl">
              A better you every day
            </h1>
          </div>
        </div> */}
      </div>
    </>
  );
}
