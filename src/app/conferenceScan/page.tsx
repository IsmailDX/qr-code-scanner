

import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

export default function Home() {

  return (
    <main className="w-screen flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100 relative">
      <Head>
        <title>Mecoc 2025 QR Scan</title>
      </Head>

      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="absolute inset-0 z-0 blur-sm">
        <Image
          src="/bg.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <Image
        src="/mecoc-logo.png"
        alt="logo"
        width={300}
        height={300}
        objectFit="contain"
        priority
        className="z-20"
      />
      <div className="w-full z-10 max-w-[500px] mt-[4%]">
        <Link href="/future-steel">
          <p
            className="text-white mt-4 bg-[#186e5a] hover:bg-[#32947d] text-center max-sm:mb-3 border border-white 
        rounded-full px-4 py-2 w-full transition-all ease-in-out duration-200 cursor-pointer font-semibold capitalize"
          >
            Future steel
          </p>
        </Link>
        <Link href="/non-metallic">
          <p
            className="text-white mt-4 bg-[#a85b31] hover:bg-[#c56c3c] text-center max-sm:mb-3 border border-white 
        rounded-full px-4 py-2 w-full transition-all ease-in-out duration-200 cursor-pointer font-semibold capitalize"
          >
           Non metallic materials 
          </p>
        </Link>
        <Link href="/corrosion-and-coatings">
          <p
            className="text-white mt-4 bg-[#186e5a] hover:bg-[#32947d] text-center max-sm:mb-3 border border-white 
        rounded-full px-4 py-2 w-full transition-all ease-in-out duration-200 cursor-pointer font-semibold capitalize"
          >
           Corrosion and coatings
          </p>
        </Link>
      </div>
    </main>
  );
}